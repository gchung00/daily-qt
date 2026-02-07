import { getSermon, getSermonDates } from '@/lib/sermons';
import { SermonView } from '@/components/SermonView';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';

export async function generateStaticParams() {
    const dates = await getSermonDates();
    return dates.map((date) => ({ date }));
}

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
        <main className="min-h-screen bg-background pb-0">
            {/* 1. MAIN CONTENT (Wrapped for Lighter Background) */}
            <section className="py-20 px-6 md:px-12 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 pl-4">
                        <Link href="/" className="inline-flex items-center text-primary/80 hover:text-primary font-bold transition-colors text-sm uppercase tracking-wider group">
                            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Main Page
                        </Link>
                    </div>

                    {/* Lighter Content Wrapper - #F5F4F1 */}
                    <div className="bg-[#F5F4F1] rounded-[2.5rem] shadow-sm border border-card-border/60 p-4 sm:p-8">
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
