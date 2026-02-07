
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERMONS_DIR = path.join(__dirname, '../sermons');

async function uploadSermons() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) throw new Error('Token missing');

    const files = fs.readdirSync(SERMONS_DIR).filter(file => file.endsWith('.txt'));
    console.log(`Found ${files.length} files.`);

    for (const file of files) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(SERMONS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        try {
            console.log(`  - Uploading to Blob...`);
            const blob = await put(`sermons/${file}`, content, {
                access: 'public',
                addRandomSuffix: false,
                token
            });
            console.log(`  - Success: ${blob.url}`);
        } catch (error) {
            console.error(`  - Failed: ${error.message}`);
        }
    }
}

uploadSermons().catch(console.error);
