
import { list } from '@vercel/blob';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

async function testConnection() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    console.log('Token:', token?.substring(0, 5) + '...');

    try {
        console.log('Testing connection (listing blobs)...');
        const { blobs } = await list({ token });
        console.log('✅ Connection successful!');
        console.log(`Found ${blobs.length} blobs.`);
        blobs.forEach(b => console.log(' -', b.pathname));
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
