'use client';

import Link from 'next/link';
import { Mail, MapPin, User } from 'lucide-react';
import ClientCalendarWrapper from '@/components/ClientCalendarWrapper';
import { useEffect, useRef, useState } from 'react';

interface SharedFooterWidgetsProps {
    sermonDates: string[];
}

export default function SharedFooterWidgets({ sermonDates }: SharedFooterWidgetsProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.9);

    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current) return;

            const rect = imageRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how far the element is from the bottom of the screen
            // 0 = Just entering from bottom
            // 1 = Reached top
            // Normalized roughly to 0-1 range when in view
            const progress = 1 - (rect.top / windowHeight);

            // Animation Range:
            // Starts at 0.95 (entering bottom)
            // Ends at 1.10 (near top or center) - Subtle growth, less "zoomed in"
            const safeProgress = Math.min(Math.max(progress, 0), 1);
            const newScale = 0.95 + (safeProgress * 0.15);

            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* 2. CALENDAR SECTION */}
            <section id="calendar" className="py-12 md:py-24 px-6 bg-secondary/30 mt-8 md:mt-20 border-t border-card-border">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-secondary-foreground/60 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Archive</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-6">지난 말씀 보기</h2>
                        <p className="text-muted text-lg mb-8 leading-relaxed font-serif">
                            지나간 날의 말씀을 다시 묵상하며 은혜를 나누세요.
                            날짜를 선택하면 해당 날짜의 설교로 이동합니다.
                        </p>
                        <Link href="/sermons" className="inline-flex items-center text-primary font-bold hover:text-primary/80 transition-colors group">
                            전체 목록 보기
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-gradient-to-br from-indigo-950 via-teal-900 to-emerald-800 border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden">
                            {/* Texture overlay for better blending if needed, or just pure gradient */}
                            <ClientCalendarWrapper sermonDates={sermonDates} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PROFILE SECTION (Parallax + Modern White Card) */}
            <section
                className="pt-[75vh] pb-32 px-6 relative bg-fixed bg-cover bg-center bg-no-repeat border-t border-card-border"
                style={{
                    backgroundImage: 'url(/profile_background.png)',
                }}
            >
                {/* Content Wrapper */}
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-24">

                    {/* Modern White Card Frame */}
                    <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50">
                        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                            {/* Left: Image */}
                            <div className="shrink-0">
                                <Link href="/profile" className="block w-48 md:w-64 relative cursor-pointer group/image">
                                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover/image:scale-[1.02]">
                                        <img
                                            src="/pastor-profile.jpg"
                                            alt="Rev. Byung-Sung Jung"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.querySelector('.placeholder-icon')!.classList.remove('hidden');
                                            }}
                                        />
                                        <div className="placeholder-icon hidden absolute inset-0 bg-gray-100 flex items-center justify-center">
                                            <User className="w-16 h-16 text-gray-300" />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Right: Text */}
                            <div className="text-center md:text-left flex-1 min-w-0 pt-2">
                                <Link href="/profile" className="block group/profile cursor-pointer">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 group-hover/profile:text-primary transition-colors">정병성 목사</h2>
                                        <p className="text-primary font-bold tracking-wide uppercase text-sm">Pastor Profile</p>
                                    </div>

                                    <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed font-serif mb-8 text-lg">
                                        <p className="mb-4">
                                            정병성 목사는 스페인 라스팔마스를 중심으로 유럽과 아프리카를 잇는 선교 사역에 평생을 헌신한 순복음교단 목회자입니다.
                                        </p>
                                        <p className="mb-4">
                                            그는 <b className="text-gray-900">라스팔마스 순복음교회 담임목사(1999~2026)</b>와 <b className="text-gray-900">순복음교회 아프리카 총회장(~2026)</b>을 맡아 여러 나라와 문화의 성도들을 섬겼습니다.
                                        </p>
                                        <p>
                                            정 목사는 기도와 말씀 위에 사람을 세우는 목회를 통해 현지인 중심의 자생 교회가 뿌리내리도록 힘써왔으며,
                                            2026년 은퇴 이후에도 그의 사역은 유럽과 아프리카 곳곳에서 조용히 열매를 맺고 있습니다.
                                        </p>
                                    </div>

                                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 font-bold transition-all duration-300 group-hover/profile:bg-primary group-hover/profile:text-white group-hover/profile:border-primary group-hover/profile:pl-8 group-hover/profile:shadow-lg">
                                        <span>더 자세한 소개 보기</span>
                                        <span className="text-xl leading-none mb-0.5">→</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer inside the Parallax Section */}
                    <footer className="text-center text-white/80 text-sm flex flex-col gap-2 items-center justify-center pb-8 drop-shadow-md">
                        <p>&copy; {new Date().getFullYear()} Chung. All rights reserved.</p>
                    </footer>

                </div>
            </section>
        </>
    );
}
