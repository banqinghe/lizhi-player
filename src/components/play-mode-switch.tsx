import { AnimatePresence, motion } from 'motion/react';
import type { PlayMode } from '@/types';
import { cn } from '@/utils';

import IconRepeat from '@/icons/repeat.svg?react';
import IconRepeatOne from '@/icons/repeat-one.svg?react';
import IconShuffle from '@/icons/shuffle.svg?react';

interface PlayModeSwitchProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    withText?: boolean;
    playMode: 'repeat' | 'repeat-one' | 'shuffle';
    onChange: (mode: 'repeat' | 'repeat-one' | 'shuffle') => void;
}

const playModeNext: Record<PlayMode, PlayMode> = {
    'repeat': 'repeat-one',
    'repeat-one': 'shuffle',
    'shuffle': 'repeat',
};

function getPlayModeIconMap(playMode: PlayMode, iconClassName?: string) {
    return {
        'repeat': <IconRepeat className={cn('size-8', iconClassName)} />,
        'repeat-one': <IconRepeatOne className={cn('size-8', iconClassName)} />,
        'shuffle': <IconShuffle className={cn('size-8', iconClassName)} />,
    }[playMode];
}
export default function PlayModeSwitch(props: PlayModeSwitchProps) {
    const { className, iconClassName, textClassName, playMode, onChange, withText } = props;

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onTap={() => onChange(playModeNext[playMode])}
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
