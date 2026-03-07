import { getSermon, getSermonDates } from '@/lib/sermons';
import { SermonView } from '@/components/SermonView';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import SharedFooterWidgets from '@/components/SharedFooterWidgets';

export const dynamic = 'force-dynamic';


type Props = {
    params: Promise<{ date: string }>;
};

export default async function SermonPage({ params }: Props) {
    const { date } = await params;
    const sermon = await getSermon(date);
    const sermonDates = await getSermonDates(); // Fetch dates for sidebar

    if (!sermon) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white sm:bg-background pb-0">
            {/* 1. MAIN CONTENT (Wrapped in Subtle Card for Consistency) */}
            <section className="pt-20 pb-12 px-4 md:px-12 relative">
                <div className="max-w-5xl mx-auto">
                    {/* Elegant Content Wrapper - Subtle Hairline & Soft Shadow */}
                    <div className="sm:bg-white/[0.6] sm:backdrop-blur-sm sm:rounded-[3.5rem] sm:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] sm:hairline py-6 sm:p-12">
                        <SermonView sermon={sermon} />
                    </div>
                </div>
            </section>

            {/* 2. SHARED WIDGETS (Persistence) */}
            <SharedFooterWidgets sermonDates={sermonDates} />

            <footer className="py-10 text-center text-muted text-sm border-t border-card-border bg-white">
                <p>말씀의 숲 — {sermon.title}</p>
            </footer>
        </main>
    );
}
