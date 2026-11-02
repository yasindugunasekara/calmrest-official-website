import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import { notify } from "../lib/notify";
import {
  activityOnDate,
  monthDays,
  shiftMonth,
  staysOnDate,
} from "../lib/bookingCalendar";
type Booking = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequest?: string;
  status?: string;
  totalPrice?: number;
  createdAt?: string;
};
const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const display = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T00:00:00Z"));
const statusClass = (status?: string) =>
  status === "Cancelled"
    ? "bg-rose-50 text-rose-700"
    : status === "Confirmed" || status === "Checked In"
      ? "bg-emerald-50 text-emerald-800"
      : "bg-amber-50 text-amber-800";
export default function Bookings() {
  const day = today();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const [room, setRoom] = useState("All rooms");
  const [month, setMonth] = useState(day.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(day);
  const [view, setView] = useState<"calendar" | "upcoming" | "past" | "all">(
    "calendar",
  );
  const [selected, setSelected] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  async function load() {
    try {
      const { data } = await api.get<Booking[]>("/bookings");
      setBookings(data);
      setError("");
    } catch {
      setError("Bookings could not be loaded. Please retry.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const initial = setTimeout(() => void load(), 0);
    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [selected]);
  const filtered = bookings.filter(
    (b) =>
      (room === "All rooms" || room === b.roomType) &&
      `${b.firstName} ${b.lastName} ${b.email} ${b._id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const list = filtered
    .filter((b) =>
      search
        ? true
        : view === "calendar"
          ? selectedDate && activityOnDate([b], selectedDate).length
          : view === "upcoming"
            ? b.checkOut > day &&
              !["Cancelled", "Checked Out"].includes(b.status || "")
            : view === "past"
              ? b.checkOut <= day ||
                ["Cancelled", "Checked Out"].includes(b.status || "")
              : true,
    )
    .sort((a, b) =>
      view === "past"
        ? b.checkIn.localeCompare(a.checkIn)
        : a.checkIn.localeCompare(b.checkIn),
    );
  async function changeStatus(status: string) {
    if (!selected || saving) return;
    setSaving(true);
    try {
      const { data } = await api.put("/bookings/" + selected._id, { status });
      setBookings((items) =>
        items.map((b) => (b._id === data.booking._id ? data.booking : b)),
      );
      setSelected(data.booking);
      notify("Reservation status updated.", "success");
    } catch (e) {
      notify(
        (e as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Could not update reservation",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="space-y-5 min-w-0">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tap a date, then a guest to manage their stay.
          </p>
        </div>
        <button
          onClick={() => void load()}
          aria-label="Refresh bookings"
          className="p-3 bg-white border rounded-xl"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(["calendar", "upcoming", "past", "all"] as const).map((v) => (
          <button
            key={v}
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={`min-h-12 px-3 py-3 rounded-xl text-sm font-semibold ${view === v ? "bg-slate-900 text-white" : "bg-white border text-slate-600"}`}
          >
            {
              {
                calendar: "Calendar",
                upcoming: "Upcoming",
                past: "Past & cancelled",
                all: "All bookings",
              }[v]
            }
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <Search
            className="absolute top-3.5 left-3 text-slate-400"
            size={18}
          />
          <input
            aria-label="Find a booking"
            placeholder="Guest name, email or reference"
            value={search}
            onChange={(e) =>
              setParams(e.target.value ? { search: e.target.value } : {}, {
                replace: true,
              })
            }
            className="w-full min-h-12 border rounded-xl py-3 pl-10 pr-3 bg-white"
          />
        </label>
        <select
          aria-label="Filter room category"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="min-h-12 border rounded-xl p-3 bg-white max-w-full"
        >
          <option>All rooms</option>
          {[...new Set(bookings.map((b) => b.roomType))].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>
      {error && (
        <p role="alert" className="p-4 bg-rose-50 text-rose-700 rounded-xl">
          {error}
        </p>
      )}
      {view === "calendar" && (
        <section
          className="bg-white border rounded-2xl p-3 sm:p-5"
          aria-label="Booking calendar"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <label className="text-sm font-semibold">
              Month
              <input
                aria-label="Booking month"
                type="month"
                value={month}
                onChange={(e) => {
                  if (e.target.value) setMonth(e.target.value);
                }}
                className="block sm:inline-block sm:ml-3 border rounded-lg p-2 max-w-full"
              />
            </label>
            <div className="flex gap-1">
              <button
                aria-label="Previous month"
                onClick={() => setMonth(shiftMonth(month, -1))}
                className="p-3 rounded-lg border"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => {
                  setMonth(day.slice(0, 7));
                  setSelectedDate(day);
                }}
                className="px-3 border rounded-lg text-sm"
              >
                Today
              </button>
              <button
                aria-label="Next month"
                onClick={() => setMonth(shiftMonth(month, 1))}
                className="p-3 border rounded-lg"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays(month).map((date) => {
              const stays = staysOnDate(filtered, date).length;
              const departures = filtered.filter(
                (b) => b.status !== "Cancelled" && b.checkOut === date,
              ).length;
              return (
                <button
                  key={date}
                  aria-label={`${display(date)}, ${stays} stays, ${departures} departures`}
                  aria-pressed={selectedDate === date}
                  onClick={() => setSelectedDate(date)}
                  className={`min-w-0 min-h-16 sm:min-h-24 rounded-lg border p-1 sm:p-2 text-center ${selectedDate === date ? "bg-slate-900 text-white border-slate-900" : date.startsWith(month) ? "bg-white" : "bg-stone-50 text-slate-400"}`}
                >
                  <span
                    className={`block text-sm ${date === day ? "underline font-bold" : ""}`}
                  >
                    {Number(date.slice(-2))}
                  </span>
                  {stays > 0 && (
                    <span
                      className={`block text-[10px] sm:text-xs mt-1 rounded px-0.5 ${selectedDate === date ? "bg-white/20" : "bg-emerald-50 text-emerald-800"}`}
                    >
                      {stays}
                      <span className="hidden sm:inline"> stays</span>
                    </span>
                  )}
                  {!stays && departures > 0 && (
                    <span className="block text-[9px] sm:text-xs mt-1">
                      {departures} out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Numbers show reserved rooms for the night. “Out” shows departures.
            Cancelled stays appear in Past & cancelled.
          </p>
        </section>
      )}
      <section aria-label="Reservation list">
        <div className="flex flex-wrap justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold">
            {view === "calendar" && selectedDate
              ? display(selectedDate)
              : view === "past"
                ? "Past & cancelled reservations"
                : view === "upcoming"
                  ? "Upcoming & current stays"
                  : "All reservations"}
          </h2>
          <span className="text-sm text-slate-500">
            {list.length} booking{list.length === 1 ? "" : "s"}
          </span>
        </div>
        {loading ? (
          <p
            role="status"
            className="animate-pulse p-8 rounded-xl bg-stone-100"
          >
            Loading reservations…
          </p>
        ) : !list.length ? (
          <div className="text-center p-8 bg-white border rounded-2xl">
            <CalendarDays className="mx-auto text-slate-400 mb-3" />
            <p>
              No reservations{" "}
              {view === "calendar" ? "on this date" : "match these filters"}.
            </p>
            <button
              onClick={() => {
                setView("all");
                setRoom("All rooms");
                setParams({});
              }}
              className="underline text-sm mt-3 min-h-11"
            >
              View all bookings
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {list.map((b) => (
              <button
                key={b._id}
                onClick={() => setSelected(b)}
                className="text-left rounded-2xl bg-white border p-4 sm:p-5 hover:border-amber-400 shadow-sm min-w-0"
              >
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <strong className="text-base break-words">
                    {b.firstName} {b.lastName}
                  </strong>
                  <span
                    className={`text-xs rounded-full px-2.5 py-1 ${statusClass(b.status)}`}
                  >
                    {b.status || "Pending"}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-3 break-words">
                  {b.roomType}
                </p>
                <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl text-sm">
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">
                      Check-in
                    </span>
                    {display(b.checkIn)}
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">
                      Check-out
                    </span>
                    {display(b.checkOut)}
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span>{b.guests} guests</span>
                  <span className="font-semibold">View details →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      <dialog
        ref={dialog}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="reservation-title"
        className="hotel-booking-dialog p-0 bg-white rounded-2xl w-[calc(100%-24px)] max-w-xl max-h-[90dvh] shadow-2xl backdrop:bg-black/50"
      >
        {selected && (
          <div className="p-5 sm:p-7">
            <div className="flex justify-between gap-3 items-start">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Reservation details
                </p>
                <h2 id="reservation-title" className="text-xl font-bold">
                  {selected.firstName} {selected.lastName}
                </h2>
              </div>
              <button
                autoFocus
                aria-label="Close booking details"
                onClick={() => setSelected(null)}
                className="p-2 border rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 break-all mt-3">
              Reference: {selected._id}
            </p>
            <div className="my-5 rounded-xl bg-stone-50 p-4 space-y-3 text-sm">
              <p className="font-semibold">{selected.roomType}</p>
              <p>Check-in: {display(selected.checkIn)}</p>
              <p>Check-out: {display(selected.checkOut)}</p>
              <p>
                {selected.guests} guests ·{" "}
                {Math.round(
                  (Date.parse(selected.checkOut) -
                    Date.parse(selected.checkIn)) /
                    86400000,
                )}{" "}
                nights
              </p>
              <p className="font-semibold">
                Stay value:{" "}
                {selected.totalPrice != null
                  ? `USD ${selected.totalPrice.toFixed(2)}`
                  : "Not recorded"}
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 break-all min-h-11"
              >
                <Mail size={18} className="shrink-0" />
                {selected.email}
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 min-h-11"
                >
                  <Phone size={18} />
                  {selected.phone}
                </a>
              )}
              <p className="whitespace-pre-wrap break-words">
                <strong>Guest requests:</strong>{" "}
                {selected.specialRequest || "None"}
              </p>
            </div>
            <label className="block mt-6 text-sm font-semibold">
              Reservation status
              <select
                disabled={
                  saving ||
                  ["Cancelled", "Checked Out"].includes(selected.status || "")
                }
                value={selected.status || "Pending"}
                onChange={(e) => void changeStatus(e.target.value)}
                className="block w-full p-3 border rounded-xl mt-2 disabled:opacity-60"
              >
                {[
                  "Pending",
                  "Confirmed",
                  "Checked In",
                  "Checked Out",
                  "Cancelled",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <p className="text-xs text-slate-500 mt-3">
              {saving
                ? "Saving…"
                : "Status changes save immediately. Closed reservations stay in your booking history."}
            </p>
            <button
              className="bg-slate-900 text-white rounded-xl w-full min-h-12 mt-5"
              onClick={() => setSelected(null)}
            >
              Done
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
