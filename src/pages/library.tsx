import source from '@/source';

import IconSearch from '@/icons/search.svg?react';
import SongList from '@/components/song-list';

const albums = source.albums;

export default function Library() {
    return (
        <div className="px-4 pb-42">
            <div className="sticky top-0 z-10 pt-4 pb-4 bg-[#121212]">
                <div className="flex items-center bg-stone-800 py-2 pl-12 rounded">
                    <IconSearch className="absolute left-3 size-5 text-stone-300" />
                    <input
                        className="outline-none border-none"
                        type="text"
                        placeholder="搜索"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {albums.map(album => (
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
                ))}
            </div>
        </div>
    );
}
