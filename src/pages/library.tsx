import { useState, useMemo, useTransition, useRef } from 'react';
import source from '@/source';
import SongList from '@/components/song-list';

import IconSearch from '@/icons/search.svg?react';
import IconClose from '@/icons/close.svg?react';

const albums = source.albums;

export default function Library() {
    const [inputValue, setInputValue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [, startTransition] = useTransition();
    const isComposingRef = useRef(false);

    // 根据搜索关键词过滤专辑和歌曲
    const filteredAlbums = useMemo(() => {
        if (!searchKeyword.trim()) {
            return albums;
        }

        const keyword = searchKeyword;

        return albums
            .map(album => ({
                ...album,
                songs: album.songs.filter(song =>
                    song.name.includes(keyword),
                ),
            }))
            .filter(album => album.songs.length > 0);
    }, [searchKeyword]);

    const handleInput = (value: string) => {
        setInputValue(value);
        // 如果正在使用输入法，不触发搜索
        if (!isComposingRef.current) {
            // 使用 startTransition 让输入响应更流畅
            startTransition(() => {
                setSearchKeyword(value);
            });
        }
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false;
        // 输入法结束时触发搜索
        const value = (e.target as HTMLInputElement).value;
        startTransition(() => {
            setSearchKeyword(value);
        });
    };

    const handleClear = () => {
        setInputValue('');
        startTransition(() => {
            setSearchKeyword('');
        });
    };

    return (
        <div className="px-4 pb-42">
            <div className="sticky top-0 z-10 pt-4 pb-4 bg-[#121212]">
                <div className="flex items-center bg-stone-800 py-2 pl-12 pr-12 rounded relative">
                    <IconSearch className="absolute left-3 size-5 text-stone-300" />
                    <input
                        className="outline-none border-none bg-transparent text-white w-full"
                        type="text"
                        placeholder="搜索"
                        value={inputValue}
                        onChange={e => handleInput(e.target.value)}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                    />
                    {inputValue && (
                        <button
                            className="absolute right-3 size-5 text-stone-300 hover:text-white transition-colors"
                            onClick={handleClear}
                            aria-label="清空搜索"
                        >
                            <IconClose className="size-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {filteredAlbums.length > 0
                    ? (
                            filteredAlbums.map(album => (
                                <div key={album.albumId}>
                                    <div className="flex items-center pb-3 mb-2 border-b border-stone-700">
                                        <img
                                            className="size-8 rounded mr-4"
                                            src={album.cover}
                                        />
                                        <div>
                                            <div className="flex items-center text-lg">
                                                {album.name}
                                                <span className="text-sm text-stone-200">
                                                    {album.year > 0 ? ` · ${album.year}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <SongList list={album.songs} />
                                </div>
                            ))
                        )
                    : (
                            <div className="text-center text-stone-400 py-8">
                                未找到匹配的歌曲
                            </div>
                        )}
            </div>
        </div>
    );
}
