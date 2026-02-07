import { ParsedSermon, SermonSection } from '@/lib/parser';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SermonViewProps {
    sermon: ParsedSermon;
    className?: string;
}

export function SermonView({ sermon, className }: SermonViewProps) {
    return (
        <div className={twMerge("max-w-4xl mx-auto space-y-10 py-10", className)}>
            {sermon.sections.map((section, idx) => (
                <SermonSectionComponent key={idx} section={section} />
            ))}
        </div>
    );
}

function SermonSectionComponent({ section }: { section: SermonSection }) {
    switch (section.type) {
        case 'header':
            return (
                <div className="text-center mb-16 pt-8 border-b border-primary/10 pb-8">

                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight serif-emphasis">{section.content}</h1>
                    <p className="text-muted text-xl font-medium italic serif-emphasis">"오늘의 고백과 찬양으로 주님 앞에 나아갑니다"</p>
                </div>
            );

        case 'hymn':
            return (
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-serif text-3xl text-primary font-bold opacity-30">I</span>
                        <h3 className="text-2xl font-bold text-foreground">찬송가</h3>
                        <span className="text-xs text-primary uppercase tracking-widest font-bold mt-1 bg-white/40 px-2 py-0.5 rounded-sm">Hymn</span>
                    </div>

                    <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(section.content)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <div className="bg-white/80 p-6 sm:p-8 rounded-sm border-l-2 border-primary/60 hover:border-primary transition-all shadow-sm hover:shadow-glow flex items-start gap-6 group cursor-pointer backdrop-blur-sm">
                            <div className="mt-1 w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="font-serif font-bold text-xl">♪</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{section.content}</p>
                                <p className="text-sm text-muted tracking-wide font-medium">누르면 유튜브에서 듣기</p>
                            </div>
                        </div>
                    </a>
                </div>
            );

        case 'prayer_title':
            return (
                <div className="mt-16 mb-6">
                    <h3 className="text-xl font-bold text-primary flex gap-3">
                        <span className="w-0.5 shrink-0 rounded-full bg-[#f37021]/60"></span>
                        <span className="py-1">{section.content}</span>
                    </h3>
                </div>
            );

        case 'prayer_item':
            return (
                <div className="flex gap-4 mb-4 pl-4 group">
                    <span className="font-bold text-primary/60 text-lg w-6 shrink-0 text-right group-hover:text-primary transition-colors font-serif">{section.number}.</span>
                    <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                        {section.content}
                    </p>
                </div>
            );

        case 'scripture_main':
            return (
                <div className="my-20 bg-white/60 p-10 rounded-sm relative text-center border-t-2 border-primary/40 shadow-sm backdrop-blur-sm">
                    <span className="text-6xl text-primary/10 font-serif absolute top-4 left-6">“</span>
                    <div className="relative z-10">
                        <p className="font-medium text-2xl sm:text-3xl leading-relaxed text-foreground mb-8 text-pretty serif-emphasis">
                            {section.text}
                        </p>
                        <div className="inline-block border-t border-primary/20 pt-4">
                            <p className="font-bold text-primary tracking-widest uppercase text-sm">{section.reference}</p>
                        </div>
                    </div>
                    <span className="text-6xl text-primary/10 font-serif absolute bottom-[-20px] right-6">”</span>
                </div>
            );

        case 'greeting':
            return (
                <div className="my-16 text-center max-w-2xl mx-auto">
                    <p className="text-xl text-muted font-medium leading-loose">
                        {section.content}
                    </p>
                    <div className="w-8 h-0.5 bg-primary/30 mx-auto mt-6"></div>
                </div>
            );

        case 'point_title':
            return (
                <h2 className="text-3xl font-bold text-foreground mt-20 mb-8 flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-primary text-base font-bold">{section.number}</span>
                    {section.content}
                </h2>
            );

        case 'scripture_quote':
            return (
                <div className="my-8 pl-6 border-l-2 border-primary/40 bg-white/40 py-4 pr-4 rounded-r-sm">
                    <p className="text-lg text-foreground/80 italic serif-emphasis leading-relaxed mb-2">"{section.content}"</p>
                    <span className="text-xs font-bold text-primary uppercase tracking-wide block text-right">{section.reference}</span>
                </div>
            );

        case 'benediction':
            return (
                <div className="mt-24 p-12 text-center border-y border-primary/10 bg-white/30 backdrop-blur-sm">
                    <p className="serif-emphasis text-2xl font-bold text-primary leading-relaxed">{section.content}</p>
                </div>
            );

        case 'text':
        default:
            if (section.content === '신앙고백') {
                return (
                    <div className="flex items-center gap-4 mb-6 mt-12">
                        <span className="font-serif text-3xl text-primary font-bold opacity-30">0</span>
                        <h3 className="text-2xl font-bold text-foreground">{section.content}</h3>
                        <span className="text-xs text-primary uppercase tracking-widest font-bold mt-0.5">Confession</span>
                    </div>
                );
            }
            if (section.content.startsWith('전능하사')) {
                return (
                    <div className="bg-white/60 p-8 rounded-sm mb-16 shadow-sm border border-secondary/50 backdrop-blur-sm">
                        <p className="text-lg text-foreground/90 leading-9 text-justify font-medium">
                            {section.content}
                        </p>
                    </div>
                );
            }
            return <p className="leading-8 mb-6 text-foreground/80 text-lg font-medium">{section.content}</p>;
    }
}
