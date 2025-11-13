import { motion } from 'motion/react';
import SmoothToggle from '@/components/smooth-toggle';
import { cn } from '@/utils';

import IconPlay from '@/icons/play.svg?react';
import IconPlayCircle from '@/icons/play-circle.svg?react';
import IconPause from '@/icons/pause.svg?react';
import IconPauseCircle from '@/icons/pause-circle.svg?react';

interface PlayButtonProps {
    className?: string;
    iconClassName?: string;
    circleStyle?: boolean;
    isPlaying: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PlayButton(props: PlayButtonProps) {
    const { className, iconClassName, circleStyle = false, isPlaying, onClick } = props;

    return (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={className}>
            <SmoothToggle
                isActive={isPlaying}
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
        </motion.button>
    );
}
