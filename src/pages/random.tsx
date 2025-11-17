import { useMemo } from 'react';
import { motion } from 'motion/react';
import { getAlbumById, getRandomSong } from '@/utils';
import LikeButton from '@/components/like-button';
import { useAddToNextPlay } from '@/stores/cur-play';
import BackBar from '@/components/back-bar';

import IconListPlus from '@/icons/list-plus.svg?react';

export default function RandomPage() {
    const addToNext = useAddToNextPlay();

    const songs = useMemo(() => getRandomSong(), []);

    return (
        <div className="pb-16">
            <BackBar title="今日随机" />
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
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => addToNext(song.songId)}
                            >
                                <IconListPlus className="size-7" />
                            </motion.button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
