import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cbs54@hanmail.net';
const ADMIN_PIN = process.env.ADMIN_PIN || '9191';

export async function POST(request: Request) {
    try {
        const { email, pin } = await request.json();

        // Case-insensitive email check
        const isValidEmail = email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const isValidPin = pin === ADMIN_PIN;

        if (isValidEmail && isValidPin) {
            // Set a cookie to maintain session
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid Email or PIN' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return NextResponse.json({ success: true });
}
