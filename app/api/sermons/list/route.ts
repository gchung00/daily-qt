import { NextResponse } from 'next/server';
import { getAllSermons } from '@/lib/sermons';
import { getBookFromReference } from '@/lib/bible';

// Force dynamic to ensure we get fresh data/logs
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    try {
        // Optimization: In a real app with DB, we would query ONLY that book.
        // With file system, we still scan, but at least it's an API call, not blocking page render.
        // FUTURE: Implement a real index (JSON file) to avoid scanning all files.
        const allSermons = await getAllSermons();

        if (!bookId) {
            // If no book specified, maybe return empty or cached metadata?
            // For now, let's just return everything if they ask, but the UI won't ask.
            return NextResponse.json(allSermons);
        }

        if (bookId === 'others') {
            const others = allSermons.filter(s => {
                const mainScripture = s.sections.find(sec => sec.type === 'scripture_main') as any;
                const ref = mainScripture?.reference || '';
                return !getBookFromReference(ref);
            });
            return NextResponse.json(others);
        }

        const filtered = allSermons.filter(s => {
            const mainScripture = s.sections.find(sec => sec.type === 'scripture_main') as any;
            const ref = mainScripture?.reference || '';
            const book = getBookFromReference(ref);
            return book?.id === bookId;
        });

        return NextResponse.json(filtered);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch sermons' }, { status: 500 });
    }
}
