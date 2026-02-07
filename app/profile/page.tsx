'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

const BASE_SECTIONS = [
    {
        id: 1,
        image: '/profile-001.jpg',
        text: (
            <>
                <h2 className="text-4xl font-black font-serif mb-6 leading-tight text-gray-900 drop-shadow-sm">
                    복음 사역에<br />평생을 헌신하다
                </h2>
                <div className="w-16 h-1 bg-primary mb-8 rounded-full shadow-sm"></div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    정병성 목사는 스페인 라스팔마스를 중심으로 유럽과 아프리카를 잇는 복음 사역에 평생을 헌신해 온 순복음교단 목회자이자 선교 리더입니다.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    <b>라스팔마스 순복음교회 담임목사(1999~2026)</b>로 사역했으며, <b>순복음교회 아프리카 총회장(재임 ~2026)</b>으로 아프리카 전역의 선교 사역을 섬기고 2026년 은퇴했습니다.
                </p>
            </>
        )
    },
    {
        id: 2,
        image: '/profile-002.jpg',
        text: (
            <>
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-gray-900">
                    사역의 시작과 훈련
                </h2>
                <div className="w-12 h-1 bg-primary/60 mb-6 rounded-full"></div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    1988년 영산신학원(현 한세대학교)을 졸업한 그는 여의도순복음교회에서 대교구장과 교무기획부장 등을 역임하며 목회와 행정 전반에서 탄탄한 경험을 쌓았습니다.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    이후 1999년 스페인 라스팔마스로 부임해 본격적인 해외 선교의 길에 들어섰고, 약 30년에 걸쳐 현지 교회와 선교 현장을 묵묵히 지켜왔습니다.
                </p>
            </>
        )
    },
    {
        id: 3,
        image: '/profile-003.jpg',
        text: (
            <>
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-gray-900">
                    다문화 공동체로<br />성장하다
                </h2>
                <div className="w-12 h-1 bg-primary/60 mb-6 rounded-full"></div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    라스팔마스 순복음교회는 한국인, 스페인인, 아프리카인, 중국인, 그리고 전 세계를 오가는 선원들이 함께 예배하는 다문화 공동체로 성장했습니다.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    정 목사는 이 교회를 통해 선원 선교, 방송 선교, 노방 전도, 새신자 정착 사역을 꾸준히 이어가며 “기도와 말씀에 충실할 때 교회는 자연스럽게 세워진다”는 목회 철학을 현장에서 실천해 왔습니다.
                </p>
            </>
        )
    },
    {
        id: 4,
        image: '/profile-004.jpg',
        text: (
            <>
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-gray-900">
                    사람을 세우는 선교
                </h2>
                <div className="w-12 h-1 bg-primary/60 mb-6 rounded-full"></div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    그의 사역에서 특히 두드러지는 특징은 현지인 사역자를 세우는 선교였습니다. 건물이나 단기 프로젝트 중심의 선교를 넘어, 성령 충만하고 헌신적인 현지 지도자를 훈련하고 이양함으로써 자생적인 교회가 세워지도록 힘써왔습니다.
                </p>
                <div className="bg-white/60 mb-6 p-6 rounded-xl border border-white/50 shadow-inner">
                    <p className="italic font-serif text-gray-900 font-semibold">
                        "코로나19 팬데믹과 같은 어려운 시기에도 선교는 멈추지 않아야 한다.<br />
                        복음이 말이 아니라 삶으로 전해지도록..."
                    </p>
                </div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    아프리카 여러 국가에서 제자훈련과 성경교육, 교회 개척을 진행하는 한편, 학교·보건소 설립, 기술 교육 등 삶의 현장을 회복하는 사역도 함께 감당했습니다.
                </p>
            </>
        )
    },
    {
        id: 5,
        image: '/profile-005.jpg',
        text: (
            <>
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-gray-900">
                    아름다운 열매
                </h2>
                <div className="w-12 h-1 bg-primary/60 mb-6 rounded-full"></div>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    2026년 은퇴 후에도 정병성 목사의 사역은 많은 열매로 남아 있습니다. 라스팔마스에서 시작된 작은 교회는 유럽과 아프리카를 잇는 선교의 플랫폼이 되었고, 그가 세운 현지인 지도자들과 제자들은 오늘도 각자의 자리에서 복음을 전하고 있습니다.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-6">
                    그는 끝까지 사람을 세우는 목회, 다음 세대를 준비하는 선교로 하나님 나라의 확장을 조용히, 그러나 깊이 이루어 왔습니다.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    가족으로는 아내와 슬하에 2명의 자녀를 두고 있습니다.
                </p>
            </>
        )
    }
];

