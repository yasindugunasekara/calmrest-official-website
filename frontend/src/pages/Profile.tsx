import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, CheckCircle, User, LogOut } from "lucide-react";
import { API_BASE_URL, apiFetch } from "../lib/api";
import { notify } from "../lib/notify";
type Account = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  provider: string;
  emailVerified: boolean;
};
type Booking = {
  _id: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  guests: number;
};
export default function Profile() {
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      apiFetch(`${API_BASE_URL}/auth/me`, { headers }).then((r) => r.json()),
      apiFetch(`${API_BASE_URL}/bookings/mine`, { headers }).then((r) =>
        r.json(),
      ),
    ])
      .then(([data, stays]) => {
        setAccount({
          ...data.user,
          phone: data.user.phone || "",
          country: data.user.country || "",
        });
        setBookings(stays);
      })
      .catch((e) => setError(e.message));
  }, [navigate]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await apiFetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });
      const data = await result.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      notify(
        "Guest details saved. Your next booking will be filled in automatically.",
        "success",
      );
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to save details");
    } finally {
      setSaving(false);
    }
  }
  async function verify(confirm = false) {
    setVerifying(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      const res = await apiFetch(
        `${API_BASE_URL}/auth/verify-email/${confirm ? "confirm" : "request"}`,
        { method: "POST", headers, body: JSON.stringify({ code }) },
      );
      if (confirm) {
        const data = await res.json();
        setAccount({
          ...data.user,
          phone: data.user.phone || "",
          country: data.user.country || "",
        });
        setBookings(
          await (
            await apiFetch(`${API_BASE_URL}/bookings/mine`, { headers })
          ).json(),
        );
        notify(
          "Email verified. Your earlier bookings are now available.",
          "success",
        );
      } else {
        setCodeSent(true);
        notify(
          "Verification email requested. Check your inbox and spam folder.",
        );
      }
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to verify email");
    } finally {
      setVerifying(false);
    }
  }
  async function logout() {
    try {
      await apiFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">
            Calm Rest · Guest space
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-navy">
            Your stays, simply organised.
          </h1>
        </div>
        <Link className="bg-navy text-white rounded-xl px-6 py-3" to="/rooms">
          Plan another stay
        </Link>
      </div>
      {error ? (
        <p role="alert" className="p-6 bg-amber-50 rounded-xl">
          {error}{" "}
          <Link to="/login" className="underline">
            Sign in again
          </Link>
        </p>
      ) : !account ? (
        <div
          role="status"
          className="animate-pulse bg-stone-100 rounded-2xl h-64 p-8"
        >
          Preparing your guest space…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="bg-cream rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold flex gap-2 mb-2">
              <User />
              Guest details
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              Save once for a quicker checkout next time.
            </p>
            <form onSubmit={save} className="space-y-4">
              {(["firstName", "lastName", "country", "phone"] as const).map(
                (key) => (
                  <label key={key} className="block text-sm">
                    {
                      {
                        firstName: "First name",
                        lastName: "Last name",
                        country: "Country",
                        phone: "Phone (optional)",
                      }[key]
                    }
                    <input
                      required={key !== "phone"}
                      maxLength={key === "phone" ? 30 : 80}
                      autoComplete={
                        {
                          firstName: "given-name",
                          lastName: "family-name",
                          country: "country-name",
                          phone: "tel",
                        }[key]
                      }
                      type={key === "phone" ? "tel" : "text"}
                      value={account[key] || ""}
                      onChange={(e) =>
                        setAccount({ ...account, [key]: e.target.value })
                      }
                      className="block w-full rounded-lg border p-3 mt-1 bg-white"
                    />
                  </label>
                ),
              )}
              <p className="text-sm break-all">{account.email}</p>
              <button
                disabled={saving}
                className="w-full bg-navy text-white rounded-lg p-3 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save guest details"}
              </button>
            </form>
            <button onClick={logout} className="flex gap-2 mt-6 text-sm">
              <LogOut size={18} />
              Sign out
            </button>
          </aside>
          <section className="min-w-0 lg:col-span-2">
            <h2 className="text-2xl font-serif mb-4">Your bookings</h2>
            <p className="text-sm text-slate-500 mb-5">
              Reservations made while signed in appear here. Verify your email
              to securely retrieve earlier guest bookings.
            </p>
            {!account.emailVerified && (
              <div className="border border-amber-200 bg-amber-50 p-4 rounded-xl mb-5">
                <p className="text-sm mb-3">
                  Missing an earlier booking? Verify {account.email} to see
                  guest reservations made with this address.
                </p>
                {codeSent && (
                  <label className="block text-sm mb-3">
                    Eight-digit email code
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={8}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="border rounded-lg p-2 ml-2 w-36"
                    />
                  </label>
                )}
                <button
                  disabled={verifying}
                  onClick={() => verify(codeSent)}
                  className="bg-navy text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {verifying
                    ? "Please wait…"
                    : codeSent
                      ? "Verify email"
                      : "Send verification code"}
                </button>
                {codeSent && (
                  <button
                    disabled={verifying}
                    onClick={() => verify(false)}
                    className="ml-3 underline text-sm"
                  >
                    Resend
                  </button>
                )}
              </div>
            )}
            {!bookings.length ? (
              <div className="border rounded-2xl p-10 text-center bg-stone-50">
                <Calendar className="mx-auto text-gold mb-4" size={36} />
                <h3 className="text-xl font-semibold">
                  Your next chapter starts here
                </h3>
                <p className="text-slate-600 my-3">
                  Find your room and enjoy a peaceful stay in Midigama.
                </p>
                <Link to="/rooms" className="underline">
                  Explore rooms
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <article
                    key={b._id}
                    className="border rounded-2xl p-5 sm:p-6 bg-white shadow-sm"
                  >
                    <div className="flex flex-wrap gap-3 justify-between">
                      <h3 className="text-xl font-semibold">{b.roomType}</h3>
                      <span className="inline-flex items-center gap-2 text-sm rounded-full px-3 py-1 bg-stone-100">
                        <CheckCircle size={16} />
                        {b.status}
                      </span>
                    </div>
                    <p className="my-3 text-slate-600">
                      {b.checkIn} → {b.checkOut} · {b.guests} guest
                      {b.guests === 1 ? "" : "s"}
                    </p>
                    <div className="flex flex-wrap justify-between gap-3">
                      <p className="text-xs text-slate-500 break-all">
                        Reference: {b._id}
                      </p>
                      <strong>USD {b.totalPrice?.toFixed(2)}</strong>
                    </div>
                    <a
                      className="inline-block underline text-sm mt-4"
                      href={`mailto:calmrestmidigama2017@gmail.com?subject=${encodeURIComponent("Booking " + b._id)}`}
                    >
                      Ask about this booking
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
