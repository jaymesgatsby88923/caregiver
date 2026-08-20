import type { Shift, ShiftStatus } from "@/types";

export function fullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(" ") || "Unknown";
}

export function initials(first?: string | null, last?: string | null): string {
  const a = first?.trim()?.[0] ?? "";
  const b = last?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDayLabel(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatDayRange(start: string, end: string): string {
  return `${formatDayLabel(start)} · ${formatTimeRange(start, end)}`;
}

export function formatClockTime(value: string | null): string {
  if (!value) return "—";
  return formatTime(value);
}

export function statusLabel(status: ShiftStatus): string {
  switch (status) {
    case "in_progress":
      return "In progress";
    case "assigned":
      return "Assigned";
    case "open":
      return "Open";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
  }
}

export function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function splitHomeShifts(shifts: Shift[]) {
  const current = shifts.find((shift) => shift.status === "in_progress") ?? null;
  const upcoming = shifts
    .filter((shift) => shift.status === "assigned" || shift.status === "open")
    .sort(
      (a, b) =>
        new Date(a.scheduled_start_at).getTime() -
        new Date(b.scheduled_start_at).getTime(),
    );

  if (current) {
    return { hero: current, rest: upcoming };
  }

  const [next, ...rest] = upcoming;
  return { hero: next ?? null, rest };
}
