
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERMONS_DIR = path.join(__dirname, '../sermons');
const CONCURRENCY = 10; // Process 10 uploads at a time

async function uploadSermons() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) throw new Error('Token missing');

    const files = fs.readdirSync(SERMONS_DIR).filter(file => file.endsWith('.txt'));
    console.log(`Found ${files.length} files. Starting parallel upload (Concurrency: ${CONCURRENCY})...`);

    let completed = 0;
    let errors = 0;

    // Helper to process a single file
    const processFile = async (file) => {
        const filePath = path.join(SERMONS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
            // Check if already exists? (Optional, but Vercel Blob list is expensive too)
            // We just overwrite for migration simplicity.
            await put(`sermons/${file}`, content, {
                access: 'public',
                addRandomSuffix: false,
                token
            });
            completed++;
            if (completed % 10 === 0) {
                console.log(`Progress: ${completed}/${files.length} (${Math.round(completed / files.length * 100)}%)`);
            }
        } catch (error) {
            console.error(`Failed to upload ${file}: ${error.message}`);
            errors++;
        }
    };

    // Simple concurrency loop
    const queue = [...files];
    const workers = [];

    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push((async () => {
            while (queue.length > 0) {
                const file = queue.shift();
                if (file) await processFile(file);
            }
        })());
    }

    await Promise.all(workers);

    console.log(`Upload complete! Success: ${completed}, Errors: ${errors}`);
}

uploadSermons().catch(console.error);