const VIDEO_IDS = [
    'cZW3Ouwywag',
    'XhuMt6HlKG4',
    'eASV6ZAv11I',
    'JMkW4jkQ1NY',
    '8L6RA87Rmdk',
    '2LRL6ZKxNjA'
];

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState(0);
    const [featuredVideo, setFeaturedVideo] = useState("");
    const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Random video
        setFeaturedVideo(VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)]);
    }, []);

    // Combine Base Sections with Dynamic Video Section
    const allSections = useMemo(() => [
        ...BASE_SECTIONS,
        {
            id: 6,
            image: '/profile_background.png',
            text: (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 font-serif">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                        설교 영상
                    </h2>

                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-black ring-1 ring-black/10 mb-6">
                        {featuredVideo ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${featuredVideo}`}
                                title="Featured Sermon"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full bg-gray-200 animate-pulse" />
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-500 font-medium mb-12">
                        * 추천 설교 영상 (새로고침 시 변경됩니다)
                    </p>

                    <footer className="pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
                        &copy; 2026 Chung. All rights reserved.
                    </footer>
                </>
            )
        }
    ], [featuredVideo]);

    useEffect(() => {
        // Intersection Observer for Scrollytelling
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setActiveSection(index);
                    }
                });
            },
            {
                threshold: 0.4, // Lower threshold for better mobile detection
                rootMargin: "-20% 0px -20% 0px"
            }
        );

        observerRefs.current.slice(0, allSections.length).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [allSections]);

    return (
        <main className="min-h-screen font-sans bg-black text-foreground">

            {/* STICKY BACKGROUND IMAGE CONTAINER (Full Screen) */}
            <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
                {allSections.map((section, index) => (
                    <div
                        key={section.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            activeSection === index ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {/* GRADIENT OVERLAY: Only darkens bottom/right for readability, preserves image brightness elsewhere */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

                        <img
                            src={section.image}
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover" // Full screen coverage
                            style={{
                                objectPosition: "center 25%" // Focus slightly above center for faces
                            }}
                            onError={(e) => {
                                // Fallback just in case
                                e.currentTarget.style.display = 'none'; // Hide if failed
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* FLOATING HEADER (Back Button) */}
            <div className="fixed top-0 right-0 w-full z-30 p-6 flex justify-between md:justify-end md:p-8 pointer-events-none">
                {/* Optional Mobile Title on Left if needed, keeping it minimal */}
                <div className="md:hidden opacity-0"></div>

                <Link href="/" className="pointer-events-auto inline-flex items-center text-white hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full transition-all font-bold text-sm uppercase tracking-wider group border border-white/20 shadow-lg glow-sm">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
            </div>

            {/* SCROLLING CONTENT STREAM */}
            <div className="relative z-10 w-full min-h-screen px-4 md:px-12 pb-32 pt-20">

                {/* Title Section (Introduction) */}
                <div className="min-h-[80vh] flex flex-col justify-end md:justify-center items-start md:items-end w-full max-w-7xl mx-auto pb-20 pointer-events-none">
                    <div className="text-white text-left md:text-right drop-shadow-lg animate-in fade-in slide-in-from-bottom-10 duration-1000 p-4 rounded-xl backdrop-blur-sm bg-black/10 md:bg-transparent">
                        <p className="text-primary-foreground/90 font-bold tracking-[0.3em] uppercase text-xl mb-4 pl-1 md:pl-0">Pastor Profile</p>
                        <h1 className="text-6xl md:text-8xl font-black font-serif leading-none tracking-tight mb-6">
                            정병성 <span className="opacity-70 font-sans font-thin tracking-normal text-5xl md:text-7xl">목사</span>
                        </h1>
                    </div>
                </div>

                {/* Content Cards */}
                <div className="flex flex-col items-center md:items-end w-full max-w-7xl mx-auto gap-[40vh] md:pb-[20vh]"> {/* Huge gap for scroll effect */}
                    {allSections.map((section, index) => (
                        <div
                            key={section.id}
                            data-index={index}
                            ref={(el) => { observerRefs.current[index] = el; }}
                            className="w-full max-w-xl lg:max-w-2xl bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 transition-all duration-500 hover:bg-white/90 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] md:mr-[5vw] lg:mr-[8vw]" // Margin Right aligns it slightly off-edge on desktop
                        >
                            {section.text}
                        </div>
                    ))}
                </div>

                {/* Bottom Spacer */}
                <div className="h-[20vh]"></div>
            </div>
        </main>
    );
}
