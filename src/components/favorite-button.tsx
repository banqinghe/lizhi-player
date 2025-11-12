import { motion } from 'motion/react';
import { cn } from '@/utils';
import SmoothToggle from '@/components/smooth-toggle';
import IconHeart from '@/icons/heart.svg?react';
import IconHeartSolid from '@/icons/heart-solid.svg?react';

interface FavoriteButtonProps {
    className?: string;
    iconClassName?: string;
    isFavorite: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function FavoriteButton(props: FavoriteButtonProps) {
    const { className, iconClassName, isFavorite, onClick } = props;

    return (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={className}>
            <SmoothToggle
                isActive={isFavorite}
                inActive={<IconHeart className={iconClassName} />}
                active={<IconHeartSolid className={cn('text-red-400', iconClassName)} />}
            />
        </motion.button>
    );
}
