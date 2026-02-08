import { User, History } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import { getSermonDates } from '@/lib/sermons';
import { FEATURED_VIDEO_IDS } from '@/lib/videos';
import { getVideoListMetadata } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    const sermonDates = await getSermonDates();

    // Fetch real metadata (title, thumbnail, author)
    const videos = await getVideoListMetadata(FEATURED_VIDEO_IDS);

    // Fallback
    if (videos.length === 0) {
        // ... handled gracefully
    }

    const mainVideo = videos[0];
    const otherVideos = videos.slice(1);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 pb-0 pt-12 md:pt-20">

            {/* Split Layout Content */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 mb-12">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* LEFT: Main Player (Flex Grow to take available space, e.g. 70%) */}
                    <div className="flex-[2.5] flex flex-col">
                        {mainVideo ? (
                            <div className="group w-full">
                                {/* Video Player Container - Enforce Aspect Ratio */}
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1&rel=0`}
                                        className="w-full h-full object-cover"
                                        title={mainVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Video Info */}
                                <div className="mt-4 px-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2 font-serif">
                                        {mainVideo.title}
                                    </h1>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium text-gray-700">{mainVideo.author_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Loading State
                            <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
                                <p className="text-gray-400">Loading...</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Scrollable List (Flex 1, Match Height of Left) */}
                    {/* The height will be determined by the Grid/Flex parent. 
                        To make it EXACTLY the height of the video player, we need to match the aspect-video height. 
                        But since content below video (title) expands height, "equal height" usually means the column height.
                        Here we set a max-height relative to viewport or aspect ratio to match the "visual" block.
                    */}
                    <div className="flex-1 lg:h-auto flex flex-col">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="font-bold text-lg text-gray-900 font-serif">다음 동영상</h3>
                        </div>

                        {/* Scrollable Container 
                            We use aspect-video to match the PLAYER height roughly, or just a fixed max-height that feels right.
                            However, user asked for "Main video left and remainder scrollable... same height".
                            If we use a fixed aspect-ratio for this container, it will match the video player next to it.
                        */}
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent lg:max-h-[calc(100vw*0.5625*0.7)] xl:max-h-[800px]">
                            {/* Note: Calculated max-height is tricky without JS. 
                            Instead, let's just make it a fixed meaningful height or allow it to fill column if we used grid.
                            Actually, simpler: Let's simpler set a max-height that prevents it from being too long.
                        */}
                            <div className="space-y-3">
                                {otherVideos.map((video, idx) => (
                                    <div key={video.id + idx} className="group flex gap-3 cursor-pointer p-2 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                        {/* Thumbnail */}
                                        <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={video.thumbnail_url}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Meta */}
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 mb-1 font-sans">
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 max-w-[90%] truncate">
                                                {video.author_name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Shared Footer */}
            <div className="bg-white text-black border-t border-gray-200">
                <SharedFooterWidgets sermonDates={sermonDates} />
            </div>
        </main>
    );
}
