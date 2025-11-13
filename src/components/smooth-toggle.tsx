import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SmoothToggleProps {
    inActive: ReactNode;
    active: ReactNode;
    isActive: boolean;
}

export default function SmoothToggle(props: SmoothToggleProps) {
    const { inActive, active, isActive } = props;

    return (
        <AnimatePresence mode="popLayout">
            {isActive
                ? (
                        <motion.div
                            key="active"
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(3px)' }}
                            transition={{ duration: 0.05 }}
                        >
                            {active}
                        </motion.div>
                    )
                : (
                        <motion.div
                            key="inactive"
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(3px)' }}
                            transition={{ duration: 0.05 }}
                        >
                            {inActive}
                        </motion.div>
                    )}
        </AnimatePresence>
    );
}
