import { NextResponse } from 'next/server';
import { getLatestSermon, getSermonDates } from '@/lib/sermons';
import { join } from 'path';
import { readdir } from 'fs/promises';

export async function GET() {
    try {
        const cwd = process.cwd();
        const sermonsDir = join(cwd, 'sermons');

        let files: string[] = [];
        try {
            files = await readdir(sermonsDir);
        } catch (e) {
            files = [`Error listing dir: ${e}`];
        }

        const dates = await getSermonDates();
        const latest = await getLatestSermon();

        return NextResponse.json({
            cwd,
            sermonsDir,
            filesInDir: files,
            datesFromLib: dates,
            latestSermon: latest
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
