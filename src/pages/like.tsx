import { motion } from 'motion/react';
import { useLikeList } from '@/stores/like-list';
import { getAlbumById } from '@/utils';
import LikeButton from '@/components/like-button';
import BackBar from '@/components/back-bar';

import IconListPlus from '@/icons/list-plus.svg?react';

export default function LikePage() {
    const likeList = useLikeList();

    return (
        <div className="pb-16">
            <BackBar title="我的喜欢" />
            {likeList.length === 0
                ? (
                        <div className="text-center text-stone-400 mt-56">
                            你还没有喜欢的歌曲
                        </div>
                    )
                : (
                        <ul className="px-4">
                            {likeList.map((song, songIndex) => (
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
                    )}
        </div>
    );
}
