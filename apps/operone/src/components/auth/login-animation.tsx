import { useState, useEffect } from 'react'
import { FadeVideoText, FadeText } from '@/components/ui/fade-text'
import { AnimatedContainer } from '@/components/ui/animated-container'
import oceanVideo from '@/assets/ocean-small.webm'

interface LoginAnimationProps {
    userName: string
    onComplete: () => void
}

export function LoginAnimation({ userName, onComplete }: LoginAnimationProps) {
    const [phase, setPhase] = useState<'fadeIn' | 'showAppName' | 'showUser' | 'fadeOut' | 'complete'>('fadeIn')

    useEffect(() => {
        // Phase 1: Fade in with app name (1.5s)
        const fadeInTimer = setTimeout(() => {
            setPhase('showAppName')
        }, 1500)

        // Phase 2: Show user name after 2s
        const showUserTimer = setTimeout(() => {
            setPhase('showUser')
        }, 3500) // 1500 + 2000

        // Phase 3: Show both for 2.5s, then fade out
        const fadeOutTimer = setTimeout(() => {
            setPhase('fadeOut')
        }, 6000) // 1500 + 2000 + 2500

        // Phase 4: Complete (total 7.5s)
        const completeTimer = setTimeout(() => {
            setPhase('complete')
            onComplete()
        }, 7500) // 1500 + 2000 + 2500 + 1500

        return () => {
            clearTimeout(fadeInTimer)
            clearTimeout(showUserTimer)
            clearTimeout(fadeOutTimer)
            clearTimeout(completeTimer)
        }
    }, [onComplete])

    if (phase === 'complete') {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <AnimatedContainer
                show={phase === 'fadeIn' || phase === 'showAppName' || phase === 'showUser' || phase === 'fadeOut'}
                fadeInDuration={1.5}
                fadeOutDuration={1.8}
                blurAmount={25}
                className="flex flex-col items-center justify-center gap-2 w-full max-w-4xl px-8"
            >
                {/* VideoText on top */}
                <FadeVideoText
                    src={oceanVideo}
                    fontSize={12}
                    fontWeight="900"
                    show={phase === 'fadeIn' || phase === 'showAppName' || phase === 'showUser'}
                    duration={1.5}
                >
                    OPERONE
                </FadeVideoText>

                {/* User name below - smaller, with "Welcome" */}
                <FadeText
                    show={phase === 'showUser' || phase === 'fadeOut'}
                    duration={1.2}
                    className="text-3xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                    Welcome, {userName}
                </FadeText>
            </AnimatedContainer>
        </div>
    )
}
