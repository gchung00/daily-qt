import SermonFilterView from '@/components/SermonFilterView';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SermonsListPage() {
    // No server-side fetching here. Client component handles it on demand.

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="pt-20 pb-12 px-6 border-b border-card-border/60 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-primary/80 hover:text-primary font-bold transition-colors text-sm uppercase tracking-wider group">
                            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Main Page
                        </Link>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-2">성경별 말씀 찾기</h1>
                    <p className="text-muted text-lg">성경 66권 순서대로 정리된 설교 아카이브입니다.</p>
                </div>
            </section>

            {/* Filterable List View */}
            <SermonFilterView />
        </main>
    );
}
