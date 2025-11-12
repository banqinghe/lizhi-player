import { motion } from 'motion/react';
import SmoothToggle from '@/components/smooth-toggle';
import IconPlay from '@/icons/play.svg?react';
import IconPause from '@/icons/pause.svg?react';
import { cn } from '@/utils';

interface PlayButtonProps {
    className?: string;
    iconClassName?: string;
    isPlaying: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PlayButton(props: PlayButtonProps) {
    const { className, iconClassName, isPlaying, onClick } = props;

    return (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={className}>
            <SmoothToggle
                isActive={isPlaying}
                inActive={<IconPlay className={cn('w-10 h-10', iconClassName)} />}
                active={<IconPause className={cn('w-10 h-10', iconClassName)} />}
            />
        </motion.button>
    );
}
