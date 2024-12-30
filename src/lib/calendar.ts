import { DayEvents, Event } from '@/types/calendar';

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add previous month's days to fill the first week
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Add current month's days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add next month's days to complete the last week
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameMonth(date: Date, month: number): boolean {
  return date.getMonth() === month;
}

export function getStoredEvents(): DayEvents {
  const events = localStorage.getItem('calendar-events');
  return events ? JSON.parse(events) : {};
}

export function storeEvents(events: DayEvents): void {
  localStorage.setItem('calendar-events', JSON.stringify(events));
}

export function hasEventOverlap(
  events: Event[],
  newEvent: Omit<Event, 'id'>,
  excludeId?: string
): boolean {
  const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
  const newEnd = new Date(`${newEvent.date}T${newEvent.endTime}`);

  return events.some((event) => {
    if (event.id === excludeId) return false;

    const existingStart = new Date(`${event.date}T${event.startTime}`);
    const existingEnd = new Date(`${event.date}T${event.endTime}`);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}

export function exportEvents(events: DayEvents): void {
  const jsonString = JSON.stringify(events, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'calendar-events.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}