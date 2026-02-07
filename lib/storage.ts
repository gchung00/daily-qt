import { list, put, del } from '@vercel/blob';
import { readdir, readFile, writeFile, unlink, access, mkdir } from 'fs/promises';
import { join } from 'path';

const SERMONS_DIR = join(process.cwd(), 'sermons');

export const SermonStorage = {
    async listSermons(): Promise<string[]> {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            // Production: Vercel Blob
            const { blobs } = await list({ prefix: 'sermons/' });
            return blobs
                .map(blob => blob.pathname.replace('sermons/', '').replace('.txt', ''))
                .sort((a, b) => b.localeCompare(a));
        } else {
            // Development: Local File System
            try {
                await ensureDir();
                const files = await readdir(SERMONS_DIR);
                return files
                    .filter(f => f.endsWith('.txt'))
                    .map(f => f.replace('.txt', ''))
                    .sort((a, b) => b.localeCompare(a));
            } catch (e) {
                return [];
            }
        }
    },

    async getSermon(date: string): Promise<string | null> {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            // Production: Vercel Blob
            // Note: We list to find the exact URL because put() might return a unique URL
            // However, we can also try to list by prefix.
            const { blobs } = await list({ prefix: `sermons/${date}.txt` });
            // Exact match check to avoid partial matches (e.g. 2023-01-01 -> 2023-01-01-v2)
            // But usually prefix with exact name is fine if we manage it well.
            const blob = blobs.find(b => b.pathname === `sermons/${date}.txt`);

            if (!blob) return null;

            const response = await fetch(blob.url);
            return await response.text();
        } else {
            // Development: Local File System
            try {
                const filePath = join(SERMONS_DIR, `${date}.txt`);
                return await readFile(filePath, 'utf-8');
            } catch {
                return null;
            }
        }
    },

    async saveSermon(date: string, text: string, force: boolean = false): Promise<boolean> {
        const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;

        // Check availability if not forced
        if (!force) {
            const existing = await this.getSermon(date);
            if (existing) return false; // Already exists
        }

        if (hasToken) {
            // Production: Vercel Blob
            await put(`sermons/${date}.txt`, text, {
                access: 'public',
                addRandomSuffix: false // Important to keep fixed filenames for overwriting 
            });
        } else {
            // Development: Local File System
            await ensureDir();
            const filePath = join(SERMONS_DIR, `${date}.txt`);
            await writeFile(filePath, text, 'utf-8');
        }
        return true;
    },

    async deleteSermon(date: string): Promise<void> {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const { blobs } = await list({ prefix: `sermons/${date}.txt` });
            // Delete all matches (though should be one if we use addRandomSuffix: false)
            const urls = blobs
                .filter(b => b.pathname === `sermons/${date}.txt`)
                .map(b => b.url);

            if (urls.length > 0) {
                await del(urls);
            }
        } else {
            const filePath = join(SERMONS_DIR, `${date}.txt`);
            try {
                await unlink(filePath);
            } catch { }
        }
    }
};

async function ensureDir() {
    try {
        await access(SERMONS_DIR);
    } catch {
        await mkdir(SERMONS_DIR, { recursive: true });
    }
}
