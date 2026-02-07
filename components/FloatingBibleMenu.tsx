"use client";

import { useState } from "react";
import { BIBLE_BOOKS_DATA } from "@/lib/bible";
import { BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingBibleMenu({ availableBookIds }: { availableBookIds?: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeBook, setActiveBook] = useState<string>("");

    const scrollToBook = (bookId: string) => {
        const element = document.getElementById(bookId);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveBook(bookId);
            setIsOpen(false);
        }
    };

    const availableSet = new Set(availableBookIds || []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Menu Content */}
            <div
                className={cn(
                    "bg-white/95 backdrop-blur-sm border border-black/10 shadow-2xl rounded-2xl mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none h-0"
                )}
                style={{ maxHeight: "70vh", width: "320px" }}
            >
                <div className="flex flex-col h-full max-h-[70vh]">
                    <div className="p-4 border-b border-black/5 flex justify-between items-center bg-primary/5">
                        <h3 className="font-serif font-bold text-lg text-primary">성경 바로가기</h3>
                        <button onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 grid grid-cols-2 gap-x-6 gap-y-8 scrollbar-thin">
                        {/* Old Testament */}
                        <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 pb-1 border-b border-black/5">구약</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {BIBLE_BOOKS_DATA.filter(b => b.testament === 'OT').map(book => {
                                    const isAvailable = availableSet.has(book.id);
                                    return (
                                        <button
                                            key={book.id}
                                            onClick={() => isAvailable && scrollToBook(book.id)}
                                            disabled={!isAvailable}
                                            className={cn(
                                                "text-center text-sm py-1.5 rounded transition-colors truncate font-medium",
                                                isAvailable
                                                    ? "bg-secondary/30 text-foreground hover:bg-primary hover:text-white cursor-pointer"
                                                    : "text-muted/20 cursor-default"
                                            )}
                                            title={book.name}
                                        >
                                            {book.abbrev}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* New Testament */}
                        <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 pb-1 border-b border-black/5">신약</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {BIBLE_BOOKS_DATA.filter(b => b.testament === 'NT').map(book => {
                                    const isAvailable = availableSet.has(book.id);
                                    return (
                                        <button
                                            key={book.id}
                                            onClick={() => isAvailable && scrollToBook(book.id)}
                                            disabled={!isAvailable}
                                            className={cn(
                                                "text-center text-sm py-1.5 rounded transition-colors truncate font-medium",
                                                isAvailable
                                                    ? "bg-secondary/30 text-foreground hover:bg-primary hover:text-white cursor-pointer"
                                                    : "text-muted/20 cursor-default"
                                            )}
                                            title={book.name}
                                        >
                                            {book.abbrev}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl pointer-events-auto",
                    isOpen ? "rotate-90 bg-muted text-foreground" : ""
                )}
                aria-label="Open Bible Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </button>
        </div>
    );
}
