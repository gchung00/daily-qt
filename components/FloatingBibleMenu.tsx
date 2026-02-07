"use client";

import { useState, useEffect } from "react";
import { BIBLE_BOOKS_DATA } from "@/lib/bible";
import { BookOpen, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingBibleMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeBook, setActiveBook] = useState<string>("");

    // Close menu when clicking outside (optional, but good UX)
    // For now, simpler is better: close on selection.

    const scrollToBook = (bookId: string) => {
        const element = document.getElementById(bookId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveBook(bookId);
            setIsOpen(false); // Close menu after selection
        }
    };

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

                    <div className="overflow-y-auto flex-1 p-4 grid grid-cols-2 gap-x-4 gap-y-8 scrollbar-thin">
                        {/* Old Testament */}
                        <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 pb-1 border-b border-black/5">구약 (OT)</h4>
                            <div className="grid grid-cols-2 gap-1">
                                {BIBLE_BOOKS_DATA.filter(b => b.testament === 'OT').map(book => (
                                    <button
                                        key={book.id}
                                        onClick={() => scrollToBook(book.id)}
                                        className="text-left text-sm py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors truncate"
                                    >
                                        {book.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* New Testament */}
                        <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 pb-1 border-b border-black/5">신약 (NT)</h4>
                            <div className="grid grid-cols-2 gap-1">
                                {BIBLE_BOOKS_DATA.filter(b => b.testament === 'NT').map(book => (
                                    <button
                                        key={book.id}
                                        onClick={() => scrollToBook(book.id)}
                                        className="text-left text-sm py-1 px-1.5 rounded hover:bg-primary/10 hover:text-primary transition-colors truncate"
                                    >
                                        {book.name}
                                    </button>
                                ))}
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
