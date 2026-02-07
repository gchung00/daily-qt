"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Calendar, List, User, PanelTopOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Scroll to Top
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsOpen(false);
    };

    // Calendar Navigation
    const handleCalendar = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            const element = document.getElementById("calendar");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none">
            {/* Menu Items */}
            <div
                className={cn(
                    "flex flex-col-reverse items-center gap-3 mb-4 transition-all duration-300 pointer-events-auto",
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                {/* 1. Top Button */}
                <button
                    onClick={handleScrollTop}
                    className="w-12 h-12 rounded-full bg-white text-foreground shadow-lg border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                    title="맨 위로"
                >
                    <ArrowUp className="w-5 h-5" />
                    <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        맨 위로
                    </span>
                </button>

                {/* 2. Calendar Button */}
                <Link
                    href="/#calendar"
                    onClick={handleCalendar}
                    className="w-12 h-12 rounded-full bg-white text-foreground shadow-lg border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                    title="달력으로 이동"
                >
                    <Calendar className="w-5 h-5" />
                    <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        달력 이동
                    </span>
                </Link>

                {/* 3. List Button */}
                <Link
                    href="/sermons"
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 rounded-full bg-white text-foreground shadow-lg border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                    title="전체 목록"
                >
                    <List className="w-5 h-5" />
                    <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        전체 목록
                    </span>
                </Link>

                {/* 4. Profile Button */}
                <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 rounded-full bg-white text-foreground shadow-lg border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                    title="목사님 소개"
                >
                    <User className="w-5 h-5" />
                    <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        목사님 소개
                    </span>
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full bg-white text-primary shadow-lg border border-black/10 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl pointer-events-auto",
                    isOpen ? "rotate-180 bg-primary text-white border-primary" : ""
                )}
                aria-label="Open Navigation"
            >
                <PanelTopOpen className="w-6 h-6" />
            </button>
        </div>
    );
}
