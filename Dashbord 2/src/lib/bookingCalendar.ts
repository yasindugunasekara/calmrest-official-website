export type Stay = { checkIn: string; checkOut: string; status?: string };
export function staysOnDate<T extends Stay>(bookings: T[], date: string) {
  return bookings.filter(
    (b) => b.status !== "Cancelled" && b.checkIn <= date && b.checkOut > date,
  );
}
export function activityOnDate<T extends Stay>(bookings: T[], date: string) {
  return bookings.filter(
    (b) => b.status !== "Cancelled" && b.checkIn <= date && b.checkOut >= date,
  );
}
export function monthDays(month: string) {
  const start = new Date(month + "-01T00:00:00Z");
  const padding = (start.getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) =>
    new Date(start.getTime() + (i - padding) * 86400000)
      .toISOString()
      .slice(0, 10),
  );
}
export function shiftMonth(month: string, offset: number) {
  const d = new Date(month + "-01T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + offset);
  return d.toISOString().slice(0, 7);
}
