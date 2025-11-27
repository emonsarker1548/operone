import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps {
    children: React.ReactNode
    className?: string
    show?: boolean
    fadeInDuration?: number
    fadeOutDuration?: number
    blurAmount?: number
    onComplete?: () => void
}

export function AnimatedContainer({
    children,
    className,
    show = true,
    fadeInDuration = 1.2,
    fadeOutDuration = 1.5,
    blurAmount = 20,
    onComplete
}: AnimatedContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{
                opacity: show ? 1 : 0,
                scale: 1,
                filter: show ? 'blur(0px)' : `blur(${blurAmount}px)`
            }}
            transition={{
                duration: show ? fadeInDuration : fadeOutDuration,
                ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic bezier for smoother motion
            }}
            onAnimationComplete={onComplete}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}
