import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { SermonStorage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
        const debugInfo: any = {
            env: {
                hasToken,
                NODE_ENV: process.env.NODE_ENV
            },
            blobs: [],
            storageList: []
        };

        if (hasToken) {
            try {
                let hasMore = true;
                let cursor: string | undefined;
                const allBlobs = [];

                while (hasMore) {
                    const { blobs, hasMore: more, cursor: nextCursor } = await list({ prefix: 'sermons/', cursor });
                    allBlobs.push(...blobs);
                    hasMore = more;
                    cursor = nextCursor;
                }

                // Sort by uploadedAt desc to see newest first
                allBlobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

                debugInfo.blobs = allBlobs.map(b => ({
                    pathname: b.pathname,
                    size: b.size,
                    uploadedAt: b.uploadedAt
                }));

                debugInfo.totalBlobs = allBlobs.length;

            } catch (e: any) {
                debugInfo.blobError = e.message;
            }
        }

        debugInfo.storageList = await SermonStorage.listSermons();

        return NextResponse.json(debugInfo, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
