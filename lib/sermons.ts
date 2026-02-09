import { parseSermon, ParsedSermon } from './parser';
import { SermonStorage } from './storage';

export async function getSermon(date: string): Promise<ParsedSermon | null> {
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
}

// Previously used unstable_cache here, but removed it to ensure fresh data after uploads.
// Direct fetch from storage is fast enough for now (list operation).
export async function getSermonDates(): Promise<string[]> {
    try {
        return await SermonStorage.listSermons();
    } catch (error) {
        console.error('Error listing sermons:', error);
        return [];
    }
}

export async function getLatestSermon(): Promise<ParsedSermon | null> {
    const dates = await getSermonDates();
    if (dates.length === 0) return null;

    // Sort dates desc (already sorted in storage, but good to be safe)
    dates.sort((a, b) => b.localeCompare(a));
    return getSermon(dates[0]);
}

export async function getAllSermons(): Promise<ParsedSermon[]> {
    const dates = await getSermonDates();
    const sermons: ParsedSermon[] = [];

    // Concurrency Limit (Batching)
    // Fetching 500+ files at once causes storage timeouts.
    const BATCH_SIZE = 10;

    for (let i = 0; i < dates.length; i += BATCH_SIZE) {
        const batch = dates.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(date => getSermon(date)));

        results.forEach(s => {
            if (s) sermons.push(s);
        });
    }

    // Sort by date descending
    return sermons.sort((a, b) => b.date.localeCompare(a.date));
}
