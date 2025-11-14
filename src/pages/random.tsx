import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { getAlbumById, getRandomSong } from '@/utils';
import LikeButton from '@/components/like-button';

import IconLeftArrow from '@/icons/arrow-alt.svg?react';
import IconListPlus from '@/icons/list-plus.svg?react';

export default function RandomPage() {
    const navigate = useNavigate();

    const songs = useMemo(() => getRandomSong(), []);

    return (
        <div className="pb-16">
            <div className="pt-4 pl-4 mb-4">
                <motion.button
                    className="flex gap-1 items-center "
                    onTap={() => navigate(-1)}
                    whileTap={{ scale: 0.97 }}
                >
                    <IconLeftArrow className="size-6" />
                    <span className="text-lg font-semibold">今日随机</span>
                </motion.button>
            </div>
            <ul className="px-4">
                {songs.map((song, songIndex) => (
                    <li key={song.songId} className="flex items-center py-2">
                        <span className="text-stone-400 mr-2.5 text-xs">{songIndex + 1}</span>
                        <span className="truncate">{song.name}</span>
                        <span className="shrink text-sm ml-1 text-stone-400 truncate">
                            {'· '}
                            {getAlbumById(song.albumId).name}
                        </span>
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
    );
}
