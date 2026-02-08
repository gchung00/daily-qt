import { Play, Calendar, User, Eye, History } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import { getSermonDates } from '@/lib/sermons';
import { FEATURED_VIDEO_IDS } from '@/lib/videos';
import { getVideoListMetadata } from '@/lib/youtube';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    const sermonDates = await getSermonDates();

    // Fetch real metadata (title, thumbnail, author)
    // Note: oEmbed doesn't provide date/views without API Key
    // We'll use a placeholder or parse title if possible for date
    const videos = await getVideoListMetadata(FEATURED_VIDEO_IDS);

    // Fallback if fetch fails (rare, but good to have)
    if (videos.length === 0) {
        // ... handled gracefully by returning empty arrays or UI
    }

    const mainVideo = videos[0];
    const otherVideos = videos.slice(1);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 pb-0">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-red-700 transition-colors">
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">
                                Sermon<span className="text-red-600">Tube</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Split Layout Content */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                    {/* LEFT: Main Player (Takes up 2/3 space) */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                        {mainVideo ? (
                            <div className="group">
                                {/* Video Player Container */}
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=0&rel=0`}
                                        className="w-full h-full object-cover"
                                        title={mainVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Video Info */}
                                <div className="mt-6">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                                        {mainVideo.title}
                                    </h1>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium text-gray-700">{mainVideo.author_name}</span>
                                        </div>
                                        {/* Placeholder for date/views since oEmbed lacks them without API key */}
                                        <div className="flex items-center gap-1">
                                            <History className="w-4 h-4" />
                                            <span>Latest Upload</span>
                                        </div>
                                    </div>

                                    {/* Description / Actions Placeholder */}
                                    <div className="mt-6 bg-gray-50 rounded-xl p-6 text-gray-600 leading-relaxed">
                                        <p>
                                            새로운 설교 영상입니다. 말씀을 통해 은혜 받으시길 바랍니다.
                                            (YouTube에서 더 보기: <a href={`https://youtu.be/${mainVideo.id}`} target="_blank" className="text-blue-600 hover:underline">바로가기</a>)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Loading / Empty State
                            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                                <p className="text-gray-400">영상을 불러오는 중입니다...</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Scrollable List (Takes up 1/3 space) */}
                    <div className="lg:col-span-1 h-full">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-gray-900">다음 동영상</h3>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Autoplay Off</span>
                            </div>

                            {/* Scrollable Container */}
                            <div className="space-y-4 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                {otherVideos.map((video, idx) => (
                                    <div key={video.id + idx} className="group flex gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                        {/* Thumbnail */}
                                        <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={video.thumbnail_url}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </div>

                                        {/* Meta */}
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 mb-1">
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-0.5 max-w-[90%] truncate">
                                                {video.author_name}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                YouTube Video
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Shared Footer (Hidden on mobile if needed, but keeping for consistency) */}
            <div className="bg-white text-black border-t border-gray-200 mt-12">
                <SharedFooterWidgets sermonDates={sermonDates} />
            </div>
        </main>
    );
}
