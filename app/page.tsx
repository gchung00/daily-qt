import { getSermonDates, getLatestSermon } from '@/lib/sermons';
import Link from 'next/link';
import { SermonView } from '@/components/SermonView';
import SharedFooterWidgets from '@/components/SharedFooterWidgets';
import TimeHeader from '@/components/TimeHeader';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const sermonDates = await getSermonDates();
  const latestSermon = await getLatestSermon();

  // Debugging Info (Only visible in dev or if needed, but we'll show it faintly for now)
  const debugInfo = {
    totalSermons: sermonDates.length,
    latestDate: latestSermon?.date || 'None',
    top5Dates: sermonDates.slice(0, 5),
    hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
  };

  return (
    <main className="min-h-screen font-sans selection:bg-accent selection:text-white pb-0 bg-white sm:bg-background">
      <TimeHeader />

      {/* 1. MAIN CONTENT: LATEST SERMON */}
      {/* Increased spacing and slightly darker background */}
      <section className="py-12 px-4 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* Lighter Content Wrapper - #F5F4F1 (Only on SM up) */}
          <div className="sm:bg-[#F5F4F1] sm:rounded-[2.5rem] sm:shadow-sm sm:border sm:border-card-border/60 py-6 sm:p-8">
            {latestSermon ? (
              <SermonView sermon={latestSermon} />
            ) : (
              <div className="p-12 text-center text-muted">
                <p>등록된 설교가 없습니다.</p>
                <div className="mt-4 text-xs text-gray-300 font-mono text-left">
                  Debug: {JSON.stringify(debugInfo, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SHARED WIDGETS (Calendar + Profile) */}
      <SharedFooterWidgets sermonDates={sermonDates} />

      {/* SYSTEM DIAGNOSTICS (Temporary) */}
      <div className="py-2 text-center text-[10px] text-gray-300 font-mono opacity-50 hover:opacity-100 transition-opacity">
        Status: {debugInfo.hasToken ? 'Blob Mode' : 'Local Mode'} |
        Total: {debugInfo.totalSermons} |
        Latests: {debugInfo.top5Dates.join(', ')}
      </div>

    </main>
  );
}
