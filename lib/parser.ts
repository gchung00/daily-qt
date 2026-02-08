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
    let date = '';

    // Check for standard format first (starts with Date Header-like line)
    // e.g., "2024년 2월 5일 예배"
    const isStandardFormat = lines[0]?.match(/^\d+월\s*\d+일\s*예배/);

    if (isStandardFormat) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Standard Header Detection (which often contains the Date)
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
        // 롯이 아브람을 떠난 후에  창13:10-18
        // 2026. 2. 8 주일 낮

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // 1. First Line Handling: Title & Potential Scripture Ref
            if (i === 0) {
                // Try to find scripture ref at end of line
                let scriptureFound = false;
                for (const book of BIBLE_BOOKS) {
                    // Look for Ref at END of line
                    const regex = new RegExp(`(${book}\\d+[:\\.]\\d+(?:-\\d+)?)$`);
                    const match = line.match(regex);
                    if (match) {
                        const ref = match[1]; // e.g. "창13:10-18"
                        const titleOnly = line.replace(ref, '').trim();

                        sections.push({ type: 'header', content: titleOnly });
                        sections.push({ type: 'scripture_main', reference: ref, text: '' });

                        title = titleOnly;
                        scriptureFound = true;
                        break;
                    }
                }

                if (!scriptureFound) {
                    // If no scripture ref found, treat whole line as Title
                    title = line;
                    sections.push({ type: 'header', content: line });
                }
                continue;
            }

            // 2. Date Extraction (e.g., "2026. 2. 8" or "2026. 02. 08")
            // Matches: 4 digits, dot, space(opt), 1-2 digits, dot, ...
            // Also can match: "2026. 2. 8 주일 낮" -> extracts date part
            const dateMatch = line.match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
            if (dateMatch) {
                const year = dateMatch[1];
                const month = dateMatch[2].padStart(2, '0');
                const day = dateMatch[3].padStart(2, '0');
                date = `${year}-${month}-${day}`;

                // Add as text line (subtitle) so user sees it
                sections.push({ type: 'text', content: line });
                continue;
            }

            // 3. Greeting
            if (line.startsWith('오늘도') && line.includes('좋은 날')) {
                sections.push({ type: 'greeting', content: line });
                continue;
            }

            // 4. Scripture Quote
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

            // 5. Benediction
            if (line.endsWith('축원합니다.') || line.endsWith('축원합니다')) {
                sections.push({ type: 'benediction', content: line });
                continue;
            }

            sections.push({ type: 'text', content: line });
        }
    }

    return {
        title,
        date,
        sections
    };
}
