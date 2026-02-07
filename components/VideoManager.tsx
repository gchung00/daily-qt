'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Plus, ExternalLink } from 'lucide-react';

export function VideoManager() {
    const [videos, setVideos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/videos');
            if (res.ok) {
                const data = await res.json();
                setVideos(data);
            }
        } catch (error) {
            console.error('Failed to load videos', error);
        } finally {
            setLoading(false);
        }
    };

    const extractVideoId = (url: string) => {
        // Handle various YouTube URL formats
        // https://www.youtube.com/watch?v=ID
        // https://youtu.be/ID
        // https://www.youtube.com/embed/ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleAdd = async () => {
        const id = extractVideoId(newUrl);
        if (!id) {
            alert('올바른 유튜브 주소가 아닙니다.');
            return;
        }

        if (videos.includes(id)) {
            alert('이미 등록된 영상입니다.');
            return;
        }

        const updated = [...videos, id];
        await saveVideos(updated);
        setNewUrl('');
    };

    const handleDelete = async (idOfVideoToDelete: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        const updated = videos.filter(id => id !== idOfVideoToDelete);
        await saveVideos(updated);
    };

    const saveVideos = async (updatedVideos: string[]) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedVideos),
            });
            if (res.ok) {
                setVideos(updatedVideos);
            } else {
                alert('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="유튜브 링크 붙여넣기 (예: https://youtu.be/...)"
                    className="flex-1 p-2 border rounded-lg text-sm"
                />
                <button
                    onClick={handleAdd}
                    disabled={isSaving || !newUrl}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary/80 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    추가
                </button>
            </div>

            <div className="grid gap-3">
                {videos.map((id) => (
                    <div key={id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 group">
                        <div className="w-24 aspect-video bg-gray-200 rounded overflow-hidden shrink-0 relative">
                            <img
                                src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <a
                                href={`https://www.youtube.com/watch?v=${id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium hover:text-primary truncate flex items-center gap-1"
                            >
                                {`https://youtu.be/${id}`}
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        </div>
                        <button
                            onClick={() => handleDelete(id)}
                            disabled={isSaving}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {videos.length === 0 && (
                    <p className="text-center text-muted text-sm py-4">등록된 영상이 없습니다.</p>
                )}
            </div>

            <p className="text-xs text-muted text-center">
                * 프로필 페이지 하단에 랜덤으로 이 중 하나가 표시됩니다.
            </p>
        </div>
    );
}
