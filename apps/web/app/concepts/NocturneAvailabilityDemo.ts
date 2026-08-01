import type { RoomId } from "@sounddistrict/booking-core";

export type DemoCalendarDay = {
  value: string;
  day: number;
  fullLabel: string;
  isPast: boolean;
};

export type DemoCalendarMonth = {
  label: string;
  days: Array<DemoCalendarDay | null>;
};

type BusyBlock = readonly [startHour: number, endHour: number];

const roomOffsets: Record<RoomId, number> = {
  blue: 2,
  red: 5,
  infinity: 8
};

function localDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateFromValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

function daySerial(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

function demoBusyBlocks(roomId: RoomId, date: Date): readonly BusyBlock[] {
  const pattern = (daySerial(date) + roomOffsets[roomId]) % 8;
  const patterns: readonly (readonly BusyBlock[])[] = [
    [[0, 24]],
    [[8, 13]],
    [[14, 20]],
    [[0, 5], [18, 22]],
    [[10, 16]],
    [[6, 10], [15, 18]],
    [[12, 17]],
    [[20, 24]]
  ];
  return patterns[pattern];
}

function overlapsDemoBooking(roomId: RoomId, start: Date, end: Date) {
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  while (cursor < end) {
    const blocks = demoBusyBlocks(roomId, cursor);
    for (const [startHour, endHour] of blocks) {
      const busyStart = new Date(cursor);
      busyStart.setHours(startHour, 0, 0, 0);
      const busyEnd = new Date(cursor);
      busyEnd.setHours(endHour, 0, 0, 0);
      if (start < busyEnd && end > busyStart) return true;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
}

export function getDemoAvailableTimes(
  roomId: RoomId,
  dateValue: string,
  duration: number,
  now = new Date()
) {
  const day = dateFromValue(dateValue);
  if (Number.isNaN(day.getTime())) return [];

  return Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`).filter((time) => {
    const [hour] = time.split(":").map(Number);
    if (hour === 2) {
      const beforeTransition = new Date(day);
      const afterTransition = new Date(day);
      beforeTransition.setHours(1, 0, 0, 0);
      afterTransition.setHours(3, 0, 0, 0);
      if (beforeTransition.getTimezoneOffset() !== afterTransition.getTimezoneOffset()) return false;
    }
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    if (start.getTime() <= now.getTime()) return false;
    const end = new Date(start.getTime() + duration * 3_600_000);
    return !overlapsDemoBooking(roomId, start, end);
  });
}

export function getDemoCalendarMonth(monthOffset: number, now = new Date()): DemoCalendarMonth {
  const month = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1, 12, 0, 0, 0);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const mondayFirstOffset = (month.getDay() + 6) % 7;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const days: Array<DemoCalendarDay | null> = Array.from({ length: mondayFirstOffset }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day, 12, 0, 0, 0);
    days.push({
      value: localDateValue(date),
      day,
      fullLabel: new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date),
      isPast: date < today
    });
  }

  while (days.length % 7 !== 0) days.push(null);

  return {
    label: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(month),
    days
  };
}
