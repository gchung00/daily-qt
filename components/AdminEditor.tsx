"use client";

import { useState, useEffect } from "react";
import { parseSermon, ParsedSermon } from "@/lib/parser";
import { SermonView } from "./SermonView";
import { format } from "date-fns";
import { Loader2, Save } from "lucide-react";

interface AdminEditorProps {
    onSave: () => void;
    initialText?: string;
    initialDate?: string;
}

export function AdminEditor({ onSave, initialText = "", initialDate = format(new Date(), 'yyyy-MM-dd') }: AdminEditorProps) {
    const [rawText, setRawText] = useState(initialText);
    const [preview, setPreview] = useState<ParsedSermon | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    // Update state if props change (for editing)
    useEffect(() => {
        setRawText(initialText);
        if (initialDate) setSelectedDate(initialDate);
    }, [initialText, initialDate]);

    useEffect(() => {
        if (!rawText.trim()) {
            setPreview(null);
            return;
        }

        const parsed = parseSermon(rawText);
        setPreview(parsed);

        // Auto-detect date from content if possible
        if (parsed.date) {
            // Optional: update date if desired
        }
    }, [rawText]);

    const handleSave = async (forceOverwrite = false) => {
        if (!preview) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/sermons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: rawText,
                    date: selectedDate,
                    force: forceOverwrite
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    // Ask for confirmation to overwrite
                    if (confirm("이미 해당 날짜에 설교가 있습니다. 덮어쓰시겠습니까?")) {
                        await handleSave(true); // Retry with force
                        return; // Exit current execution
                    } else {
                        throw new Error("저장이 취소되었습니다.");
                    }
                }
                // Use specific message if available
                throw new Error(data.message || data.error || 'Failed to save');
            }

            alert('설교가 성공적으로 저장되었습니다!');
            onSave();
        } catch (error: any) {
            console.error('Save error:', error);
            if (error.message !== "저장이 취소되었습니다.") {
                alert(error.message || '저장 중 오류가 발생했습니다.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[60vh] min-h-[500px]">
            {/* Editor Side */}
            <div className="flex flex-col h-full gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">설교 작성 / 붙여넣기</h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="p-2 border rounded-lg text-sm bg-white"
                        />
                        <button
                            onClick={() => handleSave(false)}
                            disabled={!preview || isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    저장하기
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`여기에 설교 내용을 붙여넣으세요...\n\n예시:\n2026년 2월 8일 주일 예배\n찬송가...\n...\n`}
                    className="flex-1 w-full p-6 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none font-sans text-lg leading-relaxed shadow-sm"
                />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full overflow-y-auto hidden lg:block">
                <h3 className="text-sm font-bold text-muted mb-4 uppercase tracking-widest text-center">미리보기 화면</h3>
                {preview ? (
                    <div className="bg-white shadow rounded-lg p-2 origin-top scale-90">
                        <SermonView sermon={preview} />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted">
                        왼쪽에서 텍스트를 입력하고 '미리보기'를 클릭하세요.
                    </div>
                )}
            </div>
        </div>
    );
}
