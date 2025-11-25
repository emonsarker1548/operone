import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
    try {
        const { token, userId } = await request.json()

        if (!token || !userId) {
            return NextResponse.json(
                { error: 'Token and userId are required' },
                { status: 400 }
            )
        }

        // Verify user is authenticated
        const session = await auth()
        if (!session?.user || session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Generate a secure token if not provided
        const secureToken = token || generateToken()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        // Store token in database
        await prisma.desktopAuthToken.create({
            data: {
                token: secureToken,
                userId,
                expires: expiresAt
            }
        })

        return NextResponse.json({
            success: true,
            token: secureToken,
            expires: expiresAt
        })

    } catch (error) {
        console.error('Failed to store token:', error)
        return NextResponse.json(
            { error: 'Failed to store token' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            )
        }

        // Find and validate token
        const authToken = await prisma.desktopAuthToken.findFirst({
            where: {
                token,
                expires: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        if (!authToken) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            user: authToken.user,
            expires: authToken.expires
        })

    } catch (error) {
        console.error('Failed to validate token:', error)
        return NextResponse.json(
            { error: 'Failed to validate token' },
            { status: 500 }
        )
    }
}
