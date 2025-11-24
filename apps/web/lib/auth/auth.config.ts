import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuthSuccess = nextUrl.pathname.startsWith('/auth-success')
      const isFromDesktop = nextUrl.searchParams.get('from') === 'desktop'

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If coming from desktop, redirect to auth-success
        if (isFromDesktop) {
           // Avoid infinite redirect if already on auth-success
           if (isOnAuthSuccess) return true
           return Response.redirect(new URL('/auth-success?from=desktop', nextUrl))
        }
        
        // Allow access to auth-success
        if (isOnAuthSuccess) return true

        // Default redirect to dashboard
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig
