import { Play } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import { getSermonDates } from '@/lib/sermons';

// Define videos correctly
const VIDEOS = [
    { id: "cZW3Ouwywag", title: "주일 예배" },
    { id: "XhuMt6HlKG4", title: "수요 예배" },
    { id: "eASV6ZAv11I", title: "특별 집회" },
    { id: "JMkW4jkQ1NY", title: "성경 강해" },
    { id: "8L6RA87Rmdk", title: "찬양 예배" },
    { id: "2LRL6ZKxNjA", title: "청년부 예배" },
    { id: "k8qwRIDanTs", title: "새벽 기도회" }
];

export const dynamic = 'force-dynamic';

export default async function YoutubePage() {
    const sermonDates = await getSermonDates();

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-900 selection:text-white pb-0">
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="block text-red-600 font-bold tracking-widest text-xs uppercase mb-4">
                            Sermon Archive
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white/95">
                            영상으로 만나는<br />
                            <span className="text-white">하나님의 은혜</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
                            지난 예배와 설교 말씀을 영상으로 다시 확인하세요.<br />
                            말씀을 통해 삶의 지혜와 위로를 얻으시길 바랍니다.
                        </p>
                    </div>

                    {/* Featured Video (Latest) */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-red-900/10 border border-white/10 group">
                        <iframe
                            src={`https://www.youtube.com/embed/${VIDEOS[0].id}?autoplay=0&rel=0`}
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            {/* Video Grid */}
            <section className="px-6 py-12 md:py-20 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-black">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-white/90">
                        <span className="w-1 h-8 bg-red-600 rounded-full inline-block"></span>
                        최신 설교 목록
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {VIDEOS.map((video, idx) => (
                            <div key={video.id} className="group cursor-pointer">
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-red-900/20">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                    {/* Overlay for hover effect */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg leading-snug text-gray-200 group-hover:text-red-500 transition-colors font-serif">
                                        {video.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                        {idx === 0 ? '최신 영상' : '지난 예배'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shared Footer */}
            <div className="bg-white text-black">
                <SharedFooterWidgets sermonDates={sermonDates} />
            </div>
        </main>
    );
}
