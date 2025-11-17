/**
 * @file 顶部返回栏
 */

import { motion } from 'motion/react';
import useBack from '@/hooks/use-back';
import IconLeftArrow from '@/icons/arrow-alt.svg?react';

interface BackBarProps {
    title: string;
}

export default function BackBar(props: BackBarProps) {
    const { title } = props;
    const back = useBack();
    return (
        <div className="pt-4 pl-4 mb-4">
            <motion.button
                className="flex gap-1 items-center"
                onTap={back}
                whileTap={{ scale: 0.97 }}
            >
                <IconLeftArrow className="size-6" />
                <span className="text-lg font-semibold">{title}</span>
            </motion.button>
        </div>
    );
}
