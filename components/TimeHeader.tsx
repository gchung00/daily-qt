'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TimeHeader() {
    // Suppress hydration mismatch by only rendering on client
    const [mounted, setMounted] = useState(false);
    const [times, setTimes] = useState({ lasPalmas: '', seoul: '' });

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();

            setTimes({
                lasPalmas: now.toLocaleTimeString('en-GB', {
                    timeZone: 'Atlantic/Canary',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                seoul: now.toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Seoul',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000 * 60); // Update every minute is enough
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <div className="h-6"></div>; // Placeholder to prevent layout shift

    return (
        <div className="w-full bg-background border-b border-secondary/10 py-1">
            <div className="max-w-5xl mx-auto px-6 md:px-12 flex justify-center md:justify-end">
                <Link href="/admin" className="group flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted/30 hover:text-muted transition-colors font-mono cursor-default hover:cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Las Palmas</span>
                        <span>{times.lasPalmas}</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Seoul</span>
                        <span>{times.seoul}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
