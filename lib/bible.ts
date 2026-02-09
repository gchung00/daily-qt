
export type BibleBook = {
    id: string;
    name: string; // Full Name (e.g., 창세기)
    abbrev: string; // Parser Abbrev (e.g., 창)
    testament: 'OT' | 'NT';
};

export const BIBLE_BOOKS_DATA: BibleBook[] = [
    // Old Testament (39)
    { id: 'Gen', name: '창세기', abbrev: '창', testament: 'OT' },
    { id: 'Exo', name: '출애굽기', abbrev: '출', testament: 'OT' },
    { id: 'Lev', name: '레위기', abbrev: '레', testament: 'OT' },
    { id: 'Num', name: '민수기', abbrev: '민', testament: 'OT' },
    { id: 'Deu', name: '신명기', abbrev: '신', testament: 'OT' },
    { id: 'Jos', name: '여호수아', abbrev: '수', testament: 'OT' },
    { id: 'Jdg', name: '사사기', abbrev: '삿', testament: 'OT' },
    { id: 'Rut', name: '룻기', abbrev: '룻', testament: 'OT' },
    { id: '1Sa', name: '사무엘상', abbrev: '삼상', testament: 'OT' },
    { id: '2Sa', name: '사무엘하', abbrev: '삼하', testament: 'OT' },
    { id: '1Ki', name: '열왕기상', abbrev: '왕상', testament: 'OT' },
    { id: '2Ki', name: '열왕기하', abbrev: '왕하', testament: 'OT' },
    { id: '1Ch', name: '역대상', abbrev: '대상', testament: 'OT' },
    { id: '2Ch', name: '역대하', abbrev: '대하', testament: 'OT' },
    { id: 'Ezr', name: '에스라', abbrev: '스', testament: 'OT' },
    { id: 'Neh', name: '느헤미야', abbrev: '느', testament: 'OT' },
    { id: 'Est', name: '에스더', abbrev: '에', testament: 'OT' },
    { id: 'Job', name: '욥기', abbrev: '욥', testament: 'OT' },
    { id: 'Psa', name: '시편', abbrev: '시', testament: 'OT' },
    { id: 'Pro', name: '잠언', abbrev: '잠', testament: 'OT' },
    { id: 'Ecc', name: '전도서', abbrev: '전', testament: 'OT' },
    { id: 'Son', name: '아가', abbrev: '아', testament: 'OT' },
    { id: 'Isa', name: '이사야', abbrev: '사', testament: 'OT' },
    { id: 'Jer', name: '예레미야', abbrev: '렘', testament: 'OT' },
    { id: 'Lam', name: '예레미야애가', abbrev: '애', testament: 'OT' },
    { id: 'Eze', name: '에스겔', abbrev: '겔', testament: 'OT' },
    { id: 'Dan', name: '다니엘', abbrev: '단', testament: 'OT' },
    { id: 'Hos', name: '호세아', abbrev: '호', testament: 'OT' },
    { id: 'Joe', name: '요엘', abbrev: '욜', testament: 'OT' },
    { id: 'Amo', name: '아모스', abbrev: '암', testament: 'OT' },
    { id: 'Oba', name: '오바댜', abbrev: '옵', testament: 'OT' },
    { id: 'Jon', name: '요나', abbrev: '욘', testament: 'OT' },
    { id: 'Mic', name: '미가', abbrev: '미', testament: 'OT' },
    { id: 'Nah', name: '나훔', abbrev: '나', testament: 'OT' },
    { id: 'Hab', name: '하박국', abbrev: '합', testament: 'OT' },
    { id: 'Zep', name: '스바냐', abbrev: '습', testament: 'OT' },
    { id: 'Hag', name: '학개', abbrev: '학', testament: 'OT' },
    { id: 'Zec', name: '스가랴', abbrev: '슥', testament: 'OT' },
    { id: 'Mal', name: '말라기', abbrev: '말', testament: 'OT' },

    // New Testament (27)
    { id: 'Mat', name: '마태복음', abbrev: '마', testament: 'NT' },
    { id: 'Mar', name: '마가복음', abbrev: '막', testament: 'NT' },
    { id: 'Luk', name: '누가복음', abbrev: '눅', testament: 'NT' },
    { id: 'Joh', name: '요한복음', abbrev: '요', testament: 'NT' },
    { id: 'Act', name: '사도행전', abbrev: '행', testament: 'NT' },
    { id: 'Rom', name: '로마서', abbrev: '롬', testament: 'NT' },
    { id: '1Co', name: '고린도전서', abbrev: '고전', testament: 'NT' },
    { id: '2Co', name: '고린도후서', abbrev: '고후', testament: 'NT' },
    { id: 'Gal', name: '갈라디아서', abbrev: '갈', testament: 'NT' },
    { id: 'Eph', name: '에베소서', abbrev: '엡', testament: 'NT' },
    { id: 'Phi', name: '빌립보서', abbrev: '빌', testament: 'NT' },
    { id: 'Col', name: '골로새서', abbrev: '골', testament: 'NT' },
    { id: '1Th', name: '데살로니가전서', abbrev: '살전', testament: 'NT' },
    { id: '2Th', name: '데살로니가후서', abbrev: '살후', testament: 'NT' },
    { id: '1Ti', name: '디모데전서', abbrev: '딤전', testament: 'NT' },
    { id: '2Ti', name: '디모데후서', abbrev: '딤후', testament: 'NT' },
    { id: 'Tit', name: '디도서', abbrev: '딛', testament: 'NT' },
    { id: 'Phm', name: '빌레몬서', abbrev: '몬', testament: 'NT' },
    { id: 'Heb', name: '히브리서', abbrev: '히', testament: 'NT' },
    { id: 'Jam', name: '야고보서', abbrev: '약', testament: 'NT' },
    { id: '1Pe', name: '베드로전서', abbrev: '벧전', testament: 'NT' },
    { id: '2Pe', name: '베드로후서', abbrev: '벧후', testament: 'NT' },
    { id: '1Jo', name: '요한1서', abbrev: '요1', testament: 'NT' },
    { id: '2Jo', name: '요한2서', abbrev: '요2', testament: 'NT' },
    { id: '3Jo', name: '요한3서', abbrev: '요3', testament: 'NT' },
    { id: 'Jud', name: '유다서', abbrev: '유', testament: 'NT' },
    { id: 'Rev', name: '요한계시록', abbrev: '계', testament: 'NT' },
];

