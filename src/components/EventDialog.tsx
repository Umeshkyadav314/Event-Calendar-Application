import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, hasEventOverlap, storeEvents } from '@/lib/calendar';
import { DayEvents, Event } from '@/types/calendar';

interface EventDialogProps {
  date: Date;
  events: DayEvents;
  setEvents: (events: DayEvents) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
}

export function EventDialog({
  date,
  events,
  setEvents,
  open,
  onOpenChange,
  event,
}: EventDialogProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startTime, setStartTime] = useState(event?.startTime || '09:00');
  const [endTime, setEndTime] = useState(event?.endTime || '10:00');
  const [color, setColor] = useState(event?.color || 'work');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const dateStr = formatDate(date);
    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      date: dateStr,
      color,
    };

    if (hasEventOverlap(events[dateStr] || [], newEvent, event?.id)) {
      setError('Event overlaps with an existing event');
      return;
    }

    const updatedEvents = { ...events };
    if (!updatedEvents[dateStr]) {
      updatedEvents[dateStr] = [];
    }

    if (event) {
      updatedEvents[dateStr] = updatedEvents[dateStr].map((e) =>
        e.id === event.id
          ? { ...newEvent, id: event.id }
          : e
      );
    } else {
      updatedEvents[dateStr].push({
        ...newEvent,
        id: crypto.randomUUID(),
      });
    }

    setEvents(updatedEvents);
    storeEvents(updatedEvents);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Add Event'} - {formatDate(date)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={color} onValueChange={(value) => setColor(value as 'work' | 'personal' | 'other')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update' : 'Add'} Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
