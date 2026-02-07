import { parseSermon, ParsedSermon } from './parser';
import { SermonStorage } from './storage';

export async function getSermon(date: string): Promise<ParsedSermon | null> {
    try {
        const rawText = await SermonStorage.getSermon(date);
        if (!rawText) return null;

        const parsed = parseSermon(rawText);
        parsed.date = date;
        return parsed;
    } catch (error) {
        console.error(`Error reading sermon for ${date}:`, error);
        return null;
    }
}

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
    const sermons = await Promise.all(dates.map(date => getSermon(date)));

    // Filter out nulls and sort by date descending
    return sermons
        .filter((s): s is ParsedSermon => s !== null)
        .sort((a, b) => b.date.localeCompare(a.date));
}