export function getBookFromReference(reference: string): BibleBook | null {
    if (!reference) return null;

    // Find a book that matches the start of the reference
    const book = BIBLE_BOOKS_DATA.find(b => {
        if (reference.startsWith(b.name)) return true;
        if (reference.startsWith(b.abbrev)) {
            // Boundary Check: Ensure the next character is a number or space
            // This prevents "사변" (Incident) from matching "사" (Isaiah)
            const nextChar = reference[b.abbrev.length];
            if (!nextChar) return false; // "창" alone is not a valid ref usually, or is it? "창" -> Gen. Let's say valid if exact match? 
            // Actually, if it's exact match "창", nextChar is undefined.
            // If nextChar exists, it MUST be a number or space (or dot/colon?).
            return /[\d\s\.:]/.test(nextChar);
        }
        return false;
    });

    return book || null;
}

export function parseScriptureReference(reference: string): { bookId: string; chapter: number; verse: number } | null {
    if (!reference) return null;

    const book = getBookFromReference(reference);
    if (!book) return null;

    // Remove book name/abbrev from reference to parse numbers
    // e.g., "창1:1" -> "1:1", "창세기 1:1" -> " 1:1"
    let remain = reference.replace(book.name, '').replace(book.abbrev, '').trim();

    // Match Chapter:Verse
    // Supports 1:1, 1:1-5, etc. We only care about start verse for sorting.
    const match = remain.match(/(\d+):(\d+)/);
    if (match) {
        return {
            bookId: book.id,
            chapter: parseInt(match[1], 10),
            verse: parseInt(match[2], 10)
        };
    }

    // Fallback: simple chapter match if no verse (unlikely but good for safety)
    const chapMatch = remain.match(/(\d+)/);
    if (chapMatch) {
        return {
            bookId: book.id,
            chapter: parseInt(chapMatch[1], 10),
            verse: 0
        };
    }

    return { bookId: book.id, chapter: 0, verse: 0 };
}
