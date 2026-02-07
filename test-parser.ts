import fs from 'fs';
import path from 'path';
import { parseSermon } from './lib/parser';

// Point to the file in the parent directory
const SAMPLE_PATH = path.resolve('../KakaoTalk_Longtxt_20260205_2248_22_029.txt');

try {
    const content = fs.readFileSync(SAMPLE_PATH, 'utf-8');
    console.log('--- Raw Content Length:', content.length);

    const parsed = parseSermon(content);
    console.log('--- Parsed Result ---');
    console.log(JSON.stringify(parsed, null, 2));

} catch (e) {
    console.error('Error reading or parsing:', e);
}
