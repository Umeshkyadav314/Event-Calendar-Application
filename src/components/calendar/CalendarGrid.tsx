import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate, isToday, isSameMonth } from '@/lib/calendar';
import { DayEvents } from '@/types/calendar';

interface CalendarGridProps {
  days: Date[];
  currentMonth: number;
  selectedDate: Date | null;
  events: DayEvents;
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function CalendarGrid({
  days,
  currentMonth,
  selectedDate,
  events,
  onDayClick,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Full weekday names on md+ screens */}
      <div className="hidden md:grid grid-cols-7 col-span-7">
        {WEEKDAYS.map((day) => (
          <div
            key={`full-${day}`}
            className="text-center font-medium py-2 text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Short weekday names on small screens */}
      <div className="grid grid-cols-7 col-span-7 md:hidden">
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={`short-${day}`}
            className="text-center font-medium py-2 text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {days.map((date, index) => {
        const dateStr = formatDate(date);
        const dayEvents = events[dateStr] || [];
        
        return (
          <Button
            key={`${dateStr}-${index}`}
            variant="ghost"
            className={cn(
              'h-16 md:h-24 p-1 md:p-2 flex flex-col items-start justify-start relative',
              !isSameMonth(date, currentMonth) && 'text-muted-foreground',
              isToday(date) && 'bg-primary/5',
              selectedDate && formatDate(selectedDate) === dateStr && 'ring-2 ring-primary'
            )}
            onClick={() => onDayClick(date)}
          >
            <span className="text-xs md:text-sm">{date.getDate()}</span>
            {dayEvents.length > 0 && (
              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}