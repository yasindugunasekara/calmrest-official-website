import { useEffect, useState } from "react";
import { CheckCircle, Info, X } from "lucide-react";
type Notice = { id: number; message: string; kind: "success" | "info" };
export default function Notifications() {
  const [items, setItems] = useState<Notice[]>([]);
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const listener = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const id = Date.now() + Math.random();
      setItems((list) => [...list.slice(-3), { id, ...detail }]);
      const timer = setTimeout(() => {
        setItems((list) => list.filter((item) => item.id !== id));
        timers.delete(timer);
      }, 8000);
      timers.add(timer);
    };
    window.addEventListener("hotel-notice", listener);
    return () => {
      window.removeEventListener("hotel-notice", listener);
      timers.forEach(clearTimeout);
    };
  }, []);
  return (
    <div className="hotel-notices" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className="hotel-notice" role="status">
          {item.kind === "success" ? (
            <CheckCircle size={24} />
          ) : (
            <Info size={24} />
          )}
          <span>{item.message}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() =>
              setItems((list) => list.filter((x) => x.id !== item.id))
            }
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
