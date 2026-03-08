'use client';

import Link from 'next/link';
import { Mail, MapPin, User, Play } from 'lucide-react';
import ClientCalendarWrapper from '@/components/ClientCalendarWrapper';
import { AnalogClock } from '@/components/AnalogClock';
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
            const progress = 1 - (rect.top / windowHeight);
            const safeProgress = Math.min(Math.max(progress, 0), 1);
            const newScale = 0.95 + (safeProgress * 0.15);

            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <section id="calendar" className="py-24 px-4 md:px-12 border-t border-card-border/30 bg-[#f7f5f0]">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* LEFT COLUMN: Sidebar with vertical clocks */}
                    <div className="lg:col-span-5 h-full flex flex-col pt-8">
                        <div className="mb-20">
                            <span className="text-[#a84435] text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block opacity-80">Archivo</span>
                            <h2 className="text-4xl sm:text-5xl font-normal text-gray-900 mb-8 serif-emphasis leading-tight tracking-tight">지난 말씀 보기</h2>
                            <p className="text-gray-600 text-[15px] leading-[1.8] font-normal max-w-sm mb-12">
                                지나간 날의 말씀을 다시 묵상하며 은혜를 나누세요. 날짜를 선택하면 해당 날짜의 설교로 이동합니다.
                            </p>
                            <div className="flex flex-col gap-4 items-start">
                                <Link href="/sermons" className="group flex items-center gap-3 text-xs font-bold text-[#a84435] tracking-widest uppercase hover:text-black transition-colors">
                                    <span>전체 목록</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                                <Link href="/youtube" className="group flex items-center gap-3 text-xs font-bold text-[#a84435] tracking-widest uppercase hover:text-black transition-colors">
                                    <span>영상 설교</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Vertical Clocks */}
                        <div className="mt-auto space-y-12">
                            <div className="flex items-center gap-6">
                                <AnalogClock timeZone="Atlantic/Canary" label="" />
                                <div>
                                    <span className="block text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Las Palmas</span>
                                    <span className="block font-serif italic text-gray-900">Canary Islands</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <AnalogClock timeZone="Asia/Seoul" label="" />
                                <div>
                                    <span className="block text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Seoul</span>
                                    <span className="block font-serif italic text-gray-900">South Korea</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Calendar */}
                    <div className="lg:col-span-7">
                        <ClientCalendarWrapper sermonDates={sermonDates} />
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
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-24">
                    <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50">
                        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
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

                            <div className="text-center md:text-left flex-1 min-w-0 pt-2">
                                <Link href="/profile" className="block group/profile cursor-pointer">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 group-hover/profile:text-primary transition-colors">정병성 목사</h2>
                                        <p className="text-primary font-bold tracking-wide uppercase text-sm">Perfil del Pastor</p>
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
                                        <span>Leer más (자세히 보기)</span>
                                        <span className="text-xl leading-none mb-0.5">→</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center text-white/80 text-sm flex flex-col gap-2 items-center justify-center pb-8 drop-shadow-md">
                        <p>&copy; {new Date().getFullYear()} Chung. All rights reserved.
                            <Link href="/admin" className="opacity-20 hover:opacity-100 transition-opacity text-xs ml-2">v2.1</Link>
                        </p>
                    </footer>

                </div>
            </section >
        </>
    );
}
