import { getSermonDates, getLatestSermon } from '@/lib/sermons';
import Link from 'next/link';
import { SermonView } from '@/components/SermonView';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
// Force dynamic rendering since we read from file system
export const dynamic = 'force-dynamic';

export default async function Home() {
  const sermonDates = await getSermonDates();
  const latestSermon = await getLatestSermon();

  return (
    <main className="min-h-screen font-sans selection:bg-accent selection:text-white pb-0 bg-white sm:bg-background">

      {/* 1. MAIN CONTENT: LATEST SERMON */}
      {/* Increased spacing and slightly darker background */}
      <section className="pt-20 pb-12 px-4 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* Elegant Content Wrapper - Subtle Hairline & Soft Shadow */}
          <div className="sm:bg-white/[0.6] sm:backdrop-blur-sm sm:rounded-[3.5rem] sm:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.03)] sm:hairline py-6 sm:p-12">
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
