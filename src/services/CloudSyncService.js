import { neon } from '@neondatabase/serverless';
import LZString from 'lz-string';
import { getAllMedia, importAllMedia } from '../utils/db';
import { relationalSyncService } from './RelationalSyncService';

const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

class CloudSyncService {
    constructor() {
        this.sql = DATABASE_URL ? neon(DATABASE_URL) : null;
    }

    isConfigured() {
        return !!this.sql;
    }

    /**
     * Generate a random 8-character sync code
     * Increased from 6 to 8 for better security against brute-force
     */
    generateSyncCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Get all local data including localStorage and optionally IndexedDB media
     */
    async getFullLocalData(includeMedia = true) {
        const localData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('kiwi') || key.startsWith('kians') || key === 'kiwi_active_sync_code') {
                try {
                    const value = localStorage.getItem(key);
                    localData[key] = (value === 'true' || value === 'false') ? (value === 'true') : JSON.parse(value);
                } catch {
                    localData[key] = localStorage.getItem(key);
                }
            }
        }

        const mediaData = includeMedia ? await getAllMedia() : null;

        return {
            localStorage: localData,
            media: mediaData
        };
    }

    /**
     * Upload data using both relational and blob fallback
     */
    async uploadData(existingCode = null, includeMedia = true) {
        if (!this.isConfigured()) {
            console.warn('Neon Database URL is not configured. Cloud sync disabled.');
            return existingCode;
        }

        const syncCode = (existingCode || this.generateSyncCode()).toUpperCase();
        const fullData = await this.getFullLocalData(includeMedia);
        
        // 1. Relational Sync (Parallel)
        // This addresses the "Orphaned Schema" issue by populating relational tables
        try {
            const profiles = fullData.localStorage['kiwi-profiles'] || [];
            const currentProfileId = fullData.localStorage['kiwi-current-profile'] || 'default';
            const currentProfile = profiles.find(p => p.id === currentProfileId) || { id: 'default', name: 'Default' };
            
            // Extract contexts and progress
            const contexts = {};
            const contextKeys = Object.keys(fullData.localStorage).filter(k => k.startsWith('kiwi-words-'));
            contextKeys.forEach(k => {
                contexts[k.replace('kiwi-words-', '')] = fullData.localStorage[k];
            });

            const progress = fullData.localStorage['kians-progress'];
            const analytics = fullData.localStorage['kiwi-analytics']; // Assume analytics key

            // syncChildProfile also triggers syncMedia internally
            await relationalSyncService.syncChildProfile(
                currentProfile.id,
                currentProfile,
                contexts,
                progress,
                analytics
            );
        } catch (e) {
            console.warn('Relational sync failed, continuing with blob backup:', e);
        }

        // 2. Blob Backup (Legacy support and catch-all)
        const payload = {
            version: '2.1', // Bumped version for 8-char code and performance
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
            console.error('Error during cloud restore:', error);
            return null;
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
            } catch {
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
                // For auto-sync, we exclude media from the large blob
                // because relationalSyncService handles media incrementally
                await this.uploadData(code, false);
                console.log('✅ Auto-sync complete (relational media + lightweight blob)');
            } catch (e) {
                console.warn('Auto-sync failed:', e);
            }
        }
    }
}

export const cloudSyncService = new CloudSyncService();
export default cloudSyncService;