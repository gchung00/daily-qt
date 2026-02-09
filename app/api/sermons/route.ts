import { NextResponse } from 'next/server';
import { SermonStorage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { parseSermon } from '@/lib/parser';

export const dynamic = 'force-dynamic'; // Prevent caching at the route level

const INDEX_FILE = path.join(process.cwd(), 'data', 'sermons-index.json');

async function updateIndex(date: string, text: string | null) {
    try {
        if (!fs.existsSync(INDEX_FILE)) return;

        const content = fs.readFileSync(INDEX_FILE, 'utf-8');
        let index = JSON.parse(content);

        if (text) {
            // Add/Update
            const parsed = parseSermon(text);
            parsed.date = date; // Ensure date is set

            // Remove existing entry for this date if exists
            index = index.filter((s: any) => s.date !== date);
            index.push(parsed);
        } else {
            // Delete
            index = index.filter((s: any) => s.date !== date);
        }

        // Sort descending
        index.sort((a: any, b: any) => b.date.localeCompare(a.date));

        fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
    } catch (e) {
        console.error("Failed to update index:", e);
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    try {
        if (date) {
            // Get specific sermon content
            const text = await SermonStorage.getSermon(date);
            return NextResponse.json({ text: text || '', date });
        } else {
            // List all sermons
            const dates = await SermonStorage.listSermons();
            return NextResponse.json(dates);
        }
    } catch (error) {
        console.error("GET Sermons Error:", error);
        return NextResponse.json([]);
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    try {
        await SermonStorage.deleteSermon(date);

        // Update Index
        await updateIndex(date, null);

        // Invalidate caches - Force refresh all pages
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { text, date, force } = await request.json();

        if (!text || !date) {
            return NextResponse.json({ error: 'Missing text or date' }, { status: 400 });
        }

        // Simple date format check
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        const success = await SermonStorage.saveSermon(date, text, force);

        if (!success) {
            return NextResponse.json(
                { error: 'Duplicate sermon', message: '이미 해당 날짜에 설교가 등록되어 있습니다.' },
                { status: 409 }
            );
        }

        // Update Index
        await updateIndex(date, text);

        // Invalidate caches
        revalidatePath('/', 'layout'); // Force refresh all pages to show new content immediately

        return NextResponse.json({
            success: true,
            savedDate: date,
            message: `설교가 성공적으로 저장되었습니다. (${date})`
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        // Return the specific error message from storage logic
        return NextResponse.json({
            error: 'Server error',
            message: error.message || '저장 중 알 수 없는 오류가 발생했습니다.'
        }, { status: 500 });
    }
}
