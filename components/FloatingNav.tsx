"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, List, User, Home, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingNav() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    // Initial check for Home
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Calendar Navigation (Smart Scroll)
    const handleCalendar = (e: React.MouseEvent) => {
        const element = document.getElementById("calendar");
        if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                (scrolled || !isHome) && pathname !== "/profile" && pathname !== "/sermons" && pathname !== "/youtube" ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 py-2" : "bg-transparent py-4"
            )}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center">

                {/* Left: Empty for balance */}
                <div></div>

                {/* Center: Main Menu */}
                <div className={cn(
                    "flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-1 rounded-full sm:p-0 transition-all duration-300",
                    pathname === "/profile" || pathname === "/sermons" || pathname === "/youtube" ? "bg-white/90 backdrop-blur-md shadow-sm px-4 py-2" : "bg-white/50 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
                )}>
                    <NavLink href="/" icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />} label="" />
                    <NavLink href="/sermons" icon={<List className="w-4 h-4 sm:w-5 sm:h-5" />} label="전체 말씀" />
                    <div onClick={handleCalendar} className="cursor-pointer">
                        <NavLink href="/#calendar" icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />} label="달력 보기" />
                    </div>
                    <NavLink href="/youtube" icon={<Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />} label="영상 설교" highlight />
                    <NavLink href="/profile" icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />} label="목사님 소개" />
                </div>

                {/* Right: Admin Lock Icon (Far Right) */}
                <div className="flex justify-end">
                    <Link href="/admin" className="p-2 rounded-full text-teal-900/30 hover:text-teal-900 hover:bg-teal-50 transition-all duration-300" title="Admin Access">
                        <Lock className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, icon, label, highlight = false }: { href: string, icon: React.ReactNode, label: string, highlight?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 group",
                isActive
                    ? "bg-primary text-white shadow-md"
                    : highlight
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <span className={cn("group-hover:scale-110 transition-transform duration-200", isActive ? "text-white" : "")}>
                {icon}
            </span>
            {label && <span className="hidden sm:inline whitespace-nowrap text-xs sm:text-base font-bold">{label}</span>}
        </Link>
    );
}
