import { useMemo } from 'react';
import { Link } from 'react-router';
import diceUrl from '@/images/dice.webp';
import likeUrl from '@/images/like.jpeg';
import source from '@/source';
import PlayListButton from '@/components/play-list-button';
import { useLikeList } from '@/stores/like-list';
import { getRandomSong } from '@/utils';

const albums = source.albums;

export default function Albums() {
    const likeList = useLikeList();
    const dailyRandomList = useMemo(() => getRandomSong(), []);

    return (
        <div className="relative px-4 pt-6 pb-42">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Link
                    to="/like"
                    className="relative h-24 p-2 rounded-lg overflow-hidden font-bold"
                    style={{ background: `url(${likeUrl}) center / cover` }}
                >
                    <span>我的喜欢</span>
                    <PlayListButton
                        className="absolute right-1 bottom-1"
                        list={likeList}
                    />
                </Link>
                <Link
                    to="/random"
                    className="relative h-24 p-2 rounded-lg overflow-hidden font-bold"
                    style={{ background: `url(${diceUrl}) center / cover` }}
                >
                    <span>今日随机</span>
                    <PlayListButton
                        className="absolute right-1 bottom-1"
                        list={dailyRandomList}
                    />
                </Link>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">专辑</h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                    {albums.map(album => (
                        <div key={album.albumId}>
                            <Link
                                to={`/album/${album.albumId}`}
                                className="relative block w-full aspect-square mb-2 rounded-lg"
                                style={{ background: `url(${album.cover}) center / cover` }}
                            >
                                <PlayListButton
                                    className="absolute right-1 bottom-1"
                                    list={album.songs}
                                />
                            </Link>
                            <div className="text-xs">
                                {album.name}
                                <span className="text-stone-200">
                                    {album.year > 0 ? ` · ${album.year}` : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
