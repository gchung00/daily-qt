import { ParsedSermon, SermonSection } from '@/lib/parser';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SermonViewProps {
    sermon: ParsedSermon;
    className?: string;
}

export function SermonView({ sermon, className }: SermonViewProps) {
    const isSunday = sermon.date ? new Date(sermon.date).getDay() === 0 : false;

    return (
        <div className={twMerge("max-w-4xl mx-auto space-y-0 py-10 px-4 sm:px-0", className)}>
            {sermon.sections.map((section, idx) => (
                <SermonSectionComponent
                    key={idx}
                    section={section}
                    isSunday={isSunday}
                    isFirst={idx === 0}
                    isLast={idx === sermon.sections.length - 1}
                    prevType={idx > 0 ? sermon.sections[idx - 1].type : undefined}
                />
            ))}
        </div>
    );
}

function SermonSectionComponent({
    section,
    isSunday,
    isFirst,
    isLast,
    prevType
}: {
    section: SermonSection,
    isSunday?: boolean,
    isFirst: boolean,
    isLast: boolean,
    prevType?: string
}) {
    // Helper to determine if we should skip the top divider to avoid double lines or excessive gaps
    const isSequentialContent = (prevType === 'scripture_main' && section.type === 'scripture_main') ||
        (prevType === 'scripture_quote' && section.type === 'scripture_quote') ||
        (prevType === 'hymn' && section.type === 'hymn');

    const needsDivider = !isFirst && !isSequentialContent && section.type !== 'header';

    switch (section.type) {
        case 'header':
            return (
                <div className={clsx(
                    "text-center mb-12 pt-8 pb-8",
                    isSunday ? "space-y-6" : "hairline-b"
                )}>
                    <h1 className={clsx(
                        "font-normal tracking-tight text-foreground leading-tight serif-emphasis",
                        isSunday ? "text-5xl sm:text-7xl mb-2" : "text-5xl sm:text-6xl mb-6"
                    )}>
                        {section.content}
                    </h1>
                    <p className="text-muted/30 text-[10px] tracking-[0.5em] uppercase font-light">The Daily Devotion</p>
                </div>
            );

        case 'hymn':
            return (
                <div className="py-8">
                    {needsDivider && <div className="hairline-t mb-12 opacity-30" />}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-serif text-3xl text-primary font-normal opacity-30 italic">I</span>
                        <h3 className="text-2xl font-normal text-foreground serif-emphasis">찬송가</h3>
                        <span className="text-[10px] text-primary/60 uppercase tracking-[0.3em] font-light mt-1">Hymn</span>
                    </div>

                    <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(section.content)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                    >
                        <div className="py-8 px-6 sm:px-10 rounded-[2rem] hairline bg-primary/[0.01] group-hover:bg-primary/[0.04] transition-all duration-300 flex items-center justify-between cursor-pointer border-transparent group-hover:border-primary/10">
                            <div className="flex items-center gap-8">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm hairline flex items-center justify-center text-primary/60 group-hover:scale-110 group-hover:text-primary transition-all">
                                    <span className="font-serif font-light text-2xl">♪</span>
                                </div>
                                <div>
                                    <p className="font-normal text-xl text-foreground group-hover:text-primary transition-colors serif-emphasis">{section.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <p className="text-[10px] text-primary font-medium tracking-[0.2em] uppercase">Listen on YouTube</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full hairline flex items-center justify-center text-primary/20 group-hover:text-primary group-hover:bg-white transition-all">
                                <span className="text-xl">→</span>
                            </div>
                        </div>
                    </a>
                </div>
            );

        case 'prayer_title':
            return (
                <div className="mt-16 mb-6">
                    <h3 className="text-xl font-normal text-primary flex gap-3 serif-emphasis">
                        <span className="w-px shrink-0 bg-[#f37021]/60"></span>
                        <span className="py-1">{section.content}</span>
                    </h3>
                </div>
            );

        case 'prayer_item':
            return (
                <div className="flex gap-4 mb-4 pl-4 group">
                    <span className="font-normal text-primary/40 text-lg w-6 shrink-0 text-right group-hover:text-primary transition-colors font-serif">{section.number}.</span>
                    <p className="text-lg text-foreground/80 leading-relaxed font-normal">
                        {section.content}
                    </p>
                </div>
            );

        case 'scripture_main':
            return (
                <div className="py-4">
                    {needsDivider && <div className="hairline-t opacity-30" />}
                    <div className={clsx(
                        "my-8 sm:my-12 py-12 px-8 sm:px-12 relative text-center",
                        isSunday ? "bg-[#f37021]/5 sm:rounded-[3.5rem] shadow-sm hairline" : ""
                    )}>
                        {/* Decorative element for Sunday */}
                        {isSunday && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full mt-6"></div>}

                        <div className="max-w-3xl mx-auto relative z-10">
                            <p className={clsx(
                                "font-normal leading-relaxed text-foreground mb-12 text-pretty serif-emphasis",
                                isSunday ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
                            )}>
                                {section.text}
                            </p>
                            <div className={clsx(
                                "inline-block border-t pt-6",
                                isSunday ? "border-primary/30" : "border-primary/10"
                            )}>
                                <p className={clsx(
                                    "font-medium tracking-[0.5em] uppercase",
                                    isSunday ? "text-primary text-sm" : "text-primary/60 text-[10px]"
                                )}>
                                    {section.reference}
                                </p>
                            </div>
                        </div>
                    </div>
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
                <h2 className="text-3xl font-normal text-foreground mt-20 mb-8 flex items-center gap-4 serif-emphasis">
                    <span className="text-primary/40 text-2xl font-light">{section.number}.</span>
                    {section.content}
                </h2>
            );

        case 'scripture_quote':
            return (
                <div className="py-4">
                    {needsDivider && <div className="hairline-t opacity-30" />}
                    <div className="my-8 py-8 text-center italic">
                        <p className="text-xl text-foreground/70 serif-emphasis leading-loose mb-4 font-normal max-w-2xl mx-auto px-6">"{section.content}"</p>
                        <span className="text-xs font-normal text-primary/40 uppercase tracking-[0.4em]">{section.reference}</span>
                    </div>
                </div>
            );

        case 'benediction':
            return (
                <div className="mt-28 py-16 text-center hairline-t hairline-b">
                    <p className="serif-emphasis text-2xl font-normal text-primary/80 leading-relaxed italic">{section.content}</p>
                </div>
            );

        case 'text':
        default:
            if (section.content === '신앙고백') {
                return (
                    <div className="flex items-center gap-4 mb-6 mt-12">
                        <span className="font-serif text-3xl text-primary font-normal opacity-30">0</span>
                        <h3 className="text-2xl font-normal text-foreground serif-emphasis">{section.content}</h3>
                        <span className="text-[10px] text-primary/60 uppercase tracking-[0.3em] font-normal mt-0.5">Confession</span>
                    </div>
                );
            }
            if (section.content.startsWith('전능하사')) {
                return (
                    <div className="py-12 hairline-t hairline-b mb-16 text-center italic">
                        <p className="text-lg text-foreground/70 leading-relaxed font-normal max-w-2xl mx-auto">
                            {section.content}
                        </p>
                    </div>
                );
            }
            return <p className="leading-8 mb-6 text-foreground/80 text-lg font-normal">{section.content}</p>;
    }
}
