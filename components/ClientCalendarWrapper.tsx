"use client";

import { CalendarWidget } from './CalendarWidget';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function ClientCalendarWrapper({ sermonDates }: { sermonDates: string[] }) {
    const router = useRouter();

    return (
        <CalendarWidget
            sermonDates={sermonDates}
            selectedDate={null}
            onDateSelect={(date) => {
                router.push(`/sermon/${format(date, 'yyyy-MM-dd')}`);
            }}
        />
    );
}
