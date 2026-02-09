"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminEditor from "@/components/AdminEditor";
import { VideoManager } from "@/components/VideoManager";
import { SermonManager } from "@/components/SermonManager";

export default function AdminPage() {
    const { isAdmin, loading, logout } = useAuth();
    const router = useRouter();

    const [editData, setEditData] = useState({ text: '', date: '' });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [showVideoManager, setShowVideoManager] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push("/login"); // Redirect unauthorized
        }
    }, [isAdmin, loading, router]);

    // AdminEditor now handles alert and redirect internally.
    // We just need to reset internal state if component unmounts or we want to clear editor?
    // Actually, since it redirects, we don't strictly need to handleSaveComplete here unless we want to stay on page.
    // For now, let's trust AdminEditor's internal behavior.

    const handleEditStart = (date: string, text: string) => {
        setEditData({ date, text });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to editor
    };

    if (loading || !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-secondary/5 px-6 pb-6 pt-24">
            <header className="flex justify-between items-center max-w-6xl mx-auto mb-10 bg-white p-6 rounded-lg shadow-sm border border-secondary/20">
                <h1 className="text-2xl font-serif font-bold text-foreground">설교 관리자 모드</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted">Administrator</span>
                    <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-bold">로그아웃</button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* 1. Main Focus: Editor */}
                <div className="bg-white rounded-lg shadow-lg border border-secondary/20 p-6">
                    <h2 className="text-xl font-bold mb-6">{editData.text ? '설교 수정' : '새 설교 등록'}</h2>
                    <AdminEditor
                        initialText={editData.text}
                        initialDate={editData.date || undefined}
                    />
                </div>

                {/* 2. Toggle Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/sermons')}
                        className="px-6 py-3 rounded-lg font-bold shadow-sm transition-all bg-white text-muted hover:text-foreground hover:bg-gray-50 border border-transparent hover:border-gray-200"
                    >
                        Edit/Delete 관리 (새창)
                    </button>

                    <button
                        onClick={() => setShowVideoManager(!showVideoManager)}
                        className={`px-6 py-3 rounded-lg font-bold shadow-sm transition-all ${showVideoManager ? 'bg-secondary text-secondary-foreground ring-2 ring-primary' : 'bg-white text-muted hover:text-foreground hover:bg-gray-50'}`}
                    >
                        {showVideoManager ? '추천 영상 관리 닫기' : '추천 영상 관리'}
                    </button>
                </div>

                {/* 3. Conditional Sections */}
                {showVideoManager && (
                    <div className="bg-white rounded-lg shadow-lg border border-secondary/20 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold mb-6">추천 설교 영상 관리</h2>
                        <VideoManager />
                    </div>
                )}
            </div>
        </main>
    );
}
