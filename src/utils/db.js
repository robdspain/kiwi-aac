/**
 * Simple IndexedDB wrapper for storing heavy media (Photos, Custom Audio)
 * This allows Kiwi to bypass the 5MB localStorage limit.
 */

const DB_NAME = 'KiwiMediaDB';
const STORE_NAME = 'media';
const DB_VERSION = 1;

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

export const saveMedia = async (id, data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(data, id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getMedia = async (id) => {
    if (!id) return null;
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteMedia = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

/**
 * Get all media items for export/sync
 */
export const getAllMedia = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        const keysRequest = store.getAllKeys();

        keysRequest.onsuccess = () => {
            const keys = keysRequest.result;
            request.onsuccess = () => {
                const values = request.result;
                const mediaMap = {};
                keys.forEach((key, index) => {
                    mediaMap[key] = values[index];
                });
                resolve(mediaMap);
            };
        };
        request.onerror = () => reject(request.error);
    });
};

/**
 * Bulk import media items
 */
export const importAllMedia = async (mediaMap) => {
    if (!mediaMap || Object.keys(mediaMap).length === 0) return;
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        Object.entries(mediaMap).forEach(([id, data]) => {
            store.put(data, id);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};
