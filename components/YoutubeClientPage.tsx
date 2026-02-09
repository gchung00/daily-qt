'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Play, Pause, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid hydration issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export interface VideoItem {
    id: string; // YouTube ID or unique ID for HLS
    type: 'youtube' | 'hls';
    url?: string; // Required for HLS
    title: string;
    thumbnail_url: string;
    author_name: string;
    date?: string; // Optional date for sermons
}

interface YoutubeClientPageProps {
    videos: VideoItem[];
}

export default function YoutubeClientPage({ videos }: YoutubeClientPageProps) {
    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const playerRef = useRef<any>(null);

    // Initialize random video on mount (client-side only to avoid hydration mismatch if random)
    useEffect(() => {
        setIsClient(true);
        const randomIndex = Math.floor(Math.random() * videos.length);
        setCurrentIndex(randomIndex);
    }, [videos.length]);

    const currentVideo = videos[currentIndex];

    // Handle video end / auto-next
    const handleVideoEnded = () => {
        if (autoplay) {
            const nextIndex = (currentIndex + 1) % videos.length;
            setCurrentIndex(nextIndex);
        }
    };

    // YouTube specific message handler (only needed if using iframe directly)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin.includes('youtube.com')) {
                try {
                    // This was for the custom iframe. If we move to ReactPlayer for everything or mix, 
                    // we might not need this if ReactPlayer handles onEnded.
                    // For now, let's keep it if we use iframe for YouTube.
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
        <div className="min-h-screen bg-white sm:bg-background text-gray-900 font-sans pb-12">
            {/* MAIN CONTENT */}
            <div className="max-w-[1700px] mx-auto px-4 md:px-6 pt-20">

                {/* Flex Container for Desktop "Equal Height" effect */}
                <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-160px)] min-h-[600px]">

                    {/* LEFT: Main Player (Flex Grow) */}
                    <div className="lg:flex-[3] flex flex-col h-full bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="w-full bg-black flex-shrink-0 relative" style={{ aspectRatio: '16/9' }}>
                            {currentVideo?.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${autoplay ? 1 : 0}&rel=0&enablejsapi=1`}
                                    className="w-full h-full absolute inset-0"
                                    title={currentVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full absolute inset-0">
                                    <ReactPlayer
                                        url={currentVideo?.url}
                                        width="100%"
                                        height="100%"
                                        playing={autoplay}
                                        controls
                                        onEnded={handleVideoEnded}
                                        config={{
                                            file: {
                                                forceHLS: true,
                                            }
                                        } as any}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Video Meta (Below Player) */}
                        <div className="flex-1 p-5 overflow-y-auto">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3 font-serif line-clamp-2">
                                {currentVideo?.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-base">{currentVideo?.author_name}</span>
                                </div>
                                {currentVideo?.date && (
                                    <span className="text-gray-400">| {currentVideo.date}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Playlist (Flex 1, constrained height) */}
                    <div className="lg:flex-1 h-full flex flex-col min-w-[320px] bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* List Header */}
                        <div className="p-4 flex items-center justify-between bg-gray-50/50">
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
                                        key={video.id + idx}
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
