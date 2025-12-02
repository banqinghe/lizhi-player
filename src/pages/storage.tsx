import { useState, useEffect, useMemo } from 'react';
import source from '@/source';
import {
    getAllCachedAudioInfo,
    deleteCachedAudio,
    clearAudioCache,
    getStorageSettings,
    setStorageSettings,
    type CacheItemInfo,
    type StorageSettings,
} from '@/player/audio-cache';
import IconClose from '@/icons/close.svg?react';

// Helper to format bytes
function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Helper to find song info
const allSongs = source.albums.flatMap(album => album.songs.map(song => ({ ...song, cover: album.cover })));
const songMap = new Map(allSongs.map(song => [song.songId, song]));

export default function StoragePage() {
    const [items, setItems] = useState<CacheItemInfo[]>([]);
    const [settings, setSettings] = useState<StorageSettings>({ maxCount: Infinity, maxSize: Infinity });

    const fetchData = async () => {
        const data = await getAllCachedAudioInfo();
        setItems(data);
        setSettings(getStorageSettings());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalSize = useMemo(() => items.reduce((acc, item) => acc + item.size, 0), [items]);

    const handleDelete = async (songId: number) => {
        await deleteCachedAudio(songId);
        await fetchData(); // Refresh list
    };

    const handleClearAll = async () => {
        if (confirm('确定要清空所有缓存吗？')) {
            await clearAudioCache();
            await fetchData();
        }
    };

    const updateSetting = async (key: keyof StorageSettings, value: number) => {
        await setStorageSettings({ [key]: value });
        fetchData();
    };

    return (
        <div className="pb-48 pt-4 min-h-screen">
            <div className="px-4 space-y-6">
                {/* Stats Card */}
                <div className="bg-stone-900 rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <div className="text-sm text-stone-400">已占用空间</div>
                        <div className="text-2xl font-bold">{formatBytes(totalSize)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-stone-400">已缓存歌曲</div>
                        <div className="text-2xl font-bold">
                            {items.length}
                            {' '}
                            首
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">存储设置</h3>

                    <div className="flex items-center justify-between">
                        <label className="text-sm">最大歌曲数量</label>
                        <input
                            type="number"
                            placeholder="无限"
                            className="bg-stone-900 rounded px-3 py-2 w-32 text-right outline-none focus:ring-2 focus:ring-primary"
                            value={settings.maxCount === Infinity ? '' : settings.maxCount}
                            onChange={(e) => {
                                const val = e.target.value === '' ? Infinity : parseInt(e.target.value);
                                setSettings(prev => ({ ...prev, maxCount: val }));
                            }}
                            onBlur={(e) => {
                                const val = e.target.value === '' ? Infinity : parseInt(e.target.value);
                                updateSetting('maxCount', val);
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm">最大占用空间 (MB)</label>
                        <input
                            type="number"
                            placeholder="无限"
                            className="bg-stone-900 rounded px-3 py-2 w-32 text-right outline-none focus:ring-2 focus:ring-primary"
                            value={settings.maxSize === Infinity ? '' : Math.floor(settings.maxSize / 1024 / 1024)}
                            onChange={(e) => {
                                const val = e.target.value === '' ? Infinity : parseInt(e.target.value) * 1024 * 1024;
                                setSettings(prev => ({ ...prev, maxSize: val }));
                            }}
                            onBlur={(e) => {
                                const val = e.target.value === '' ? Infinity : parseInt(e.target.value) * 1024 * 1024;
                                updateSetting('maxSize', val);
                            }}
                        />
                    </div>
                    <p className="text-xs text-stone-500">
                        当超出限制时，将自动删除最早缓存的歌曲。
                    </p>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">已缓存内容</h3>
                        {items.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-sm text-red-500 hover:text-red-400 px-3 py-1 rounded-full bg-red-900/20"
                            >
                                清空所有
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {items.length === 0
                            ? (
                                    <div className="text-center py-8 text-stone-600">
                                        暂无缓存内容
                                    </div>
                                )
                            : (
                                    items.map((item) => {
                                        const song = songMap.get(item.songId);
                                        if (!song) return null;
                                        return (
                                            <div
                                                key={item.songId}
                                                className="flex items-center gap-3 bg-stone-900 p-3 rounded-lg"
                                            >
                                                <img
                                                    src={song.cover}
                                                    alt={song.name}
                                                    className="size-10 rounded object-cover bg-stone-800"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{song.name}</div>
                                                    <div className="text-xs text-stone-400">{formatBytes(item.size)}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(item.songId)}
                                                    className="p-2 text-stone-500 hover:text-red-500 transition-colors"
                                                >
                                                    <IconClose className="size-5" />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                    </div>
                </div>
            </div>
        </div>
    );
}
