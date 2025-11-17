import { motion } from 'motion/react';
import SmoothToggle from '@/components/smooth-toggle';
import { cn, isSamePlayList } from '@/utils';
import { useCurPlay, usePlayList, useStopPlay } from '@/stores/cur-play';
import type { Song } from '@/types';

import IconPlay from '@/icons/play.svg?react';
import IconPlayCircle from '@/icons/play-circle.svg?react';
import IconPause from '@/icons/pause.svg?react';
import IconPauseCircle from '@/icons/pause-circle.svg?react';

interface PlayButtonProps {
    list: Song[];
    stopPropagation?: boolean;
    className?: string;
    iconClassName?: string;
    content?: React.ReactNode;
    circleStyle?: boolean;
}

export default function PlayListButton(props: PlayButtonProps) {
    const { className, iconClassName, circleStyle = false, stopPropagation = true, content, list } = props;

    const curPlay = useCurPlay();
    const playList = usePlayList();
    const stopPlay = useStopPlay();

    const isSameList = isSamePlayList(curPlay?.list || [], list);

    return (
        <motion.button
            className={className}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
                if (stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}
            onTap={() => {
                if (isSameList && curPlay?.isPlaying) {
                    stopPlay();
                } else {
                    playList(list);
                }
            }}
        >
            <div className="relative">
                <SmoothToggle
                    isActive={Boolean(curPlay?.isPlaying) && isSameList}
                    inActive={
                        circleStyle
                            ? <IconPlayCircle className={cn('size-10', iconClassName)} />
                            : <IconPlay className={cn('size-10', iconClassName)} />
                    }
                    active={
                        circleStyle
                            ? <IconPauseCircle className={cn('size-10', iconClassName)} />
                            : <IconPause className={cn('size-10', iconClassName)} />
                    }
                />
            </div>
            {content}
        </motion.button>
    );
}
