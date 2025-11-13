import { AnimatePresence, motion } from 'motion/react';
import type { PlayMode } from '@/types';

import IconRepeat from '@/icons/repeat.svg?react';
import IconRepeatOne from '@/icons/repeat-one.svg?react';
import IconShuffle from '@/icons/shuffle.svg?react';

interface PlayModeSwitchProps {
    className?: string;
    playMode: 'repeat' | 'repeat-one' | 'shuffle';
    onChange: (mode: 'repeat' | 'repeat-one' | 'shuffle') => void;
}

const playModeNext: Record<PlayMode, PlayMode> = {
    'repeat': 'repeat-one',
    'repeat-one': 'shuffle',
    'shuffle': 'repeat',
};

const playModeIconMap: Record<PlayMode, React.ReactNode> = {
    'repeat': <IconRepeat className="size-8" />,
    'repeat-one': <IconRepeatOne className="size-8" />,
    'shuffle': <IconShuffle className="size-8" />,
};

export default function PlayModeSwitch(props: PlayModeSwitchProps) {
    const { className, playMode, onChange } = props;

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
                    {playModeIconMap[playMode]}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}
