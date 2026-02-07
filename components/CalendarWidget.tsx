"use client";

import { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface CalendarWidgetProps {
    sermonDates: string[]; // 'YYYY-MM-DD'
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
}

export function CalendarWidget({ sermonDates, selectedDate, onDateSelect }: CalendarWidgetProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // Month Navigation
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Year Navigation (for Year View)
    const [yearRangeStart, setYearRangeStart] = useState(new Date().getFullYear() - 4); // Start centered/recent
    const prevYearPage = () => setYearRangeStart(yearRangeStart - 12);
    const nextYearPage = () => setYearRangeStart(yearRangeStart + 12);

    const handleHeaderClick = () => {
        if (viewMode === 'month') {
            setViewMode('year');
            setYearRangeStart(currentMonth.getFullYear() - 4); // Reset range to current
        } else {
            setViewMode('month');
        }
    };

    const handleYearSelect = (year: number) => {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(year);
        setCurrentMonth(newDate);
        setViewMode('month');
    };

    return (
        <div className="w-full text-white/90">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={viewMode === 'month' ? prevMonth : prevYearPage}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <h2
                    onClick={handleHeaderClick}
                    className="font-bold text-xl tracking-tight cursor-pointer hover:text-white transition-colors select-none"
                >
                    {viewMode === 'month'
                        ? format(currentMonth, 'yyyy년 M월', { locale: ko })
                        : `${yearRangeStart} - ${yearRangeStart + 11}`
                    }
                </h2>

                <button
                    onClick={viewMode === 'month' ? nextMonth : nextYearPage}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    aria-label="Next"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {viewMode === 'month' ? (
                <>
                    <div className="grid grid-cols-7 mb-4 text-center">
                        {weekDays.map(day => (
                            <div key={day} className="text-xs font-bold text-white/40 uppercase tracking-wider py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const hasSermon = sermonDates.includes(dateStr);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => {
                                        if (hasSermon) onDateSelect(day);
                                    }}
                                    // Disabled logic can remain visual only to maintain grid
                                    className={clsx(
                                        "h-10 w-10 flex flex-col items-center justify-center rounded-xl text-sm transition-all relative border border-transparent",
                                        !isCurrentMonth && "text-white/10",
                                        isCurrentMonth && !hasSermon && "text-white/60 hover:bg-white/5",
                                        hasSermon && isCurrentMonth && "font-bold text-white bg-indigo-950 hover:bg-orange-700 border-white/10 cursor-pointer shadow-sm",
                                        isSelected && "!bg-orange-600 !text-white shadow-glow", // Selected matches the warm hover tone or distinct? I'll make it orange-600 distinct.
                                        isToday && !isSelected && "!bg-white !text-indigo-950 font-serif font-bold shadow-md"
                                    )}
                                >
                                    <span>{format(day, 'd')}</span>
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-3 gap-4 py-2">
                    {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map(year => {
                        const hasSermonInYear = sermonDates.some(d => d.startsWith(`${year}-`));
                        const isCurrentYear = year === currentMonth.getFullYear();
                        const isActualCurrentYear = year === new Date().getFullYear();

                        return (
                            <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={clsx(
                                    "h-12 flex items-center justify-center rounded-xl text-lg font-bold transition-all relative",
                                    isCurrentYear && "bg-white/20 text-white shadow-sm",
                                    !isCurrentYear && "text-white/70 hover:bg-white/10 hover:text-white",
                                    hasSermonInYear && !isCurrentYear && "text-white ring-1 ring-white/20",
                                    isActualCurrentYear && !isCurrentYear && "bg-white !text-indigo-950 shadow-md" // Highlight actual current year if not selected
                                )}
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
