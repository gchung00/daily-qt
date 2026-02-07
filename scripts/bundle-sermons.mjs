
import fs from 'fs';
import path from 'path';

const SERMONS_DIR = 'sermons';
const OUTPUT_FILE = 'data/sermons.json';

// Ensure data dir exists
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

async function main() {
    const files = fs.readdirSync(SERMONS_DIR).filter(f => f.endsWith('.txt'));
    const sermons = {};

    console.log(`Processing ${files.length} sermons...`);

    for (const file of files) {
        const date = file.replace('.txt', '');
        const content = fs.readFileSync(path.join(SERMONS_DIR, file), 'utf-8');
        sermons[date] = content;
    }

    // Sort keys just in case
    const sortedDates = Object.keys(sermons).sort((a, b) => b.localeCompare(a));
    const sortedSermons = {};
    sortedDates.forEach(date => {
        sortedSermons[date] = sermons[date];
    });

    console.log(`Writing to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedSermons, null, 2), 'utf-8');
    console.log('Done!');
}

main();
