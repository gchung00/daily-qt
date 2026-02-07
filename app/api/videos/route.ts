import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'videos.json');

export async function GET() {
    try {
        const data = await readFile(DATA_FILE, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        // Return default if file missing
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const videos = await request.json();

        if (!Array.isArray(videos)) {
            return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
        }

        await writeFile(DATA_FILE, JSON.stringify(videos, null, 2), 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
