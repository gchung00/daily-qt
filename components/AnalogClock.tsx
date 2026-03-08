'use client';

import { useEffect, useState } from 'react';

interface AnalogClockProps {
    timeZone: string;
    label: string;
}

export function AnalogClock({ timeZone, label }: AnalogClockProps) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        // Set initial time
        setTime(new Date());

        // Update time every second
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) {
        // Return empty placeholder with same dimensions to prevent layout shift
        return (
            <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full border border-primary/20 bg-transparent flex items-center justify-center opacity-0 mt-2 mb-4"></div>
                <p className="text-[9px] tracking-[0.2em] font-medium text-primary/60 uppercase text-center serif-emphasis opacity-0">{label}</p>
            </div>
        );
    }

    // Get local time in the specified timezone
    const localTimeString = time.toLocaleString('en-US', { timeZone });
    const localTime = new Date(localTimeString);

    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minuteDegrees = minutes * 6 + seconds * 0.1;
    const secondDegrees = seconds * 6;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center bg-transparent drop-shadow-sm mb-4">
                {/* Center Dot */}
                <div className="absolute w-1 h-1 bg-primary rounded-full z-10" />

                {/* Hour Hand */}
                <div
                    className="absolute w-0.5 bg-primary rounded-full origin-bottom"
                    style={{ height: '22%', bottom: '50%', transform: `rotate(${hourDegrees}deg)` }}
                />

                {/* Minute Hand */}
                <div
                    className="absolute w-[1.5px] bg-primary/80 rounded-full origin-bottom"
                    style={{ height: '35%', bottom: '50%', transform: `rotate(${minuteDegrees}deg)` }}
                />

                {/* Second Hand */}
                <div
                    className="absolute w-[0.5px] bg-[#f37021] origin-bottom delay-75"
                    style={{ height: '42%', bottom: '50%', transform: `rotate(${secondDegrees}deg)` }}
                />

                {/* Ticks */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 pb-[2px]"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                    >
                        <div className={`mx-auto w-[0.5px] ${i % 3 === 0 ? 'h-1.5 bg-primary/50' : 'h-1 bg-primary/20'}`} />
                    </div>
                ))}
            </div>
            <p className="text-[9px] tracking-[0.2em] font-medium text-primary/60 uppercase text-center serif-emphasis">
                {label}
            </p>
        </div>
    );
}
