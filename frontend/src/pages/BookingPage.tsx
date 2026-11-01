import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Mail, Loader2 } from "lucide-react";
import BookingForm from "../components/BookingForm";
import { API_BASE_URL, apiFetch } from "../lib/api";
type Account = { email: string; emailVerified: boolean };
export default function BookingPage() {
  const location = useLocation();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    sessionStorage.setItem(
      "bookingReturn",
      location.pathname + location.search,
    );
    const token = localStorage.getItem("token");
    if (!token) return;
    apiFetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setAccount(data.user))
      .catch(() =>
        setFeedback("Please sign in again to continue your reservation."),
      )
      .finally(() => setLoading(false));
  }, [location.pathname, location.search]);
  async function verify(confirm: boolean) {
    setBusy(true);
    setFeedback("");
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/auth/verify-email/${confirm ? "confirm" : "request"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ code }),
        },
      );
      if (confirm) {
        const data = await res.json();
        setAccount(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setSent(true);
        setFeedback(
          "We sent a verification code. Check your inbox and spam folder.",
        );
      }
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-dvh bg-cream px-4 py-5 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 min-h-11 mb-6 text-sm"
        >
          <ArrowLeft size={18} />
          Back to rooms
        </Link>
        <ol
          aria-label="Booking steps"
          className="flex flex-wrap gap-3 text-xs sm:text-sm mb-6 text-slate-600"
        >
          <li className={!account ? "font-bold text-navy" : ""}>1. Sign in</li>
          <li aria-hidden="true">→</li>
          <li
            className={
              account && !account.emailVerified ? "font-bold text-navy" : ""
            }
          >
            2. Verify email
          </li>
          <li aria-hidden="true">→</li>
          <li className={account?.emailVerified ? "font-bold text-navy" : ""}>
            3. Reserve your stay
          </li>
        </ol>
        {loading ? (
          <div role="status" className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-3" />
            Preparing your secure reservation…
          </div>
        ) : account?.emailVerified ? (
          <BookingForm />
        ) : (
          <section className="max-w-lg mx-auto bg-white border rounded-3xl shadow-sm p-6 sm:p-9 my-6">
            <ShieldCheck size={40} className="text-gold mb-4" />
            <p className="text-xs uppercase tracking-widest text-gold mb-2">
              Calm Rest · Midigama
            </p>
            <h1 className="font-serif text-3xl mb-3">
              {account ? "Verify your email" : "Your stay starts here"}
            </h1>
            <p className="text-slate-600 mb-6">
              {account
                ? `Confirm ${account.email} so we can send your reservation details to the right inbox.`
                : "Create an account or sign in to save your booking, receive updates, and manage your stay. Your room and dates will be kept."}
            </p>
            {account ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void verify(sent);
                }}
                className="space-y-4"
              >
                {sent && (
                  <label className="block text-sm">
                    Eight-digit email code
                    <input
                      autoFocus
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{8}"
                      maxLength={8}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="block w-full mt-2 border rounded-xl p-4 tracking-widest text-center"
                    />
                  </label>
                )}
                <button
                  disabled={busy}
                  className="w-full min-h-12 bg-navy text-white rounded-xl p-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {busy ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Mail size={18} />
                  )}{" "}
                  {sent ? "Verify & continue" : "Send verification code"}
                </button>
                {sent && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => verify(false)}
                    className="w-full underline text-sm p-2"
                  >
                    Send a new code
                  </button>
                )}
              </form>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="block text-center min-h-12 bg-navy text-white rounded-xl p-3 font-semibold"
                >
                  Create an account
                </Link>
                <Link
                  to="/login"
                  className="block text-center min-h-12 border border-slate-300 rounded-xl p-3"
                >
                  I already have an account
                </Link>
              </div>
            )}
            {feedback && (
              <p
                role="status"
                className="mt-4 p-3 rounded-lg bg-amber-50 text-sm"
              >
                {feedback}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-6">
              Your reservation is only submitted after you review your stay and
              choose Request booking.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
