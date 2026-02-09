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
            {/* 1. MAIN CONTENT (Wrapped for Lighter Background) */}
            <section className="pt-20 pb-12 px-4 md:px-12 relative">
                <div className="max-w-5xl mx-auto">


                    {/* Lighter Content Wrapper - #F5F4F1 (Only on SM up) */}
                    <div className="sm:bg-[#F5F4F1] sm:rounded-[2rem] sm:shadow-sm sm:border sm:border-card-border/60 py-6 sm:p-10">
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
