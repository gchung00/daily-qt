'use client';

import Link from 'next/link';
import { Mail, MapPin, User, ArrowLeft } from 'lucide-react';

import { useEffect, useState } from 'react';

const VIDEO_IDS = [
    'cZW3Ouwywag',
    'XhuMt6HlKG4',
    'eASV6ZAv11I', // Fixed broken ID logic if needed, just assuming these are valid
    'JMkW4jkQ1NY',
    '8L6RA87Rmdk',
    '2LRL6ZKxNjA'
];

export default function ProfilePage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [featuredVideo, setFeaturedVideo] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;

            setScrollProgress(scroll);
        }

        window.addEventListener('scroll', handleScroll);

        // Pick random video
        const randomId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
        setFeaturedVideo(randomId);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-background relative font-sans pb-20 text-foreground">
            {/* Background Decor (Static) - kept as base */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* SCROLL REVEAL BACKGROUND */}
            {/* A calm background image that reveals/fades in as you scroll */}
            <div
                className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ease-out"
                style={{ opacity: Math.min(scrollProgress * 3, 0.4) }} // Fades in quickly then stays subtle
            >
                <div className="absolute inset-0 bg-secondary/80 mix-blend-overlay"></div> {/* Overlay for text readability */}
                <img
                    src="/background_calm.png"
                    alt="Calm Background"
                    className="w-full h-full object-cover grayscale-[20%] opacity-80"
                />
            </div>

            <div className="max-w-4xl mx-auto pt-4 px-6 relative z-10">
                <div className="mb-4">
                    <Link href="/" className="inline-flex items-center text-muted hover:text-primary transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                    </Link>
                </div>

                <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
                    <div className="text-center md:text-left">
                        {/* Profile Image - Border Removed */}
                        <div className="w-72 mx-auto md:mx-0 mb-8 relative">
                            {/* Simple clean rounded image without thick borders */}
                            <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                                <img
                                    src="/pastor-profile.jpg"
                                    alt="Rev. Byung-Sung Jung"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.querySelector('.placeholder-icon')!.classList.remove('hidden');
                                    }}
                                />
                                <User className="w-24 h-24 text-muted hidden placeholder-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-foreground mb-2 serif-emphasis">정병성 목사</h1>
                        <p className="text-primary text-lg font-bold tracking-wide mb-6 uppercase">Pastor Profile</p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 serif-emphasis">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                소개
                            </h2>
                            <p className="text-lg text-foreground/80 leading-relaxed mb-4 font-medium">
                                정병성 목사는 스페인 라스팔마스를 중심으로 유럽과 아프리카를 잇는 복음 사역에 평생을 헌신해 온 순복음교단 목회자이자 선교 리더입니다.
                                <b>라스팔마스 순복음교회 담임목사(1999~2026)</b>로 사역했으며, <b>순복음교회 아프리카 총회장(재임 ~2026)</b>으로 아프리카 전역의 선교 사역을 섬기고 2026년 은퇴했습니다.
                            </p>
                            <p className="text-lg text-foreground/80 leading-relaxed mb-4 font-medium">
                                1988년 영산신학원(현 한세대학교)을 졸업한 그는 여의도순복음교회에서 대교구장과 교무기획부장 등을 역임하며 목회와 행정 전반에서 경험을 쌓았습니다. 이후 1999년 스페인 라스팔마스로 부임해 본격적인 해외 선교의 길에 들어섰고, 약 30년에 걸쳐 현지 교회와 선교 현장을 지켜왔습니다.
                            </p>
                            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                                가족으로는 아내와 슬하에 2명의 자녀를 두고 있습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 serif-emphasis">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                사역 비전
                            </h2>
                            <div className="bg-white p-8 rounded-xl border-l-4 border-primary shadow-sm">
                                <p className="text-xl italic text-foreground font-serif mb-6 leading-loose">
                                    "선교는 멈추지 않아야 한다.<br />
                                    복음이 말이 아니라 삶으로 전해지도록..."
                                </p>
                                <p className="text-muted leading-relaxed font-medium">
                                    그의 사역에서 특히 두드러지는 특징은 현지인 사역자를 세우는 선교였습니다. 건물이나 단기 프로젝트 중심의 선교를 넘어, 성령 충만하고 헌신적인 현지 지도자를 훈련하고 이양함으로써 자생적인 교회가 세워지도록 힘써왔습니다.
                                    아프리카 여러 국가에서 제자훈련과 성경교육, 교회 개척을 진행하는 한편, 학교·보건소 설립, 기술 교육, 자립 프로젝트 등 삶의 현장을 회복하는 사역도 함께 감당했습니다.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 serif-emphasis">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                주요 약력
                            </h2>
                            <ul className="space-y-4 text-foreground/80 font-medium">
                                <li className="flex gap-4">
                                    <span className="font-bold text-primary min-w-[60px]">1988</span>
                                    <span>영산신학원(현 한세대학교) 졸업</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-bold text-primary min-w-[60px]">~1998</span>
                                    <span>여의도순복음교회 대교구장 및 교무기획부장 역임</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-bold text-primary min-w-[60px]">1999</span>
                                    <span>스페인 라스팔마스 부임</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-bold text-primary min-w-[60px]">~2026</span>
                                    <span>라스팔마스 순복음교회 담임목사 / 순복음교회 아프리카 총회장</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3 serif-emphasis">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                설교 영상
                            </h2>
                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
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
                            <p className="text-center text-sm text-muted mt-2">
                                * 추천 설교 영상 (새로고침 시 변경됩니다)
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

