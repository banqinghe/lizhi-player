import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { getAlbumById } from '@/utils';
import LikeButton from '@/components/like-button';

import IconPlay from '@/icons/play.svg?react';
import IconLeftArrow from '@/icons/arrow-alt.svg?react';
import IconListPlus from '@/icons/list-plus.svg?react';

export default function AlbumPage() {
    const { albumId: albumIdStr } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    const albumId = Number(albumIdStr);
    const album = getAlbumById(albumId);

    const isBadLink = !albumIdStr || Number.isNaN(albumId) || !album;

    useEffect(() => {
        if (isBadLink) {
            navigate('/404', { replace: true });
        }
    }, [isBadLink, navigate]);

    if (isBadLink) {
        return null;
    }

    console.log(album);

    return (
        <div>
            <div className="fixed inset-0 -z-10" style={{ background: `no-repeat url(${album.cover}) top center / auto 100% #121212` }} />
            <div
                className="min-h-[calc(100vh-56px)] pb-18 backdrop-blur-2xl"
                style={{ background: 'linear-gradient(#121212a0 0%, #121212 90%)' }}
            >
                <div className="flex gap-1 items-center pt-4 pl-4 mb-4">
                    <motion.button
                        onTap={() => navigate(-1)}
                        whileTap={{ scale: 0.97 }}
                    >
                        <IconLeftArrow className="size-6" />
                    </motion.button>
                    <span className="text-lg font-semibold">专辑</span>
                </div>
                <div>
                    <div className="flex justify-center gap-6 px-6 mb-6">
                        <img className="size-36 rounded" src={album.cover} alt={album.name} />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-semibold">{album.name}</h1>
                            {album.year > 0 && (
                                <div className="text-stone-400 text-sm mt-4">
                                    发行于
                                    {album.year}
                                    年
                                </div>
                            )}
                            <div className="text-stone-400 text-sm mt-1 mb-2">
                                共
                                {album.songs.length}
                                首
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center mt-auto pl-2 pr-4 py-1 w-fit bg-stone-50/10 text-stone-300 rounded-full"
                            >
                                <IconPlay className="size-8" />
                                <span>播放全部</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
                <ul className="px-4">
                    {album.songs.map((song, songIndex) => (
                        <li key={song.songId} className="flex items-center py-2">
                            <span className="text-stone-400 mr-2.5 text-xs">{songIndex + 1}</span>
                            <span className="shrink truncate">{song.name}</span>
                            <div className="flex gap-2 ml-auto">
                                <LikeButton songId={song.songId} />
                                <motion.button whileTap={{ scale: 0.97 }} className="">
                                    <IconListPlus className="size-7" />
                                </motion.button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
