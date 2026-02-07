import { getSermonDates, getLatestSermon } from '@/lib/sermons';
import Link from 'next/link';
import { SermonView } from '@/components/SermonView';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import TimeHeader from '@/components/TimeHeader';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const sermonDates = await getSermonDates();
  const latestSermon = await getLatestSermon();

  return (
    <main className="min-h-screen font-sans selection:bg-accent selection:text-white pb-0">
      <TimeHeader />

      {/* 1. MAIN CONTENT: LATEST SERMON */}
      {/* Increased spacing and slightly darker background */}
      <section className="py-12 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* Lighter Content Wrapper - #F5F4F1 */}
          <div className="bg-[#F5F4F1] rounded-[2.5rem] shadow-sm border border-card-border/60 p-4 sm:p-8">
            {latestSermon ? (
              <SermonView sermon={latestSermon} />
            ) : (
              <div className="p-12 text-center text-muted">
                <p>등록된 설교가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SHARED WIDGETS (Calendar + Profile) */}
      <SharedFooterWidgets sermonDates={sermonDates} />

    </main>
  );
}

