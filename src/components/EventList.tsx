import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Trash2, Download } from 'lucide-react';
import { useState } from 'react';
import { formatDate, exportEvents, storeEvents } from '@/lib/calendar';
import { DayEvents, Event } from '@/types/calendar';
import { EventDialog } from './EventDialog';

interface EventListProps {
  date: Date;
  events: DayEvents;
  setEvents: (events: DayEvents) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: () => void;
}

export function EventList({
  date,
  events,
  setEvents,
  open,
  onOpenChange,
  onAddEvent,
}: EventListProps) {
  const [search, setSearch] = useState('');
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const dateStr = formatDate(date);
  const dayEvents = events[dateStr] || [];

  const filteredEvents = dayEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = { ...events };
    updatedEvents[dateStr] = dayEvents.filter(
      (event) => event.id !== eventId
    );
    if (updatedEvents[dateStr].length === 0) {
      delete updatedEvents[dateStr];
    }
    setEvents(updatedEvents);
    storeEvents(updatedEvents);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Events for {dateStr}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={onAddEvent} className="flex-1 md:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Button
                variant="outline"
                onClick={() => exportEvents(events)}
                className="flex-1 md:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] md:h-[400px] pr-4">
            {filteredEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No events found
              </p>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col md:flex-row md:items-start justify-between p-4 rounded-lg border gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.color === 'work'
                              ? 'bg-blue-500 dark:bg-blue-400'
                              : event.color === 'personal'
                              ? 'bg-green-500 dark:bg-green-400'
                              : 'bg-orange-500 dark:bg-orange-400'
                          }`}
                        />
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditEvent(event)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {editEvent && (
        <EventDialog
          date={date}
          events={events}
          setEvents={setEvents}
          open={!!editEvent}
          onOpenChange={() => setEditEvent(null)}
          event={editEvent}
        />
      )}
    </>
  );
}