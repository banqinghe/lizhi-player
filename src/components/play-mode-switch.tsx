import { AnimatePresence, motion } from 'motion/react';
import type { PlayMode } from '@/types';
import { cn } from '@/utils';
import { useCurPlay, useNextPlayMode } from '@/stores/cur-play';

import IconRepeat from '@/icons/repeat.svg?react';
import IconRepeatOne from '@/icons/repeat-one.svg?react';
import IconShuffle from '@/icons/shuffle.svg?react';

interface PlayModeSwitchProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    withText?: boolean;
}

function getPlayModeIconMap(playMode: PlayMode, iconClassName?: string) {
    return {
        'repeat': <IconRepeat className={cn('size-8', iconClassName)} />,
        'repeat-one': <IconRepeatOne className={cn('size-8', iconClassName)} />,
        'shuffle': <IconShuffle className={cn('size-8', iconClassName)} />,
    }[playMode];
}
export default function PlayModeSwitch(props: PlayModeSwitchProps) {
    const { className, iconClassName, textClassName, withText } = props;

    const playMode = useCurPlay()?.playMode || 'repeat';
    const nextPlayMode = useNextPlayMode();

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onTap={nextPlayMode}
            className={className}
        >
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={playMode}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(5px)' }}
                    transition={{ duration: 0.05 }}
                >
                    {getPlayModeIconMap(playMode, iconClassName)}
                </motion.div>
            </AnimatePresence>
            {withText && (
                <span className={cn('ml-2 text-sm select-none', textClassName)}>
                    {{
                        'repeat': '列表循环',
                        'repeat-one': '单曲循环',
                        'shuffle': '随机播放',
                    }[playMode]}
                </span>
            )}
        </motion.button>
    );
}
