import { Play } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import { getSermonDates } from '@/lib/sermons';

export const dynamic = 'force-dynamic';

const VIDEOS = [
    { id: "cZW3Ouwywag", title: "주일 예배 1" },
    { id: "XhuMt6HlKG4", title: "주일 예배 2" },
    { id: "eASV6ZAv11I", title: "수요 예배" },
    { id: "JMkW4jkQ1NY", title: "특별 집회" },
    { id: "8L6RA87Rmdk", title: "찬양 집회" },
    { id: "2LRL6ZKxNjA", title: "은혜의 시간" },
    { id: "k8qwRIDanTs", title: "말씀 묵상" }
];

export default async function YoutubePage() {
    const sermonDates = await getSermonDates();

    return (
        <main className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600 selection:text-white pb-0">
            {/* Header */}
            <header className="fixed top-0 w-full z-40 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                    <h1 className="text-2xl font-bold font-serif text-white tracking-wider">
                        Sermon<span className="text-red-600">Tube</span>
                    </h1>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                            영상으로 만나는<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                하나님의 은혜
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            지난 예배와 설교 말씀을 영상으로 다시 확인하세요.
                        </p>
                    </div>

                    {/* Featured Video (Latest) */}
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
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
            <section className="px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Play className="w-5 h-5 text-red-600 fill-current" />
                        최신 설교 영상
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {VIDEOS.map((video, idx) => (
                            <div key={video.id} className="group cursor-pointer">
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10 shadow-lg">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                                <h4 className="font-bold text-lg leading-snug group-hover:text-red-500 transition-colors">
                                    {video.title} {idx + 1}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    조회수 1.2천회 • 2일 전
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shared Footer (Note: Passing sermonDates for calendar) */}
            <div className="bg-white text-black">
                <SharedFooterWidgets sermonDates={sermonDates} />
            </div>
        </main>
    );
}
