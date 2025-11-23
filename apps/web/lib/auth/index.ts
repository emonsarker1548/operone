import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authConfig } from './config'
import { prisma } from '../prisma'
import type { Adapter } from 'next-auth/adapters'

const nextAuth = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return

      try {
        const { headers } = await import('next/headers')
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || 'Unknown IP'
        const userAgent = headersList.get('user-agent') || 'Unknown Device'
        
        // Simple heuristic to detect Electron app if we add a custom UA later
        // or just rely on the user agent string containing 'Electron' if standard
        const isElectron = userAgent.includes('Electron') || userAgent.includes('OperonDesktop')
        const platform = isElectron ? 'Operon Desktop App' : 'Web Browser'

        const { sendLoginNotification } = await import('../mail')
        
        await sendLoginNotification({
          email: user.email,
          name: user.name,
          time: new Date(),
          ip,
          userAgent,
          platform
        })
      } catch (error) {
        console.error('Error sending login notification:', error)
      }
    },
  },
})

export const handlers = nextAuth.handlers
export const signIn = nextAuth.signIn as any
export const signOut = nextAuth.signOut
export const auth = nextAuth.auth as any
