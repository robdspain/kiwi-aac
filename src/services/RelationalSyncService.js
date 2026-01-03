import { neon } from '@neondatabase/serverless';
import { supabase } from '../lib/supabase';
import { getAllMedia } from '../utils/db';

const DATABASE_URL = import.meta.env.VITE_NEON_DATABASE_URL;

class RelationalSyncService {
    constructor() {
        this.sql = DATABASE_URL ? neon(DATABASE_URL) : null;
    }

    isConfigured() {
        return !!this.sql;
    }

    /**
     * Sync a single child profile and its related data
     */
    async syncChildProfile(profileId, profileData, contexts, progress, analytics) {
        if (!this.isConfigured()) return;

        try {
            // 1. Ensure parent profile exists (using a placeholder if no auth)
            const authUser = (await supabase?.auth.getUser())?.data.user;
            const authUserId = authUser?.id || `anon-${profileId}`;
            
            const profileResult = await this.sql`
                INSERT INTO profiles (auth_user_id, email, name)
                VALUES (${authUserId}, ${authUser?.email || null}, ${profileData.name})
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
