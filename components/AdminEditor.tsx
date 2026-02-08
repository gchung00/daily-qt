'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ParsedSermon, parseSermon } from '@/lib/parser';
import { Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';

interface AdminEditorProps {
    initialText?: string;
    initialDate?: string;
}

export default function AdminEditor({ initialText = '', initialDate = '' }: AdminEditorProps) {
    const router = useRouter();
    const [text, setText] = useState(initialText);
    const [selectedDate, setSelectedDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
    const [parsed, setParsed] = useState<ParsedSermon | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    useEffect(() => {
        const result = parseSermon(text);
        // If parsed result has a date, use it if not manually overridden?
        // Actually, we want the date picker to be the source of truth for saving.
        // But if text contains a date, maybe suggest it?
        // For now, keep simple. User picks date.

        // If the PARSER finds a date, we might want to update selectedDate IF user hasn't touched it?
        // But that's complex. Let's just parse for preview.
        if (result.date && !initialDate && text !== initialText) {
            // Optional: could auto-set date here
            // setSelectedDate(result.date); 
        }

        setParsed(result);
    }, [text, initialDate, initialText]);

    const handleSave = async (force: boolean = false) => {
        try {
            setSaveStatus('saving');
            setIsLoading(true);

            console.log("Sending save request:", { date: selectedDate, textLength: text.length });

            const response = await fetch('/api/sermons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    date: selectedDate, // Use the picker date as source of truth
                    force
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 409) {
                    // Conflict
                    if (confirm("이미 해당 날짜에 설교가 있습니다. 덮어쓰시겠습니까?")) {
                        await handleSave(true);
                        return;
                    } else {
                        throw new Error("저장이 취소되었습니다.");
                    }
                }

                throw new Error(errorData.message || errorData.error || 'Failed to save');
            }

            const successData = await response.json();

            // Show success message with confirmation of what happened
            alert(successData.message || `저장되었습니다! (${selectedDate})`);

            setSaveStatus('success');
            router.refresh();
            router.push('/'); // Go to home to see the new sermon
        } catch (error: any) {
            console.error('Save failed:', error);
            setSaveStatus('error');
            alert(`저장 실패: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
            {/* Editor Sided */}
            <div className="flex flex-col gap-4 h-full">
                <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">설교 날짜</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isLoading || !text.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg h-[42px] mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                저장 중...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                설교 저장
                            </>
                        )}
                    </button>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="설교 본문을 여기에 붙여넣으세요..."
                    className="flex-1 w-full p-6 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-sans text-base leading-relaxed"
                />
            </div>

            {/* Preview Side */}
            <div className="h-full overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 shadow-inner p-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">미리보기 (Preview)</h3>

                {parsed?.title ? (
                    <article className="prose prose-stone max-w-none">
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
                                {selectedDate} 주일 낮 예배
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{parsed.title}</h1>
                            {/* We don't have parsing logic for scripture ref in header specifically efficiently yet in preview 
                                but sections will show it.
                            */}
                        </div>

                        <div className="space-y-6">
                            {parsed.sections.map((section, idx) => {
                                switch (section.type) {
                                    case 'header':
                                        return null; // Already shown in title area
                                    case 'scripture_main':
                                        return (
                                            <div key={idx} className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm my-8">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-bold text-primary flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                        하나님 말씀
                                                    </span>
                                                    <span className="text-sm font-serif font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        {section.reference}
                                                    </span>
                                                </div>
                                                <p className="text-lg leading-relaxed font-serif text-gray-800 whitespace-pre-line">
                                                    {section.text || '(본문 없음)'}
                                                </p>
                                            </div>
                                        );
                                    case 'point_title':
                                        return (
                                            <h3 key={idx} className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-baseline gap-2">
                                                <span className="text-primary font-black text-2xl">{section.number}.</span>
                                                {section.content}
                                            </h3>
                                        );
                                    case 'text':
                                        return (
                                            <p key={idx} className="text-lg leading-8 text-gray-700 font-serif mb-4 whitespace-pre-line">
                                                {section.content}
                                            </p>
                                        );
                                    case 'scripture_quote':
                                        return (
                                            <div key={idx} className="my-6 pl-6 border-l-2 border-gray-300">
                                                <div className="text-sm font-bold text-gray-500 mb-1">{section.reference}</div>
                                                <p className="text-gray-600 italic font-serif">{section.content}</p>
                                            </div>
                                        );
                                    default:
                                        return (
                                            <div key={idx} className="text-gray-500 text-sm">
                                                {/* Fallback for other types in preview */}
                                                {JSON.stringify(section)}
                                            </div>
                                        );
                                }
                            })}
                        </div>
                    </article>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p>왼쪽에 설교 내용을 입력하면</p>
                        <p>여기에 미리보기가 나타납니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
