import fs from 'fs';
import path from 'path';
import { parseSermon } from '@/lib/parser';

const INDEX_FILE = path.join(process.cwd(), 'data', 'sermons-index.json');

export async function updateSermonIndex(date: string, text: string | null) {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(INDEX_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        let index: any[] = [];
        if (fs.existsSync(INDEX_FILE)) {
            const content = fs.readFileSync(INDEX_FILE, 'utf-8');
            try {
                index = JSON.parse(content);
            } catch (e) {
                console.warn("Index file corrupted, starting fresh", e);
                index = [];
            }
        }

        if (text) {
            // Add/Update
            const parsed = parseSermon(text);
            parsed.date = date; // Ensure date is set correctly from filename/key

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
        return true;
    } catch (e) {
        console.error("Failed to update index:", e);
        return false;
    }
}
