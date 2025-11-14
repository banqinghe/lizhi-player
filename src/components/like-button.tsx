import { motion } from 'motion/react';
import { cn } from '@/utils';
import SmoothToggle from '@/components/smooth-toggle';
import IconHeart from '@/icons/heart.svg?react';
import IconHeartSolid from '@/icons/heart-solid.svg?react';
import { useLikeSet, useToggleLike } from '@/stores/like-list';

interface LikeButtonProps {
    className?: string;
    iconClassName?: string;
    songId: number;
}

export default function LikeButton(props: LikeButtonProps) {
    const { className, iconClassName, songId } = props;

    const likeSet = useLikeSet();
    const toggle = useToggleLike();

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={className}
            onClick={(e) => {
                e.stopPropagation();
                toggle(songId);
            }}
        >
            <SmoothToggle
                isActive={likeSet.has(songId)}
                inActive={<IconHeart className={iconClassName} />}
                active={<IconHeartSolid className={cn('text-red-400', iconClassName)} />}
            />
        </motion.button>
    );
}
