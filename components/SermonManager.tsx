'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Edit, Calendar } from 'lucide-react';

interface SermonManagerProps {
    onEdit: (date: string, text: string) => void;
    refreshTrigger: number;
}

export function SermonManager({ onEdit, refreshTrigger }: SermonManagerProps) {
    const [sermons, setSermons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSermons();
    }, [refreshTrigger]);

    const fetchSermons = async () => {
        try {
            const res = await fetch('/api/sermons');
            if (res.ok) {
                const dates = await res.json();
                setSermons(dates);
            }
        } catch (error) {
            console.error('Failed to list sermons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (date: string) => {
        try {
            const res = await fetch(`/api/sermons?date=${date}`);
            if (res.ok) {
                const { text } = await res.json();
                onEdit(date, text);
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            alert('설교를 불러오는데 실패했습니다.');
        }
    };

    const handleDelete = async (date: string) => {
        if (!confirm(`'${date}' 설교를 정말 삭제하시겠습니까? 복구할 수 없습니다.`)) return;

        try {
            const res = await fetch(`/api/sermons?date=${date}`, { method: 'DELETE' });
            if (res.ok) {
                alert('삭제되었습니다.');
                fetchSermons();
            } else {
                alert('삭제 실패했습니다.');
            }
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div className="text-center py-4 text-muted"><Loader2 className="animate-spin inline mr-2" />불러오는 중...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermons.map((date) => (
                <div key={date} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <span className="font-bold font-mono text-lg text-foreground">{date}</span>
                    </div>
                    <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleEdit(date)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="수정"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(date)}
                            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                            title="삭제"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
            {sermons.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted bg-gray-50 rounded-lg">
                    등록된 설교가 없습니다.
                </div>
            )}
        </div>
    );
}
