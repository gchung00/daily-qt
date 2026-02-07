import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PIN = '9191';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        if (pin === ADMIN_PIN) {
            // Set a cookie to maintain session
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return NextResponse.json({ success: true });
}
