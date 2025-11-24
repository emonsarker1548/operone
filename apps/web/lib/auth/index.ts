import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authConfig } from './auth.config'
import { prisma } from '../prisma'
import type { Adapter } from 'next-auth/adapters'
import Credentials from 'next-auth/providers/credentials'
import { verifyAuthenticationResponseForUser } from '../webauthn'

const nextAuth = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: 'webauthn',
      name: 'WebAuthn',
      credentials: {
        response: { label: 'Response', type: 'text' },
        challenge: { label: 'Challenge', type: 'text' },
      },
      async authorize(credentials) {
        const { response, challenge } = credentials as any
        
        if (!response || !challenge) return null

        try {
          const responseJson = JSON.parse(response)
          const credentialID = responseJson.id

          // Find authenticator
          const authenticator = await prisma.authenticator.findUnique({
            where: { credentialID },
            include: { user: true },
          })

          if (!authenticator) return null

          // Verify
          const verification = await verifyAuthenticationResponseForUser(
            responseJson,
            challenge,
            {
              credentialID: authenticator.credentialID,
              credentialPublicKey: authenticator.credentialPublicKey,
              counter: authenticator.counter,
            }
          )

          if (verification.verified) {
             // Update counter
             await prisma.authenticator.update({
               where: { credentialID },
               data: { counter: verification.authenticationInfo.newCounter },
             })

             return {
               id: authenticator.user.id,
               email: authenticator.user.email,
               name: authenticator.user.name,
               image: authenticator.user.image,
             }
          }
          return null
        } catch (e) {
          console.error('WebAuthn auth error:', e)
          return null
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
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
