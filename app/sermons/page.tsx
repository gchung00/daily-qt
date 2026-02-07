import { getAllSermons } from '@/lib/sermons';
import { getBookFromReference, BIBLE_BOOKS_DATA, BibleBook } from '@/lib/bible';
import Link from 'next/link';
import { ArrowLeft, Calendar, BookOpen, Music } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ParsedSermon } from '@/lib/parser';

export const dynamic = 'force-dynamic';

export default async function SermonsListPage() {
    const sermons = await getAllSermons();

    // Group Sermons by Book
    const groupedSermons = new Map<string, ParsedSermon[]>();
    const uncategorizedSermons: ParsedSermon[] = [];

    sermons.forEach(sermon => {
        const mainScripture = sermon.sections.find(s => s.type === 'scripture_main') as any;
        const reference = mainScripture?.reference || '';
        const book = getBookFromReference(reference);

        if (book) {
            if (!groupedSermons.has(book.id)) {
                groupedSermons.set(book.id, []);
            }
            groupedSermons.get(book.id)?.push(sermon);
        } else {
            uncategorizedSermons.push(sermon);
        }
    });

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="py-12 px-6 border-b border-card-border/60 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-primary/80 hover:text-primary font-bold transition-colors text-sm uppercase tracking-wider group">
                            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Main Page
                        </Link>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-2">성경별 말씀 찾기</h1>
                    <p className="text-muted text-lg">성경 66권 순서대로 정리된 설교 아카이브입니다.</p>
                </div>
            </section>

            {/* List */}
            <section className="max-w-4xl mx-auto px-6 py-12 space-y-20">

                {/* 1. Old Testament */}
                <div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-10 pb-4 border-b border-secondary">구약 (Old Testament)</h2>
                    <div className="grid gap-12">
                        {BIBLE_BOOKS_DATA.filter(b => b.testament === 'OT').map(book => {
                            const bookSermons = groupedSermons.get(book.id);
                            if (!bookSermons || bookSermons.length === 0) return null;

                            return (
                                <BookSection key={book.id} book={book} sermons={bookSermons} />
                            );
                        })}
                    </div>
                </div>

                {/* 2. New Testament */}
                <div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-10 pb-4 border-b border-secondary">신약 (New Testament)</h2>
                    <div className="grid gap-12">
                        {BIBLE_BOOKS_DATA.filter(b => b.testament === 'NT').map(book => {
                            const bookSermons = groupedSermons.get(book.id);
                            if (!bookSermons || bookSermons.length === 0) return null;

                            return (
                                <BookSection key={book.id} book={book} sermons={bookSermons} />
                            );
                        })}
                    </div>
                </div>

                {/* 3. Uncategorized (If any) */}
                {uncategorizedSermons.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-muted mb-10 pb-4 border-b border-secondary">기타 (Others)</h2>
                        <div className="grid gap-6">
                            {uncategorizedSermons.map(sermon => <SermonCard key={sermon.date} sermon={sermon} />)}
                        </div>
                    </div>
                )}

            </section>
        </main>
    );
}

function BookSection({ book, sermons }: { book: BibleBook, sermons: ParsedSermon[] }) {
    return (
        <div className="scroll-mt-20" id={book.id}>
            <div className="flex items-baseline gap-3 mb-6">
                <h3 className="text-2xl font-bold text-foreground">{book.name}</h3>
                <span className="text-sm font-bold text-primary/60 bg-secondary/30 px-2 py-0.5 rounded-full">{sermons.length}</span>
            </div>
            <div className="grid gap-4">
                {sermons.map(sermon => (
                    <SermonCard key={sermon.date} sermon={sermon} />
                ))}
            </div>
        </div>
    );
}

function SermonCard({ sermon }: { sermon: ParsedSermon }) {
    const mainScripture = sermon.sections.find(s => s.type === 'scripture_main') as any;

    return (
        <Link
            href={`/sermon/${sermon.date}`}
            className="group block bg-white rounded-xl border border-card-border/60 p-5 hover:shadow-md hover:border-primary/40 transition-all duration-200"
        >
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 justify-between">
                <div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors serif-emphasis">
                        {sermon.title || `${sermon.date} 주일 예배`}
                    </h4>
                    {mainScripture && (
                        <p className="text-sm text-muted mt-1 text-pretty">
                            <span className="font-bold text-primary/80 mr-2">{mainScripture.reference}</span>
                            {mainScripture.text && <span className="opacity-70 line-clamp-1 sm:inline hidden"> - {mainScripture.text.substring(0, 40)}...</span>}
                        </p>
                    )}
                </div>
                <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-muted/50 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(sermon.date), 'yyyy. MM. dd', { locale: ko })}
                </div>
            </div>
        </Link>
    );
}
