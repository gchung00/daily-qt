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
        <div className="w-full text-foreground/80">
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={viewMode === 'month' ? prevMonth : prevYearPage}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-5 h-5 pointer-events-none stroke-1" />
                </button>

                <h2
                    onClick={handleHeaderClick}
                    className="font-normal text-2xl tracking-tight cursor-pointer hover:text-[#a84435] transition-colors select-none font-serif text-gray-900"
                >
                    {viewMode === 'month'
                        ? format(currentMonth, 'yyyy년 M월', { locale: ko })
                        : `${yearRangeStart} - ${yearRangeStart + 11}`
                    }
                </h2>

                <button
                    onClick={viewMode === 'month' ? nextMonth : nextYearPage}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                    aria-label="Next"
                >
                    <ChevronRight className="w-5 h-5 pointer-events-none stroke-1" />
                </button>
            </div>

            {viewMode === 'month' ? (
                <div className="border-y border-[#eae2d6] transition-all">
                    <div className="grid grid-cols-7 border-b border-[#eae2d6]">
                        {weekDays.map(day => (
                            <div key={day} className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] py-4 text-center">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {days.map((day, idx) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const hasSermon = sermonDates.includes(dateStr);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            const isFirstInRow = idx % 7 === 0;
                            const isLastInRow = idx % 7 === 6;

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => {
                                        if (hasSermon) onDateSelect(day);
                                    }}
                                    className={clsx(
                                        "h-12 w-full flex flex-col items-center justify-center text-xs transition-all relative border-[#eae2d6]",
                                        !isLastInRow && "border-r",
                                        idx < days.length - 7 && "border-b",
                                        !isCurrentMonth && "bg-transparent text-gray-200",
                                        isCurrentMonth && !hasSermon && "text-gray-400",
                                        hasSermon && isCurrentMonth && "text-gray-900 hover:bg-black/5 cursor-pointer",
                                        isSelected && "!text-[#a84435] font-bold z-10",
                                        isToday && !isSelected && "after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:rounded-full after:bg-gray-200"
                                    )}
                                >
                                    <span className={clsx(
                                        "text-sm",
                                        hasSermon && "relative"
                                    )}>
                                        {format(day, 'd')}
                                        {hasSermon && !isSelected && (
                                            <span className="absolute -top-1 -right-1.5 w-1 h-1 rounded-full bg-[#a84435]"></span>
                                        )}
                                        {hasSermon && isSelected && (
                                            <span className="absolute -top-1 -right-1.5 w-1 h-1 rounded-full bg-[#a84435] shadow-[0_0_4px_rgba(168,68,53,0.5)]"></span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-0 border-y border-primary/20">
                    {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map(year => {
                        const hasSermonInYear = sermonDates.some(d => d.startsWith(`${year}-`));
                        const isCurrentYear = year === currentMonth.getFullYear();
                        const isActualCurrentYear = year === new Date().getFullYear();

                        return (
                            <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={clsx(
                                    "h-24 flex items-center justify-center text-xl font-normal transition-all relative hover:bg-primary/[0.03]",
                                    isCurrentYear && "bg-primary text-white",
                                    !isCurrentYear && "text-foreground/60",
                                    hasSermonInYear && !isCurrentYear && "text-primary font-medium"
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
