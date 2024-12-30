export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color?: 'work' | 'personal' | 'other';
}

export interface DayEvents {
  [date: string]: Event[];
}