import { parseSermon, ParsedSermon } from './parser';
import { SermonStorage } from './storage';
import fs from 'fs';
import path from 'path';

import { unstable_cache } from 'next/cache';

export const getSermon = unstable_cache(async (date: string): Promise<ParsedSermon | null> => {
    try {
        const rawText = await SermonStorage.getSermon(date);
        if (!rawText) return null;

        const parsed = parseSermon(rawText);
        parsed.date = date; // Standardize date from filename/key
        return parsed;
    } catch (error) {
        console.error(`Error reading sermon for ${date}:`, error);
        return null;
    }
}, ['sermons-get'], { tags: ['sermons'] });

// We use unstable_cache heavily here to prevent Vercel Blob Advanced Ops billing issues
// Revalidation happens on POST/DELETE via revalidateTag('sermons')
export const getSermonDates = unstable_cache(async (): Promise<string[]> => {
    try {
        return await SermonStorage.listSermons();
    } catch (error) {
        console.error('Error listing sermons:', error);
        return [];
    }
}, ['sermons-list'], { tags: ['sermons'] });

export async function getLatestSermon(): Promise<ParsedSermon | null> {
    const dates = await getSermonDates();
    if (dates.length === 0) return null;

    // Sort dates desc (already sorted in storage, but good to be safe)
    dates.sort((a, b) => b.localeCompare(a));
    return getSermon(dates[0]);
}

export async function getAllSermons(): Promise<ParsedSermon[]> {
    try {
        // 1. Try reading from Index (FAST)
        const indexPath = path.join(process.cwd(), 'data', 'sermons-index.json');
        if (fs.existsSync(indexPath)) {
            const fileContent = fs.readFileSync(indexPath, 'utf-8');
            const sermons = JSON.parse(fileContent);
            return sermons;
        }
    } catch (e) {
        console.warn("Index read failed, falling back to file scan:", e);
    }

    // 2. Fallback: Slow File Scan (Original Logic)
    const dates = await getSermonDates();
    const sermons: ParsedSermon[] = [];

    // Concurrency Limit (Batching)
    const BATCH_SIZE = 10;

    for (let i = 0; i < dates.length; i += BATCH_SIZE) {
        const batch = dates.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(date => getSermon(date)));

        results.forEach(s => {
            if (s) sermons.push(s);
        });
    }

    return sermons.sort((a, b) => b.date.localeCompare(a.date));
}
