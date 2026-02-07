export type SermonSection =
    | { type: 'header'; content: string } // "2월 5일 예배"
    | { type: 'hymn'; content: string }
    | { type: 'prayer_title'; content: string }
    | { type: 'prayer_item'; number: number; content: string }
    | { type: 'scripture_main'; reference: string; text: string } // "하나님 말씀 ..."
    | { type: 'greeting'; content: string }
    | { type: 'point_title'; number: number; content: string }
    | { type: 'scripture_quote'; reference: string; content: string }
    | { type: 'text'; content: string }
    | { type: 'benediction'; content: string };

export type ParsedSermon = {
    title: string;
    date: string; // Extracted or passed
    sections: SermonSection[];
};

const BIBLE_BOOKS = [
    '창', '출', '레', '민', '신', '수', '삿', '룻', '삼상', '삼하', '왕상', '왕하', '대상', '대하', '스', '느', '에', '욥', '시', '잠', '전', '아', '사', '렘', '애', '겔', '단', '호', '욜', '암', '옵', '욘', '미', '나', '합', '습', '학', '슥', '말', '마', '막', '눅', '요', '행', '롬', '고전', '고후', '갈', '엡', '빌', '골', '살전', '살후', '딤전', '딤후', '딛', '몬', '히', '약', '벧전', '벧후', '요일', '요이', '요삼', '유', '계'
];

// Regex to detect Bible references at start of line (e.g., "롬8:6 ...")
const BIBLE_REF_REGEX = new RegExp(`^(${BIBLE_BOOKS.join('|')})\\d+[:\\.]`);

export function parseSermon(rawText: string): ParsedSermon {
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const sections: SermonSection[] = [];
    let title = '';
    // Try to find date in header line
    let date = '';

    // Check for standard format first (starts with Date Header-like line)
    const isStandardFormat = lines[0]?.match(/^\d+월\s*\d+일\s*예배/);

    if (isStandardFormat) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Standard Header Detection (Date)
            if (line.match(/^\d+월\s*\d+일\s*예배/)) {
                sections.push({ type: 'header', content: line });
                title = line;
                continue;
            }

            // Hymn
            if (line.startsWith('찬송가')) {
                sections.push({ type: 'hymn', content: line });
                continue;
            }

            // Prayer Title
            if (line.startsWith('기도')) {
                sections.push({ type: 'prayer_title', content: line });
                continue;
            }

            // Main Scripture Block
            if (line.startsWith('하나님 말씀')) {
                const refMatch = line.replace('하나님 말씀', '').trim();
                let text = '';
                if (i + 1 < lines.length) {
                    text = lines[i + 1];
                    i++;
                }
                sections.push({ type: 'scripture_main', reference: refMatch, text });
                continue;
            }

            // Numbered Points checks...
            const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
            if (numberedMatch) {
                const number = parseInt(numberedMatch[1]);
                const content = numberedMatch[2];
                const lastType = sections.length > 0 ? sections[sections.length - 1].type : '';
                if (lastType === 'prayer_title' || lastType === 'prayer_item') {
                    sections.push({ type: 'prayer_item', number, content });
                } else {
                    sections.push({ type: 'point_title', number, content });
                }
                continue;
            }

            // Greeting
            if (line.startsWith('오늘도') && line.includes('좋은 날')) {
                sections.push({ type: 'greeting', content: line });
                continue;
            }

            // Scripture Quote
            if (BIBLE_REF_REGEX.test(line)) {
                const firstSpace = line.indexOf(' ');
                if (firstSpace > 0) {
                    const ref = line.substring(0, firstSpace);
                    const content = line.substring(firstSpace + 1);
                    sections.push({ type: 'scripture_quote', reference: ref, content });
                } else {
                    sections.push({ type: 'scripture_quote', reference: line, content: '' });
                }
                continue;
            }

            // Benediction
            if (line.endsWith('축원합니다.') || line.endsWith('축원합니다')) {
                sections.push({ type: 'benediction', content: line });
                continue;
            }

            if (line === '신앙고백') {
                sections.push({ type: 'text', content: line });
                continue;
            }

            sections.push({ type: 'text', content: line });
        }
    } else {
        // --- UNSTRUCTURED / NEW FORMAT HANDLING ---
        // Example:
        // 보라 내가 새 일을 행하리니 사43:18-21 (Title + Main Scripture)
        // 2026 (Year)
        // 1. 25 주일 낮 (Date info)
        // ... text ...

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // 1. First Line: Title & Scripture
            if (i === 0) {
                title = line;
                // Try to extract scripture ref at the end
                // Regex: Look for bible book + number at the end of the line
                // e.g. "사43:18-21"
                // Iterate bible books to be sure
                let scriptureFound = false;
                for (const book of BIBLE_BOOKS) {
                    // Regex: Book followed by digits, colon/dot, digits, end of line
                    const regex = new RegExp(`(${book}\\d+[:\\.]\\d+(?:-\\d+)?)$`);
                    const match = line.match(regex);
                    if (match) {
                        const ref = match[1];
                        const titleOnly = line.replace(ref, '').trim();
                        // Push Header with Title
                        sections.push({ type: 'header', content: titleOnly });
                        // Push Special Main Scripture Section
                        sections.push({ type: 'scripture_main', reference: ref, text: '' }); // Text might be implicitly understood or in title
                        title = titleOnly;
                        scriptureFound = true;
                        break;
                    }
                }
                if (!scriptureFound) {
                    sections.push({ type: 'header', content: line });
                }
                continue;
            }

            // 2. Date Lines (2026 or 1. 25)
            // Just treat them as text-based meta or ignore if redundant? 
            // The standard view renders 'header' type.
            // Let's detecting separate date lines.
            if (line.match(/^\d{4}$/) || line.match(/^\d{1,2}\.\s*\d{1,2}/)) {
                // Maybe add to a 'meta' or 'text' section with specific style? 
                // Or just skip/merge into content? 
                // Let's add as small text/subtitle
                sections.push({ type: 'text', content: line }); // Render as text for now
                continue;
            }

            // 3. Standard Text Parsing (same as above for body)
            // Greeting
            if (line.startsWith('오늘도') && line.includes('좋은 날')) {
                sections.push({ type: 'greeting', content: line });
                continue;
            }

            // Scripture Quote
            if (BIBLE_REF_REGEX.test(line)) {
                const firstSpace = line.indexOf(' ');
                if (firstSpace > 0) {
                    const ref = line.substring(0, firstSpace);
                    const content = line.substring(firstSpace + 1);
                    sections.push({ type: 'scripture_quote', reference: ref, content });
                } else {
                    sections.push({ type: 'scripture_quote', reference: line, content: '' });
                }
                continue;
            }

            // Benediction
            if (line.endsWith('축원합니다.') || line.endsWith('축원합니다')) {
                sections.push({ type: 'benediction', content: line });
                continue;
            }

            sections.push({ type: 'text', content: line });
        }
    }

    return {
        title,
        date, // TODO: Extract from title if needed
        sections
    };
}
