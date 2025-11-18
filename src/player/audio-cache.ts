const DB_NAME = 'lizhi-player-audio-cache';
const STORE_NAME = 'audio';
const DB_VERSION = 1;
const MAX_ENTRIES = 30;

interface AudioRecord {
    songId: number;
    blob: Blob;
    updatedAt: number;
}

const hasIndexedDb = typeof window !== 'undefined' && 'indexedDB' in window;
let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDatabase(): Promise<IDBDatabase | null> {
    if (!hasIndexedDb) {
        return Promise.resolve(null);
    }
    if (!dbPromise) {
        dbPromise = new Promise<IDBDatabase | null>((resolve) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (db.objectStoreNames.contains(STORE_NAME)) {
                    return;
                }
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'songId' });
                store.createIndex('updatedAt', 'updatedAt', { unique: false });
            };
            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => {
                    db.close();
                    dbPromise = null;
                };
                resolve(db);
            };
            request.onerror = () => {
                console.warn(request.error ?? 'Failed to open audio cache database');
                resolve(null);
            };
        });
    }
    return dbPromise;
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
    });
}

async function pruneOverflow(db: IDBDatabase) {
    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to prune audio cache'));
        const store = tx.objectStore(STORE_NAME);
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const count = countRequest.result;
            if (count <= MAX_ENTRIES) {
                return;
            }
            let toDelete = count - MAX_ENTRIES;
            const index = store.index('updatedAt');
            index.openCursor().onsuccess = (event) => {
                if (toDelete <= 0) {
                    return;
                }
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (!cursor) {
                    return;
                }
                cursor.delete();
                toDelete -= 1;
                cursor.continue();
            };
        };
    }).catch((error) => {
        console.warn(error);
    });
}

export async function getCachedAudioBlob(songId: number): Promise<Blob | null> {
    const db = await openDatabase();
    if (!db) {
        return null;
    }
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    try {
        const record = (await promisifyRequest(store.get(songId))) as AudioRecord | undefined;
        return record?.blob ?? null;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

export async function hasCachedAudio(songId: number): Promise<boolean> {
    const db = await openDatabase();
    if (!db) {
        return false;
    }
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    try {
        const record = await promisifyRequest(store.getKey(songId));
        return record !== undefined;
    } catch (error) {
        console.warn(error);
        return false;
    }
}

export async function setCachedAudioBlob(songId: number, blob: Blob) {
    const db = await openDatabase();
    if (!db) {
        return;
    }
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    try {
        await promisifyRequest(store.put({ songId, blob, updatedAt: Date.now() } satisfies AudioRecord));
        await pruneOverflow(db);
    } catch (error) {
        console.warn(error);
    }
}
