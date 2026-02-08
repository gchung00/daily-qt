'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Play, Pause, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface YoutubeVideo {
    id: string;
    title: string;
    thumbnail_url: string;
    author_name: string;
}

interface YoutubeClientPageProps {
    videos: YoutubeVideo[];
}

export default function YoutubeClientPage({ videos }: YoutubeClientPageProps) {
    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Initialize random video on mount (client-side only to avoid hydration mismatch if random)
    useEffect(() => {
        setIsClient(true);
        const randomIndex = Math.floor(Math.random() * videos.length);
        setCurrentIndex(randomIndex);
    }, [videos.length]);

    const currentVideo = videos[currentIndex];

    // Handle video end / auto-next
    // Note: Reliable "Auto Next" with pure iframe requires YouTube API or postMessage listening.
    // For now, we'll implement the UI and basic iframe autoplay.
    // To truly detect "End", we'd need to listen to window 'message' events from the iframe.
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Very basic check for YouTube postMessages (infoDelivery)
            if (event.origin.includes('youtube.com')) {
                try {
                    const data = JSON.parse(event.data);
                    // YouTube API 'onStateChange' is mostly hidden in post messages for iframes unless enablejsapi=1
                    // Implementing full auto-next via pure iframe messages is flaky. 
                    // We will trust the user's manual navigation for now or minimal support.
                } catch (e) { }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleVideoClick = (index: number) => {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <div className="min-h-screen bg-[#F9F9F9] text-gray-900 font-sans pb-12">

            {/* FLOATING HEADER (Back Button from Profile Page) */}
            <div className="fixed top-0 right-0 w-full z-50 p-6 flex justify-between md:justify-end md:p-8 pointer-events-none">
                <Link href="/" className="pointer-events-auto inline-flex items-center text-gray-900 hover:text-red-600 bg-white/80 hover:bg-white backdrop-blur-md px-5 py-2.5 rounded-full transition-all font-bold text-sm uppercase tracking-wider group border border-gray-200 shadow-lg cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-[1700px] mx-auto px-4 md:px-6 pt-24 md:pt-28">

                {/* Flex Container for Desktop "Equal Height" effect */}
                <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-160px)] min-h-[600px]">

                    {/* LEFT: Main Player (Flex Grow) */}
                    {/* We want this to take up available space. */}
                    <div className="lg:flex-[3] flex flex-col h-full">
                        {/* Video Player Wrapper - Flex 1 to fill height, but keep aspect ratio? 
                            Actually, standard YouTube style: Video is large, list is next to it.
                            We'll let the video define the height naturally by aspect ratio, 
                            and force the list to match it OR fill the screen.
                        */}
                        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 relative" style={{ aspectRatio: '16/9' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${autoplay ? 1 : 0}&rel=0&enablejsapi=1`}
                                className="w-full h-full absolute inset-0"
                                title={currentVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {/* Video Meta (Below Player) */}
                        <div className="mt-5 px-1 flex-shrink-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3 font-serif line-clamp-2">
                                {currentVideo.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-200 p-2 rounded-full">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-base">{currentVideo.author_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Playlist (Flex 1, constrained height) */}
                    {/* On Desktop, we set current height = 100% of parent? 
                        Parent height is set to `lg:h-[calc(100vh-160px)]`.
                        This ensures the right column scroll container has a limit relative to viewport,
                        creating that "YouTube Theater Mode" feel.
                    */}
                    <div className="lg:flex-1 h-full flex flex-col min-w-[320px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* List Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">재생 목록</h3>
                            <button
                                onClick={() => setAutoplay(!autoplay)}
                                className={cn(
                                    "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                                    autoplay ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
                                )}
                            >
                                {autoplay ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                                Auto Next {autoplay ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        {/* Scrollable List Items */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200">
                            {videos.map((video, idx) => {
                                const isPlaying = idx === currentIndex;
                                return (
                                    <div
                                        key={video.id}
                                        onClick={() => handleVideoClick(idx)}
                                        className={cn(
                                            "flex gap-3 p-2 rounded-xl cursor-pointer transition-all group",
                                            isPlaying ? "bg-red-50 ring-1 ring-red-100" : "hover:bg-gray-100"
                                        )}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={video.thumbnail_url}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {isPlaying && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm animate-pulse">
                                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className={cn(
                                                "font-bold text-sm leading-snug line-clamp-2 mb-1 group-hover:text-red-600 transition-colors",
                                                isPlaying ? "text-red-700" : "text-gray-900"
                                            )}>
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate">
                                                {video.author_name}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
