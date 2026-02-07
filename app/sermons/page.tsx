import { getAllSermons } from '@/lib/sermons';
import Link from 'next/link';
import { ArrowLeft, Calendar, BookOpen, Music, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function SermonsListPage() {
    const sermons = await getAllSermons();

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
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-2">말씀 아카이브</h1>
                    <p className="text-muted text-lg">지난 설교 말씀과 찬양을 한눈에 살펴보세요.</p>
                </div>
            </section>

            {/* List */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid gap-6">
                    {sermons.map((sermon) => {
                        // Extract Metadata
                        const mainScripture = sermon.sections.find(s => s.type === 'scripture_main') as any;
                        const hymn = sermon.sections.find(s => s.type === 'hymn');

                        // Extract "tags" from other content if needed, for now use Hymn as a tag
                        const tags = [];
                        if (hymn) tags.push({ type: 'hymn', label: hymn.content.replace('찬송가', '').trim() });

                        return (
                            <Link
                                key={sermon.date}
                                href={`/sermon/${sermon.date}`}
                                className="group block bg-white rounded-2xl border border-card-border/60 p-6 sm:p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-start">
                                    <div className="space-y-3 flex-1">
                                        {/* Date Badge */}
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
                                            <Calendar className="w-4 h-4" />
                                            {format(parseISO(sermon.date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors serif-emphasis">
                                            {sermon.title || `${sermon.date} 주일 예배`}
                                        </h2>

                                        {/* Scripture Reference */}
                                        {mainScripture && (
                                            <div className="flex items-start gap-2 text-muted text-pretty">
                                                <BookOpen className="w-4 h-4 mt-1 shrink-0 opacity-70" />
                                                <span className="font-medium">{mainScripture.reference}</span>
                                                <span className="text-muted/60 hidden sm:inline text-sm line-clamp-1">— {mainScripture.text.substring(0, 50)}...</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags / Hymns */}
                                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                                        {tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/30 text-secondary-foreground/80 rounded-full text-xs font-bold"
                                            >
                                                <Music className="w-3 h-3" />
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
