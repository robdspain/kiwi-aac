import { neon } from '@neondatabase/serverless';
import { Device } from '@capacitor/device';
import { getAllMedia, saveMedia } from '../utils/db';

const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

class RelationalSyncService {
    constructor() {
        this.sql = DATABASE_URL ? neon(DATABASE_URL) : null;
        this.deviceId = null;
    }

    async getPersistentId() {
        if (this.deviceId) return this.deviceId;
        try {
            const info = await Device.getId();
            this.deviceId = info.identifier;
        } catch (error) {
            // Fallback for web or if Device API fails
            this.deviceId = localStorage.getItem('kiwi_persistent_id');
            if (!this.deviceId) {
                this.deviceId = `web-${crypto.randomUUID()}`;
                localStorage.setItem('kiwi_persistent_id', this.deviceId);
            }
        }
        return this.deviceId;
    }

    isConfigured() {
        return !!this.sql;
    }

    /**
     * Restore data from Neon using the persistent device ID
     * This allows "restore without auth" after app reinstall
     */
    async restoreFromCloud() {
        if (!this.isConfigured()) return null;

        try {
            const deviceId = await this.getPersistentId();
            
            // 1. Find profile by device ID
            const profiles = await this.sql`
                SELECT id FROM profiles WHERE auth_user_id = ${deviceId}
            `;
            if (profiles.length === 0) return null;
            const parentId = profiles[0].id;

            // 2. Get child profile
            const children = await this.sql`
                SELECT * FROM child_profiles WHERE parent_id = ${parentId} LIMIT 1
            `;
            if (children.length === 0) return null;
            const child = children[0];

            // 3. Get contexts (boards)
            const contexts = await this.sql`
                SELECT context_name, symbols FROM contexts WHERE child_id = ${child.id}
            `;
            
            // 4. Get media
            const mediaResult = await this.sql`
                SELECT id, media_data FROM media WHERE child_id = ${child.id}
            `;

            // Transform back to local format
            const boards = {};
            contexts.forEach(c => {
                boards[c.context_name] = c.symbols;
            });

            // Save media back to local IndexedDB
            for (const item of mediaResult) {
                await saveMedia(item.id, item.media_data);
            }

            // Save symbols back to localStorage
            if (Object.keys(boards).length > 0) {
                Object.entries(boards).forEach(([contextName, data]) => {
                    // Only save if we don't have local data? Or overwrite?
                    // For restore, we overwrite.
                    localStorage.setItem(`kiwi-words-${contextName}`, JSON.stringify(data));
                });
            }

            return {
                profile: child,
                boards: boards
            };
        } catch (error) {
            console.error('Failed to restore from cloud:', error);
            return null;
        }
    }

    /**
     * Sync a single child profile and its related data
     */
    async syncChildProfile(profileId, profileData, contexts, progress, analytics) {
        if (!this.isConfigured()) return;

        try {
            const deviceId = await this.getPersistentId();
            
            const profileResult = await this.sql`
                INSERT INTO profiles (auth_user_id, email, name)
                VALUES (${deviceId}, ${null}, ${profileData.name})
                ON CONFLICT (auth_user_id) 
                DO UPDATE SET updated_at = NOW()
                RETURNING id
            `;
            const parentId = profileResult[0].id;

            // 2. Sync Child Profile
            const childResult = await this.sql`
                INSERT INTO child_profiles (parent_id, name, avatar, pecs_phase, skin_tone, literacy_enabled, onboarding_complete)
                VALUES (
                    ${parentId}, 
                    ${profileData.name}, 
                    ${profileData.avatar || '👤'}, 
                    ${profileData.pecs_phase || 1}, 
                    ${profileData.skin_tone || 'default'}, 
                    ${profileData.literacy_enabled || false}, 
                    ${profileData.onboarding_complete || false}
                )
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    avatar = EXCLUDED.avatar,
                    pecs_phase = EXCLUDED.pecs_phase,
                    updated_at = NOW()
                RETURNING id
            `;
            const childId = childResult[0].id;

            // 3. Sync Progress
            if (progress) {
                await this.sql`
                    INSERT INTO progress (child_id, progress_data)
                    VALUES (${childId}, ${progress})
                    ON CONFLICT (child_id) 
                    DO UPDATE SET progress_data = EXCLUDED.progress_data, updated_at = NOW()
                `;
            }

            // 4. Sync Contexts (Boards)
            for (const [name, symbols] of Object.entries(contexts)) {
                await this.sql`
                    INSERT INTO contexts (child_id, context_name, symbols)
                    VALUES (${childId}, ${name}, ${symbols})
                    ON CONFLICT (child_id, context_name) 
                    DO UPDATE SET symbols = EXCLUDED.symbols, updated_at = NOW()
                `;
            }

            // 5. Sync Analytics
            if (analytics) {
                await this.sql`
                    INSERT INTO analytics (child_id, analytics_data)
                    VALUES (${childId}, ${analytics})
                    ON CONFLICT (child_id) 
                    DO UPDATE SET analytics_data = EXCLUDED.analytics_data, updated_at = NOW()
                `;
            }

            console.log(`✅ Relational sync complete for profile: ${profileData.name}`);
            
            // 6. Efficient Media Sync (Async, don't block)
            this.syncMedia(childId).catch(e => console.error('Background media sync failed:', e));

            return childId;
        } catch (error) {
            console.error('Relational sync error:', error);
            throw error;
        }
    }

    /**
     * Efficiently sync media items
     * Only uploads if not already present in the relational media table
     */
    async syncMedia(childId) {
        if (!this.isConfigured() || !childId) return;
        
        try {
            const media = await getAllMedia();
            const localIds = Object.keys(media);
            if (localIds.length === 0) return;

            // Get existing media IDs for this child from Neon
            const remoteIdsResult = await this.sql`
                SELECT id FROM media WHERE child_id = ${childId}
            `;
            const remoteIds = new Set(remoteIdsResult.map(r => r.id));

            // Upload missing media
            for (const id of localIds) {
                if (!remoteIds.has(id)) {
                    console.log(`☁️ Uploading new media: ${id}`);
                    await this.sql`
                        INSERT INTO media (id, child_id, media_data)
                        VALUES (${id}, ${childId}, ${media[id]})
                        ON CONFLICT (id) DO NOTHING
                    `;
                }
            }
        } catch (error) {
            console.error('Media sync error:', error);
        }
    }
}

export const relationalSyncService = new RelationalSyncService();
export default relationalSyncService;
