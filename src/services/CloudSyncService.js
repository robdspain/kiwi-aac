import { neon } from '@neondatabase/serverless';
import LZString from 'lz-string';
import { getAllMedia, importAllMedia } from '../utils/db';

const TABLE_NAME = 'kiwi_sync';
const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

class CloudSyncService {
    constructor() {
        this.sql = DATABASE_URL ? neon(DATABASE_URL) : null;
    }

    isConfigured() {
        return !!this.sql;
    }

    /**
     * Generate a random 6-character sync code
     */
    generateSyncCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Get all local data including localStorage and IndexedDB media
     */
    async getFullLocalData() {
        const localData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('kiwi') || key.startsWith('kians') || key === 'kiwi_active_sync_code') {
                try {
                    localData[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    localData[key] = localStorage.getItem(key);
                }
            }
        }

        const mediaData = await getAllMedia();

        return {
            localStorage: localData,
            media: mediaData
        };
    }

    /**
     * Upload full payload to Neon
     */
    async uploadData(existingCode = null) {
        if (!this.isConfigured()) {
            console.warn('Neon Database URL is not configured. Cloud sync disabled.');
            return existingCode;
        }

        const syncCode = (existingCode || this.generateSyncCode()).toUpperCase();
        const fullData = await this.getFullLocalData();
        
        const payload = {
            version: '2.0', // Bumped version for media support
            timestamp: new Date().toISOString(),
            ...fullData
        };

        // Compress full payload
        const compressedData = LZString.compressToUTF16(JSON.stringify(payload));

        try {
            await this.sql`
                INSERT INTO kiwi_sync (sync_code, data, last_updated)
                VALUES (${syncCode}, ${compressedData}, NOW())
                ON CONFLICT (sync_code) 
                DO UPDATE SET data = EXCLUDED.data, last_updated = NOW()
            `;
            return syncCode;
        } catch (error) {
            console.error('Cloud upload error:', error);
            throw new Error('Failed to upload data to cloud.');
        }
    }

    /**
     * Download and apply full payload
     */
    async downloadAndApply(syncCode) {
        if (!this.isConfigured()) {
            throw new Error('Cloud Sync is not configured.');
        }

        const normalizedCode = syncCode.toUpperCase();
        
        try {
            const results = await this.sql`
                SELECT data FROM kiwi_sync WHERE sync_code = ${normalizedCode}
            `;

            if (!results || results.length === 0) {
                throw new Error('Invalid sync code or data not found.');
            }

            const data = results[0].data;
            let payload;
            
            try {
                const decompressed = LZString.decompressFromUTF16(data);
                payload = JSON.parse(decompressed);
            } catch (e) {
                // Compatibility for uncompressed or old versions
                payload = JSON.parse(data);
            }

            if (!payload) throw new Error('Empty payload');

            // 1. Apply localStorage
            if (payload.localStorage) {
                Object.entries(payload.localStorage).forEach(([key, value]) => {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });
            } else if (payload.data) { // Compatibility with v1.0
                Object.entries(payload.data).forEach(([key, value]) => {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });
            }

            // 2. Apply Media (IndexedDB)
            if (payload.media) {
                await importAllMedia(payload.media);
            }

            return payload;
        } catch (error) {
            console.error('Cloud download error:', error);
            throw error;
        }
    }

    async joinTeam(syncCode) {
        const payload = await this.downloadAndApply(syncCode);
        localStorage.setItem('kiwi_active_sync_code', syncCode.toUpperCase());
        return payload;
    }

    getActiveSyncCode() {
        return localStorage.getItem('kiwi_active_sync_code');
    }

    async autoSync() {
        const code = this.getActiveSyncCode();
        if (code && this.isConfigured()) {
            try {
                await this.uploadData(code);
                console.log('✅ Auto-sync complete (including media)');
            } catch (e) {
                console.warn('Auto-sync failed:', e);
            }
        }
    }
}

export const cloudSyncService = new CloudSyncService();
export default cloudSyncService;