'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { SermonManager } from '@/components/SermonManager';
import { AdminEditor } from '@/components/AdminEditor'; // Reuse editor for modal? Or just redirect?
// Actually simpler to just have SermonManager and if edit is clicked, we might need a modal or state here.
// But wait, the user said "whole new page".
// Let's keep it simple: SermonManager lists them.
// If you click Edit in SermonManager, it should probably show the editor HERE on this page.

export default function ManageSermonsPage() {
    const router = useRouter();
    const [unlocked, setUnlocked] = useState(false);
    const [pin, setPin] = useState('');

    // Edit State
    const [editingSermon, setEditingSermon] = useState<{ date: string, text: string } | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const checkPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '069191') {
            setUnlocked(true);
        } else {
            alert('비밀번호가 틀립니다.');
            setPin('');
        }
    };

    const handleEdit = (date: string, text: string) => {
        setEditingSermon({ date, text });
    };

    const handleSaveComplete = () => {
        setRefreshTrigger(prev => prev + 1);
        setEditingSermon(null);
        alert('수정되었습니다.');
    };

    if (!unlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">관리자 보안 확인</h1>
                    <p className="text-muted mb-6">설교 수정/삭제를 위해 2차 비밀번호를 입력하세요.</p>

                    <form onSubmit={checkPin} className="space-y-4">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full text-center text-2xl tracking-widest p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="******"
                            maxLength={6}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            확인
                        </button>
                    </form>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-sm text-muted hover:text-foreground"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        관리자 홈으로
                    </button>
                    <h1 className="text-2xl font-bold">설교 수정 및 삭제</h1>
                </header>

                {editingSermon ? (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">설교 수정 중: {editingSermon.date}</h2>
                            <button
                                onClick={() => setEditingSermon(null)}
                                className="text-sm text-muted hover:text-red-500"
                            >
                                취소
                            </button>
                        </div>
                        <AdminEditor
                            initialText={editingSermon.text}
                            initialDate={editingSermon.date}
                            onSave={handleSaveComplete}
                        />
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <SermonManager onEdit={handleEdit} refreshTrigger={refreshTrigger} />
                    </div>
                )}
            </div>
        </div>
    );
}
