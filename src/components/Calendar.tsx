import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarGrid } from './calendar/CalendarGrid';
import { EventDialog } from './EventDialog';
import { EventList } from './EventList';
import { getMonthDays, formatDate, getStoredEvents } from '@/lib/calendar';
import { DayEvents } from '@/types/calendar';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<DayEvents>(getStoredEvents());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventList, setShowEventList] = useState(false);

  const days = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = formatDate(date);
    if (events[dateStr]?.length) {
      setShowEventList(true);
    } else {
      setShowEventDialog(true);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="p-4 md:p-6">
        <CalendarHeader
          currentMonth={MONTHS[currentDate.getMonth()]}
          currentYear={currentDate.getFullYear()}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        <CalendarGrid
          days={days}
          currentMonth={currentDate.getMonth()}
          selectedDate={selectedDate}
          events={events}
          onDayClick={handleDayClick}
        />
      </Card>

      {selectedDate && (
        <>
          <EventDialog
            date={selectedDate}
            events={events}
            setEvents={setEvents}
            open={showEventDialog}
            onOpenChange={setShowEventDialog}
          />
          <EventList
            date={selectedDate}
            events={events}
            setEvents={setEvents}
            open={showEventList}
            onOpenChange={setShowEventList}
            onAddEvent={() => setShowEventDialog(true)}
          />
        </>
      )}
    </div>
  );
}