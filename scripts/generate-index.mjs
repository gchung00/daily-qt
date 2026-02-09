
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERMONS_DIR = path.join(__dirname, '../sermons');
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(DATA_DIR, 'sermons-index.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// BIBLE BOOKS ARRAY (Simplified for matching)
const BIBLE_BOOKS = [
    '창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야', '예레미야', '예레미야애가', '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기',
    '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서', '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서', '요한이서', '요한삼서', '유다서', '요한계시록',
    // Abbreviations
    '창', '출', '레', '민', '신', '수', '삿', '룻', '삼상', '삼하', '왕상', '왕하', '대상', '대하', '스', '느', '에', '욥', '시', '잠', '전', '아', '사', '렘', '애', '겔', '단', '호', '욜', '암', '옵', '욘', '미', '나', '합', '습', '학', '슥', '말',
    '마', '막', '누', '요', '행', '롬', '고전', '고후', '갈', '엡', '빌', '골', '살전', '살후', '딤전', '딤후', '딛', '몬', '히', '야', '벧전', '벧후', '요일', '요이', '요삼', '유', '계'
];

function parseSermonContent(rawText, date) {
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const sections = [];
    let title = '';

    // Simple Parsing Logic (Mirroring parser.ts roughly for indexing)
    const isStandardFormat = lines[0]?.match(/^\d+월\s*\d+일\s*예배/);

    if (isStandardFormat) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.match(/^\d+월\s*\d+일\s*예배/)) {
                title = line;
                sections.push({ type: 'header', content: line });
            } else if (line.startsWith('하나님 말씀')) {
                const refMatch = line.replace('하나님 말씀', '').trim();
                let text = '';
                if (i + 1 < lines.length) text = lines[i + 1];
                sections.push({ type: 'scripture_main', reference: refMatch, text });
            } else {
                sections.push({ type: 'text', content: line });
            }
        }
    } else {
        // Unstructured
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Try to find title/scripture in first line
            if (i === 0) {
                let scriptureFound = false;
                for (const book of BIBLE_BOOKS) {
                    const regex = new RegExp(`(${book}\\d+[:\\.]\\d+(?:-\\d+)?)$`);
                    const match = line.match(regex);
                    if (match) {
                        const ref = match[1];
                        const titleOnly = line.replace(ref, '').trim();
                        title = titleOnly;
                        sections.push({ type: 'header', content: titleOnly });
                        sections.push({ type: 'scripture_main', reference: ref, text: '' });
                        scriptureFound = true;
                        break;
                    }
                }
                if (!scriptureFound) {
                    title = line;
                    sections.push({ type: 'header', content: line });
                }
            } else {
                sections.push({ type: 'text', content: line });
            }
        }
    }

    return {
        title: title || date,
        date: date,
        sections: sections
    };
}

async function generateIndex() {
    console.log('Generating Sermon Index...');
    const files = fs.readdirSync(SERMONS_DIR).filter(f => f.endsWith('.txt'));
    const index = [];

    console.log(`Found ${files.length} sermon files.`);

    for (const file of files) {
        const date = file.replace('.txt', '');
        const content = fs.readFileSync(path.join(SERMONS_DIR, file), 'utf-8');
        try {
            const parsed = parseSermonContent(content, date);
            index.push(parsed);
        } catch (e) {
            console.error(`Failed to parse ${file}:`, e);
        }
    }

    // Sort descending
    index.sort((a, b) => b.date.localeCompare(a.date));

    // Write to JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
    console.log(`Successfully indexed ${index.length} sermons to ${OUTPUT_FILE}`);
}

generateIndex();
