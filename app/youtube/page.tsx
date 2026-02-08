import { Play } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import { getSermonDates } from '@/lib/sermons';

// Define videos with shorter, "abbreviated" titles as requested
const VIDEOS = [
    { id: "cZW3Ouwywag", title: "2026.02.08 주일예배" },
    { id: "XhuMt6HlKG4", title: "2026.02.01 주일예배" },
    { id: "eASV6ZAv11I", title: "특별 새벽기도회 (1)" },
    { id: "JMkW4jkQ1NY", title: "특별 새벽기도회 (2)" },
    { id: "8L6RA87Rmdk", title: "수요 예배 설교" },
    { id: "2LRL6ZKxNjA", title: "금요 성령집회" },
    { id: "k8qwRIDanTs", title: "청년부 수련회" }
];

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    const sermonDates = await getSermonDates();

    return (
        <main className="min-h-screen bg-stone-50 text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 pb-0">
            {/* Header/Hero Section */}
            <section className="relative pt-24 md:pt-28 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Title Block */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-1 bg-red-600"></span>
                            <span className="text-red-600 font-bold tracking-widest text-xs uppercase">
                                Sermon Archive
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight text-gray-900">
                            영상 설교
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl font-normal leading-relaxed">
                            하나님의 말씀을 영상으로 만나보세요.
                        </p>
                    </div>

                    {/* Featured Video (Latest) - Clean Card Style */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/5 border border-white/50 bg-white group">
                        <iframe
                            src={`https://www.youtube.com/embed/${VIDEOS[0].id}?autoplay=0&rel=0`}
                            className="w-full h-full object-cover"
                            title="Latest Sermon"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            {/* Video Grid Section */}
            <section className="px-6 py-12 border-t border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-800">
                        <Play className="w-5 h-5 text-red-600 fill-current" />
                        최신 설교 목록
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                        {VIDEOS.map((video, idx) => (
                            <div key={video.id} className="group cursor-pointer">
                                {/* Thumbnail Container */}
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                                        className="w-full h-full"
                                        title={video.title}
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                                {/* Video Info */}
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-red-600 transition-colors font-sans">
                                        {video.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {idx === 0 ? 'New Upload' : 'Sermon Video'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shared Footer */}
            <div className="bg-white text-black border-t border-stone-200">
                <SharedFooterWidgets sermonDates={sermonDates} />
            </div>
        </main>
    );
}
