import { motion } from 'motion/react';
import LikeButton from '@/components/like-button';
import { useAddToNextPlay, useCurPlay, usePlay } from '@/stores/cur-play';
import { getAlbumById } from '@/utils';
import type { Song } from '@/types';

import IconPlaying from '@/icons/playing.svg?react';
import IconListPlus from '@/icons/list-plus.svg?react';

interface SongListProps {
    className?: string;
    showAlbumName?: boolean;
    list: Song[];
}

export default function SongList(props: SongListProps) {
    const { list, className, showAlbumName = false } = props;

    const curPlay = useCurPlay();
    const play = usePlay();
    const addToNext = useAddToNextPlay();

    return (
        <ul className={className}>
            {list.map((song, songIndex) => (
                <li
                    key={song.songId}
                    className="flex items-center py-2"
                    onClick={() => play(song.songId)}
                >
                    <span className="text-stone-400 mr-2.5 text-xs">{songIndex + 1}</span>
                    <span className="shrink truncate">{song.name}</span>
                    {showAlbumName && (
                        <span className="shrink text-sm ml-1 text-stone-400 truncate">
                            {'· '}
                            {getAlbumById(song.albumId).name}
                        </span>
                    )}
                    {song.songId === curPlay?.song.songId && (
                        <IconPlaying className="size-3 ml-2" />
                    )}
                    <div className="flex gap-2 ml-auto" onClick={e => e.stopPropagation()}>
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
    );
}
