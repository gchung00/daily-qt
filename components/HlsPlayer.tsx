'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface HlsPlayerProps {
    src: string;
    autoPlay?: boolean;
    className?: string;
    onEnded?: () => void;
}

export default function HlsPlayer({ src, autoPlay = false, className, onEnded }: HlsPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        const initPlayer = () => {
            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (autoPlay) {
                        video.play().catch(() => {
                            console.log('Autoplay blocked');
                            setIsMuted(true); // Fallback to muted autoplay
                            video.muted = true;
                            video.play();
                        });
                    }
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("fatal network error encountered, try to recover");
                                hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log("fatal media error encountered, try to recover");
                                hls?.recoverMediaError();
                                break;
                            default:
                                console.log("fatal error, cannot recover");
                                hls?.destroy();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = src;
                video.addEventListener('loadedmetadata', () => {
                    if (autoPlay) {
                        video.play().catch(() => { /* Auto-play blocked */ });
                    }
                });
            }
        };

        if (src) {
            initPlayer();
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, autoPlay]);

    // Handle standard video events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            if (onEnded) onEnded();
        };
        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };
        const handleProgress = () => {
            if (video.duration && video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                setLoaded((bufferedEnd / video.duration) * 100);
            }
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('progress', handleProgress);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('progress', handleProgress);
        };
    }, [onEnded]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(e.target.value); // 0 to 100
        if (videoRef.current && videoRef.current.duration) {
            videoRef.current.currentTime = (seekTime / 100) * videoRef.current.duration;
            setProgress(seekTime);
        }
    };

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    // Show/Hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 2000); // Hide after 2s of inactivity
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative group bg-black overflow-hidden select-none", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                playsInline
            />

            {/* Custom Controls Overlay */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 transition-opacity duration-300",
                    showControls ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer group/slider">
                    {/* Buffered */}
                    <div
                        className="absolute h-full bg-white/50 rounded-full transition-all duration-300"
                        style={{ width: `${loaded}%` }}
                    />
                    {/* Current Progress */}
                    <div
                        className="absolute h-full bg-red-600 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/slider:scale-100 transition-transform" />
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                        {/* Time display could be added here if needed */}
                        <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Big Center Play Button (Only when paused) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ background: 'rgba(0,0,0,0.1)' }}
                >
                    <button
                        onClick={togglePlay}
                        className="pointer-events-auto w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all transform hover:scale-110"
                    >
                        <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
}
