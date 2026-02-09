'use client';

import { useState } from 'react';
import { ParsedSermon } from '@/lib/parser';
import { BIBLE_BOOKS_DATA, BibleBook, parseScriptureReference, getBookFromReference } from '@/lib/bible';
import Link from 'next/link';
import { Calendar, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface SermonFilterViewProps {
    // No longer needs sermons prop
}

export default function SermonFilterView({ }: SermonFilterViewProps) {
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [loadedSermons, setLoadedSermons] = useState<Map<string, ParsedSermon[]>>(new Map());
    const [isLoading, setIsLoading] = useState(false);

    // Filter Logic
    const handleBookClick = async (bookId: string) => {
        if (selectedBookId === bookId) return; // Already selected
        setSelectedBookId(bookId);

        // Scroll to list
        setTimeout(() => {
            document.getElementById('sermon-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Check cache
        if (loadedSermons.has(bookId)) {
            return;
        }

        // Fetch
        setIsLoading(true);
        try {
            const res = await fetch(`/api/sermons/list?bookId=${bookId}`);
            if (!res.ok) throw new Error('Failed to load');
            const data: ParsedSermon[] = await res.json();

            setLoadedSermons(prev => {
                const newMap = new Map(prev);
                newMap.set(bookId, data);
                return newMap;
            });
        } catch (error) {
            console.error(error);
            alert('설교 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentSermons = selectedBookId ? loadedSermons.get(selectedBookId) || [] : [];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">

            {/* BOOK SELECTION GRID */}
            <div className="space-y-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* OLD TESTAMENT */}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        구약 (Old Testament)
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                        {BIBLE_BOOKS_DATA.filter(b => b.testament === 'OT').map(book => {
                            const isSelected = selectedBookId === book.id;
                            // We don't disable anymore since we don't know counts upfront
                            // Or we could fetch counts separately? For now enable all.

                            return (
                                <button
                                    key={book.id}
                                    onClick={() => handleBookClick(book.id)}
                                    className={`
                                        relative p-3 rounded-xl border transition-all duration-200 text-sm font-bold flex flex-col items-center gap-1
                                        ${isSelected
                                            ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/20 scale-105 z-10'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:shadow-md cursor-pointer'
                                        }
                                    `}
                                >
                                    <span className={book.name.includes('데살로니가') ? 'text-[0.7rem] tracking-tighter' : ''}>{book.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* NEW TESTAMENT */}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        신약 (New Testament)
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                        {BIBLE_BOOKS_DATA.filter(b => b.testament === 'NT').map(book => {
                            const isSelected = selectedBookId === book.id;

                            return (
                                <button
                                    key={book.id}
                                    onClick={() => handleBookClick(book.id)}
                                    className={`
                                        relative p-3 rounded-xl border transition-all duration-200 text-sm font-bold flex flex-col items-center gap-1
                                        ${isSelected
                                            ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/20 scale-105 z-10'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:shadow-md cursor-pointer'
                                        }
                                    `}
                                >
                                    <span className={book.name.includes('데살로니가') ? 'text-[0.7rem] tracking-tighter' : ''}>{book.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* OTHERS BUTTON */}
                <div className="flex justify-center">
                    <button
                        onClick={() => handleBookClick('others')}
                        className={`
                            px-6 py-3 rounded-full font-bold transition-all shadow-sm
                            ${selectedBookId === 'others'
                                ? 'bg-gray-800 text-white shadow-lg'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }
                        `}
                    >
                        기타 설교
                    </button>
                </div>
            </div>

            {/* SELECTED LIST SECTION */}
            <div id="sermon-list" className="min-h-[300px]">
                {selectedBookId ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                            <h3 className="text-3xl font-serif font-bold text-gray-900">
                                {selectedBookId === 'others'
                                    ? '기타 설교'
                                    : BIBLE_BOOKS_DATA.find(b => b.id === selectedBookId)?.name
                                }
                            </h3>
                            <button
                                onClick={() => setSelectedBookId(null)}
                                className="text-sm text-gray-500 hover:text-primary underline underline-offset-4"
                            >
                                선택 취소 (모두 접기)
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-primary/60">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="font-bold">말씀을 불러오는 중입니다...</p>
                            </div>
                        ) : currentSermons.length > 0 ? (
                            <div className="grid gap-4">
                                {currentSermons
                                    .sort((a, b) => {
                                        // Sort by Chapter/Verse for Bible Books, Date for Others
                                        if (selectedBookId === 'others') {
                                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                                        }

                                        const refA = (a.sections.find(s => s.type === 'scripture_main') as any)?.reference || '';
                                        const refB = (b.sections.find(s => s.type === 'scripture_main') as any)?.reference || '';
                                        const parsedA = parseScriptureReference(refA);
                                        const parsedB = parseScriptureReference(refB);

                                        if (!parsedA || !parsedB) return new Date(b.date).getTime() - new Date(a.date).getTime();
                                        if (parsedA.chapter !== parsedB.chapter) return parsedA.chapter - parsedB.chapter;
                                        return parsedA.verse - parsedB.verse;
                                    })
                                    .map(sermon => (
                                        <SermonCard key={sermon.date} sermon={sermon} />
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">등록된 설교가 없습니다.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-lg font-medium">원하시는 성경을 선택하시면 설교 목록이 나타납니다.</p>
                    </div>
                )}
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
                <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-primary mb-1 group-hover:text-primary/80 transition-colors serif-emphasis truncate">
                        {mainScripture?.reference || sermon.title || '말씀'}
                    </h4>

                    {mainScripture?.text && (
                        <p className="text-muted/80 text-sm line-clamp-1 mb-2">
                            {mainScripture.text}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-xs font-bold text-muted/50 uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(sermon.date), 'yyyy. MM. dd', { locale: ko })} 예배
                    </div>
                </div>
            </div>
        </Link>
    );
}
