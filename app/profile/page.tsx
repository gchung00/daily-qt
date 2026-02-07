'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const SECTIONS = [
    {
        id: 1,
        image: '/profile-001.jpg',
        text: (
            <>
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-foreground">
                    <span className="text-primary block text-lg font-sans font-bold tracking-widest uppercase mb-2">Total Dedication</span>
                    복음 사역에<br />평생을 헌신하다
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    정병성 목사는 스페인 라스팔마스를 중심으로 유럽과 아프리카를 잇는 복음 사역에 평생을 헌신해 온 순복음교단 목회자이자 선교 리더입니다.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
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
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-foreground">
                    <span className="text-primary block text-lg font-sans font-bold tracking-widest uppercase mb-2">Foundations</span>
                    사역의 시작과 훈련
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    1988년 영산신학원(현 한세대학교)을 졸업한 그는 여의도순복음교회에서 대교구장과 교무기획부장 등을 역임하며 목회와 행정 전반에서 탄탄한 경험을 쌓았습니다.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
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
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-foreground">
                    <span className="text-primary block text-lg font-sans font-bold tracking-widest uppercase mb-2">Based in Las Palmas</span>
                    다문화 공동체로<br />성장하다
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    라스팔마스 순복음교회는 한국인, 스페인인, 아프리카인, 중국인, 그리고 전 세계를 오가는 선원들이 함께 예배하는 다문화 공동체로 성장했습니다.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
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
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-foreground">
                    <span className="text-primary block text-lg font-sans font-bold tracking-widest uppercase mb-2">Mission Philosophy</span>
                    사람을 세우는 선교
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    그의 사역에서 특히 두드러지는 특징은 현지인 사역자를 세우는 선교였습니다. 건물이나 단기 프로젝트 중심의 선교를 넘어, 성령 충만하고 헌신적인 현지 지도자를 훈련하고 이양함으로써 자생적인 교회가 세워지도록 힘써왔습니다.
                </p>
                <div className="bg-white/50 border-l-4 border-primary p-6 rounded-r-lg backdrop-blur-sm shadow-sm my-6">
                    <p className="italic font-serif text-foreground">
                        "코로나19 팬데믹과 같은 어려운 시기에도 선교는 멈추지 않아야 한다.<br />
                        복음이 말이 아니라 삶으로 전해지도록..."
                    </p>
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
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
                <h2 className="text-3xl font-bold font-serif mb-6 leading-tight text-foreground">
                    <span className="text-primary block text-lg font-sans font-bold tracking-widest uppercase mb-2">Enduring Legacy</span>
                    아름다운 열매
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    2026년 은퇴 후에도 정병성 목사의 사역은 많은 열매로 남아 있습니다. 라스팔마스에서 시작된 작은 교회는 유럽과 아프리카를 잇는 선교의 플랫폼이 되었고, 그가 세운 현지인 지도자들과 제자들은 오늘도 각자의 자리에서 복음을 전하고 있습니다.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                    그는 끝까지 사람을 세우는 목회, 다음 세대를 준비하는 선교로 하나님 나라의 확장을 조용히, 그러나 깊이 이루어 왔습니다.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
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
                threshold: 0.5, // Trigger when 50% visible
                rootMargin: "-10% 0px -10% 0px"
            }
        );

        observerRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-background font-sans text-foreground">

            {/* STICKY BACKGROUND IMAGE CONTAINER (Full Screen) */}
            <div className="fixed inset-0 z-0 overflow-hidden bg-black/80">
                {SECTIONS.map((section, index) => (
                    <div
                        key={section.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            activeSection === index ? "opacity-60" : "opacity-0"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" /> {/* Left Gradient for depth */}
                        <img
                            src={section.image}
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback just in case
                                e.currentTarget.src = '/pastor-profile.jpg';
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* SCROLLING CONTENT CONTAINER */}
            <div className="relative z-10 min-h-screen flex flex-col items-end">

                {/* Header / Nav (Floating) */}
                <div className="fixed top-0 right-0 w-full z-20 p-6 flex justify-end pointer-events-none">
                    <Link href="/" className="pointer-events-auto inline-flex items-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all font-medium text-sm uppercase tracking-wider group border border-white/10">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>
                </div>

                {/* THE SIDEBAR / CONTENT PANEL */}
                {/* 
                    Responsive Design:
                    - Mobile (< md): w-full, bg-white/95 (almost opaque), slide up
                    - Tablet (md): w-[60%] or [70%], keeping image visible on left
                    - Desktop (lg): w-[50%] or [45%], comfortable split
                    - Added shadow and blur to soften the edge boundary
                */}
                <div className="w-full md:w-[65%] lg:w-[50%] bg-white/90 backdrop-blur-xl shadow-[-20px_0_60px_rgba(0,0,0,0.15)] min-h-screen border-l border-white/20 transition-[width] duration-300">

                    {/* Profile Title (Initial) */}
                    <div className="pt-32 pb-4 px-8 md:px-16">
                        <h1 className="text-5xl font-black text-foreground mb-4 serif-emphasis leading-tight">
                            정병성 목사
                        </h1>
                        <p className="text-primary text-xl font-bold tracking-[0.2em] uppercase">
                            Pastor Profile
                        </p>
                    </div>

                    {/* Scrollytelling Sections */}
                    <div className="pb-20">
                        {SECTIONS.map((section, index) => (
                            <div
                                key={section.id}
                                data-index={index}
                                ref={(el) => { observerRefs.current[index] = el; }}
                                className="min-h-[80vh] flex flex-col justify-center px-8 md:px-16 py-20 border-l-2 border-transparent"
                            >
                                {section.text}
                            </div>
                        ))}
                    </div>

                    {/* Video Section (Footer) */}
                    <section className="px-8 md:px-16 py-24 bg-secondary/30 mt-auto border-t border-black/5">
                        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 serif-emphasis">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            설교 영상
                        </h2>
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black ring-1 ring-black/10">
                            {featuredVideo && (
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
                            )}
                        </div>
                        <p className="text-center text-sm text-muted mt-4 font-medium">
                            * 추천 설교 영상 (새로고침 시 변경됩니다)
                        </p>

                        <footer className="mt-16 pt-8 border-t border-black/5 text-center text-sm text-muted/60">
                            &copy; 2026 Chung. All rights reserved.
                        </footer>
                    </section>
                </div>
            </div>
        </main>
    );
}
