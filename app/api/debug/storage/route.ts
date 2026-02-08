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
                const { blobs } = await list({ prefix: 'sermons/' });
                debugInfo.blobs = blobs.map(b => ({
                    pathname: b.pathname,
                    size: b.size,
                    uploadedAt: b.uploadedAt
                }));
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
