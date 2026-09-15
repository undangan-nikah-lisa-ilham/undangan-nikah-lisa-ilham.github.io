"use client";

import { useEffect, useState } from "react";
import {
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
} from "firebase/database";
import { db, ensureAuth } from "@/lib/firebase";
import { Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { formatRelative } from "@/lib/format";
import { computeStats } from "@/lib/types";
import type { RsvpStatus, WishItem, WishStats } from "@/lib/types";

type Props = {
  guestName: string;
  showToast: (message: string) => void;
};

const STATUS_STYLE: Record<string, string> = {
  Hadir: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Tidak Hadir": "bg-red-50 text-red-600 border-red-200",
  Ragu: "bg-amber-50 text-amber-700 border-amber-200",
};

const EMPTY_STATS: WishStats = { total: 0, hadir: 0, tidak: 0, ragu: 0 };
const DB_PATH = "rsvp_lisa_ilham";

export default function WishesSection({ guestName, showToast }: Props) {
  const [entries, setEntries] = useState<WishItem[]>([]);
  const [stats, setStats] = useState<WishStats>(EMPTY_STATS);
  const [name, setName] = useState(
    guestName && guestName !== "Tamu Undangan" ? guestName : "",
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<RsvpStatus | "">("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureAuth();
        if (!cancelled) setAuthReady(true);
      } catch (err) {
        console.error("Auth error:", err);
        if (!cancelled) {
          showToast("Gagal menyiapkan koneksi. Coba muat ulang.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  useEffect(() => {
    if (!authReady) return;

    const wishesRef = query(
      ref(db, DB_PATH),
      orderByChild("createdAt"),
      limitToLast(100),
    );

    const unsubscribe = onValue(
      wishesRef,
      (snapshot) => {
        const data = snapshot.val();
        let list: WishItem[] = [];
        if (data) {
          list = Object.entries(data).map(([id, value]) => {
            const v = value as Omit<WishItem, "id">;
            return {
              id,
              uid: v.uid,
              name: v.name,
              msg: v.msg,
              status: v.status,
              createdAt: v.createdAt,
            };
          });
          list.reverse();
        }
        setEntries(list);
        setStats(computeStats(list));
        setLoading(false);
      },
      (error) => {
        console.error("Firebase read error:", error);
        showToast("Gagal memuat ucapan");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [authReady, showToast]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      showToast("Mohon isi nama Anda");
      return;
    }
    if (!trimmedMessage) {
      showToast("Mohon tuliskan ucapan dan doa");
      return;
    }
    if (!status) {
      showToast("Mohon pilih status kehadiran");
      return;
    }

    setSending(true);
    try {
      const user = await ensureAuth();

      await push(ref(db, DB_PATH), {
        name: trimmedName.slice(0, 80),
        msg: trimmedMessage.slice(0, 500),
        status,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      setMessage("");
      setStatus("");
      showToast("Ucapan berhasil dikirim!");
    } catch (error) {
      console.error("Firebase write error:", error);
      showToast("Gagal mengirim, coba lagi");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="px-5 py-12 text-center text-white"
      style={{
        background: "linear-gradient(135deg, var(--sage), var(--sage-700))",
      }}
    >
      <Reveal>
        <p className="mb-1 text-xs font-semibold tracking-[4px] text-sage-100/80 uppercase">
          Berikan Ucapan
        </p>
        <h3 className="font-greatvibes mb-2 text-5xl leading-none text-white">
          Ucapan &amp; Doa
        </h3>
        <p className="mx-auto mb-6 max-w-xs text-xs leading-6 font-light text-sage-100/90">
          Ucapkan selamat dan doa restu kepada mempelai untuk hari bahagia
          mereka.
        </p>
      </Reveal>

      <Reveal>
        <div className="mb-5 border-b border-white/25 pb-6">
          <p className="mb-3 text-center text-xs font-medium tracking-wider text-sage-100/80 uppercase">
            Status Kehadiran
          </p>
          <div className="mx-auto grid w-full max-w-xs grid-cols-3 gap-3">
            {[
              { label: "Hadir", value: stats.hadir },
              { label: "Tidak", value: stats.tidak },
              { label: "Ragu", value: stats.ragu },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/25 bg-white/10 p-3 text-center text-white"
              >
                <p className="text-xl leading-none font-bold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] tracking-wider text-sage-100/90 uppercase">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-sage-200/30 bg-ivory-50 p-5 text-left shadow-2xl">
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="rsvp-name">
              Nama Anda
            </label>
            <input
              id="rsvp-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="Nama Anda"
              required
              className="w-full rounded-xl border border-sage-200 bg-white p-3 text-xs text-sage-800 outline-none transition placeholder:text-sage-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
            />

            <label className="sr-only" htmlFor="rsvp-message">
              Ucapan dan doa
            </label>
            <textarea
              id="rsvp-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tuliskan ucapan & doa terbaik..."
              required
              className="w-full resize-none rounded-xl border border-sage-200 bg-white p-3 text-xs text-sage-800 outline-none transition placeholder:text-sage-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
            />

            <label className="sr-only" htmlFor="rsvp-status">
              Konfirmasi kehadiran
            </label>
            <select
              id="rsvp-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as RsvpStatus | "")
              }
              required
              className="w-full rounded-xl border border-sage-200 bg-white p-3 text-xs text-sage-700 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
            >
              <option value="" disabled>
                Konfirmasi Kehadiran
              </option>
              <option value="Hadir">Akan Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Ragu">Masih Ragu</option>
            </select>

            <button
              type="submit"
              disabled={sending || !authReady}
              className="btn-sage mt-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-medium tracking-wider uppercase active:scale-95"
            >
              <Icon
                name={sending ? "spinner" : "send"}
                size={14}
                className={sending ? "spin-slow" : ""}
              />
              <span>{sending ? "Mengirim..." : "Kirim Ucapan"}</span>
            </button>
          </form>

          <div
            data-lenis-prevent
            className="mt-5 max-h-72 space-y-2 overflow-y-auto pr-1"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-sage-500">
                <Icon name="spinner" size={14} className="spin-slow" />
                Memuat ucapan...
              </div>
            ) : entries.length === 0 ? (
              <div className="py-4 text-center text-xs text-sage-500">
                Belum ada ucapan. Jadilah yang pertama! 💐
              </div>
            ) : (
              entries.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border-b border-sage-200/60 p-3 last:border-0"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-sage-400 to-sage-600 text-[10px] font-bold text-white">
                      {item.name.trim().charAt(0).toUpperCase() || "T"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-xs font-bold text-sage-800">
                          {item.name}
                        </p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase ${STATUS_STYLE[item.status] ?? STATUS_STYLE.Ragu}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed break-words text-sage-600">
                        {item.msg}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-sage-400">
                        <Icon name="clock" size={10} />
                        {mounted ? formatRelative(item.createdAt) : ""}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}