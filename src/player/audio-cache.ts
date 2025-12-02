const DB_NAME = 'lizhi-player-audio-cache';
const STORE_NAME = 'audio';
const DB_VERSION = 1;

// 默认配置：无限容量，无限数量
const DEFAULT_MAX_COUNT = Infinity;
const DEFAULT_MAX_SIZE = Infinity;

// localStorage 键名
const KEY_MAX_COUNT = 'lizhi-player-cache-max-count';
const KEY_MAX_SIZE = 'lizhi-player-cache-max-size';

interface AudioRecord {
    songId: number;
    blob: Blob;
    updatedAt: number;
}

export interface CacheItemInfo {
    songId: number;
    size: number;
    updatedAt: number;
}

export interface StorageSettings {
    maxCount: number;
    maxSize: number; // bytes
}

const hasIndexedDb = typeof window !== 'undefined' && 'indexedDB' in window;
let dbPromise: Promise<IDBDatabase | null> | null = null;

/**
 * 打开 IndexedDB 数据库连接
 */
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

/**
 * 将 IDBRequest 转换为 Promise
 */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
    });
}

/**
 * 获取当前的存储设置
 */
export function getStorageSettings(): StorageSettings {
    if (typeof window === 'undefined') return { maxCount: DEFAULT_MAX_COUNT, maxSize: DEFAULT_MAX_SIZE };

    const countStr = localStorage.getItem(KEY_MAX_COUNT);
    const sizeStr = localStorage.getItem(KEY_MAX_SIZE);

    return {
        maxCount: countStr ? parseInt(countStr, 10) : DEFAULT_MAX_COUNT,
        maxSize: sizeStr ? parseInt(sizeStr, 10) : DEFAULT_MAX_SIZE,
    };
}

/**
 * 更新存储设置，并触发清理
 */
export async function setStorageSettings(settings: Partial<StorageSettings>) {
    if (settings.maxCount !== undefined) {
        localStorage.setItem(KEY_MAX_COUNT, settings.maxCount.toString());
    }
    if (settings.maxSize !== undefined) {
        localStorage.setItem(KEY_MAX_SIZE, settings.maxSize.toString());
    }

    const db = await openDatabase();
    if (db) {
        await pruneOverflow(db);
    }
}

/**
 * 根据设置的限制（数量和大小）清理缓存
 * 使用 LRU 策略（保留最近更新的，删除最旧的）
 */
async function pruneOverflow(db: IDBDatabase) {
    const { maxCount, maxSize } = getStorageSettings();

    // 如果都是无限，则无需清理
    if (maxCount === Infinity && maxSize === Infinity) return;

    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Failed to prune audio cache'));

        const store = tx.objectStore(STORE_NAME);
        const index = store.index('updatedAt');

        // 从最新的开始遍历 ('prev')
        // 累加保留的项目，一旦超过限制，后续的（更旧的）都删除
        const request = index.openCursor(null, 'prev');

        let accumulatedCount = 0;
        let accumulatedSize = 0;

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (!cursor) {
                return;
            }

            const record = cursor.value as AudioRecord;
            const size = record.blob.size;

            let deleteIt = false;

            // 检查数量限制
            if (maxCount !== Infinity && accumulatedCount >= maxCount) {
                deleteIt = true;
            }

            // 检查容量限制
            // 如果当前这个文件加入后会超过总容量，则删除它（因为它比前面累加的都要旧）
            if (!deleteIt && maxSize !== Infinity) {
                if (accumulatedSize + size > maxSize) {
                    deleteIt = true;
                }
            }

            if (deleteIt) {
                cursor.delete();
            } else {
                accumulatedCount++;
                accumulatedSize += size;
            }

            cursor.continue();
        };
    });
}

/**
 * 获取缓存的音频 Blob
 */
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

/**
 * 检查是否存在缓存
 */
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

/**
 * 写入缓存
 */
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

/**
 * 获取所有缓存项的信息
 */
export async function getAllCachedAudioInfo(): Promise<CacheItemInfo[]> {
    const db = await openDatabase();
    if (!db) return [];

    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('updatedAt');

    return new Promise((resolve) => {
        const results: CacheItemInfo[] = [];
        // 按更新时间倒序（最新的在前）
        const request = index.openCursor(null, 'prev');
        request.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                const record = cursor.value as AudioRecord;
                results.push({
                    songId: record.songId,
                    size: record.blob.size,
                    updatedAt: record.updatedAt,
                });
                cursor.continue();
            } else {
                resolve(results);
            }
        };
    });
}

/**
 * 删除指定歌曲的缓存
 */
export async function deleteCachedAudio(songId: number) {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await promisifyRequest(store.delete(songId));
}

/**
 * 清空所有缓存
 */
export async function clearAudioCache() {
    const db = await openDatabase();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await promisifyRequest(store.clear());
}
