import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { VideoText } from './video-text'

interface FadeTextProps {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
    show?: boolean
}

export function FadeText({ 
    children, 
    className, 
    delay = 0, 
    duration = 0.8,
    show = true 
}: FadeTextProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: show ? 1 : 0
            }}
            transition={{ 
                duration,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smoother motion
                delay
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}

interface FadeVideoTextProps {
    src: string
    children: React.ReactNode
    fontSize?: number
    fontWeight?: string
    className?: string
    delay?: number
    duration?: number
    show?: boolean
}

export function FadeVideoText({ 
    src, 
    children, 
    fontSize = 12, 
    fontWeight = '900',
    className,
    delay = 0,
    duration = 1.2,
    show = true
}: FadeVideoTextProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: show ? 1 : 0
            }}
            transition={{ 
                duration,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smoother motion
                delay
            }}
            className={cn('w-full h-48 flex items-center justify-center', className)}
        >
            <VideoText
                src={src}
                fontSize={fontSize}
                fontWeight={fontWeight}
                className="w-full"
            >
                {children}
            </VideoText>
        </motion.div>
    )
}
