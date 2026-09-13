"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import GallerySection from "@/components/GallerySection";
import GiftSection from "@/components/GiftSection";
import WishesSection from "@/components/WishesSection";
import { STORY, WEDDING } from "@/lib/data";

type Props = {
  guestName: string;
  initialVisits: number;
};

const PETALS = [
  { left: "6%", size: 10, delay: 0, duration: 14 },
  { left: "18%", size: 7, delay: 3, duration: 17 },
  { left: "31%", size: 12, delay: 6, duration: 15 },
  { left: "47%", size: 8, delay: 1.5, duration: 19 },
  { left: "62%", size: 11, delay: 4.5, duration: 16 },
  { left: "74%", size: 6, delay: 7.5, duration: 13 },
  { left: "88%", size: 9, delay: 2.5, duration: 18 },
];

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export default function Invitation({ guestName, initialVisits }: Props) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [displayGuestName, setDisplayGuestName] = useState(guestName);
  const [mainVisible, setMainVisible] = useState(false);
  const [countdown, setCountdown] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });
  const [progress, setProgress] = useState(0);
  const [visits, setVisits] = useState(initialVisits);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((prev) => ({ ...prev, show: false })),
      2600,
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value =
      params.get("to") ||
      params.get("n") ||
      params.get("guest") ||
      params.get("kepada");
    if (value?.trim()) setDisplayGuestName(value.trim().slice(0, 60));
  }, []);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    window.scrollTo(0, 0);
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const saved = Number.parseInt(
      localStorage.getItem("invitation-visits") || "0",
      10,
    );
    if (Number.isFinite(saved) && saved > 0) setVisits(saved);

    const target = new Date(WEDDING.targetDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY || document.documentElement.scrollTop;
        setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
        frame = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      audio.volume = 0.6;
      await audio.play();
      setMusicPlaying(true);
      return true;
    } catch {
      setMusicPlaying(false);
      return false;
    }
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setMusicPlaying(false);
      showToast("Musik dimatikan");
      return;
    }
    const started = await playMusic();
    showToast(started ? "Musik diputar" : "Musik belum dapat diputar");
  };

  const openInvitation = async () => {
    setCoverOpen(true);
    window.setTimeout(() => {
      setMainVisible(true);
      document.body.classList.remove("overflow-hidden");
      window.scrollTo(0, 0);
    }, 80);

    void playMusic();

    const nextVisits =
      Number.parseInt(
        localStorage.getItem("invitation-visits") || "0",
        10,
      ) + 1;
    localStorage.setItem("invitation-visits", String(nextVisits));
    setVisits(nextVisits);
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <div
        id="cover-page"
        className={`fixed inset-0 flex h-full w-full flex-col items-center justify-end px-6 pb-20 text-center ${
          coverOpen ? "open" : ""
        }`}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={WEDDING.coverPhoto}
            alt={`${WEDDING.brideShort} & ${WEDDING.groomShort}`}
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/70" />
          {PETALS.map((petal, i) => (
            <span
              key={i}
              className="petal"
              style={{
                left: petal.left,
                width: petal.size,
                height: petal.size,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md px-4 text-white">
          <p className="mb-3 text-[11px] font-light tracking-[6px] text-sage-200 uppercase">
            The Wedding Of
          </p>
          <h1 className="font-greatvibes mb-2 text-7xl leading-none drop-shadow-2xl md:text-8xl">
            {WEDDING.brideShort} &amp; {WEDDING.groomShort}
          </h1>
          <div className="mx-auto mb-5 h-px w-20 bg-sage-300/60" />
          <p className="to-label mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h3 className="font-cormorant mb-8 text-2xl font-semibold text-ivory italic drop-shadow-lg md:text-3xl">
            {displayGuestName}
          </h3>
          <button
            type="button"
            onClick={openInvitation}
            className="btn-sage inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm font-medium tracking-wider uppercase shadow-2xl active:scale-95"
          >
            <Icon name="envelope" size={17} />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>

      <main
        className={`relative z-10 mx-auto min-h-screen w-full max-w-[480px] bg-offwhite transition-opacity duration-700 md:border md:border-sage-200 md:shadow-2xl ${
          mainVisible ? "opacity-100" : "hidden opacity-0"
        }`}
      >
        <section className="h-screen-fallback relative flex w-full flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={WEDDING.heroPhoto}
              alt={`${WEDDING.brideShort} & ${WEDDING.groomShort}`}
              className="h-full w-full object-cover"
              decoding="async"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(43,54,39,.25) 0%, transparent 32%, rgba(43,54,39,.62) 62%, rgba(43,54,39,.96) 96%)",
              }}
            />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-end px-5 pb-24 text-center text-white">
            <p className="mb-2 text-[11px] font-light tracking-[6px] text-sage-200 uppercase">
              The Wedding Of
            </p>
            <h2 className="font-greatvibes my-2 text-6xl leading-none">
              {WEDDING.brideShort} &amp; {WEDDING.groomShort}
            </h2>
            <div className="my-3 h-px w-20 bg-sage-300/50" />
            <p className="mb-5 text-xs tracking-[4px] text-sage-200/90 uppercase">
              {WEDDING.dateShort}
            </p>

            <div className="flex w-full justify-center gap-2.5 px-2 py-3">
              {[
                { value: countdown.d, label: "Hari" },
                { value: countdown.h, label: "Jam" },
                { value: countdown.m, label: "Menit" },
                { value: countdown.s, label: "Detik" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex h-[66px] w-[66px] flex-col items-center justify-center rounded-2xl border border-sage-200/40 bg-ivory-50/95 text-sage-800 shadow-lg"
                >
                  <span className="font-serif text-xl leading-none font-bold text-sage-800">
                    {item.value}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold tracking-wider text-sage-700 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-4 max-w-xs text-[11px] leading-6 font-light text-sage-100/90 italic">
              &ldquo;Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
              mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara
              pernikahan kami.&rdquo;
            </p>
          </div>
        </section>

        <div className="section-divider">
          <Icon name="leaf" size={16} />
        </div>

        <section id="mempelai" className="my-12 px-5 text-center">
          <Reveal>
            <p className="mb-2 text-[11px] font-semibold tracking-[4px] text-sage-600 uppercase">
              The Beautiful Couple
            </p>
            <h3 className="font-greatvibes text-5xl text-sage-800">
              Bride &amp; Groom
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-sage-600">
              Bismillahirrahmanirrahim. Assalamu&rsquo;alaikum Wr. Wb. Tanpa
              mengurangi rasa hormat, kami mengundang Anda untuk menghadiri
              acara pernikahan kami.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-12">
            <Reveal variant="left">
              <figure className="relative flex w-full flex-col items-center">
                <div className="absolute top-32 -right-3 z-10">
                  <p className="font-greatvibes -rotate-90 text-4xl whitespace-nowrap text-sage-400 opacity-70">
                    The Bride
                  </p>
                </div>
                <div
                  className="mb-5 h-[318px] w-[240px] overflow-hidden rounded-2xl border-4 border-white"
                  style={{
                    boxShadow: "18px 14px 40px -12px rgba(107,125,94,.45)",
                  }}
                >
                  <img
                    src={WEDDING.bride.photo}
                    alt={WEDDING.bride.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="flex flex-col items-center gap-1.5">
                  <h4 className="font-cormorant text-2xl font-bold text-sage-900 italic">
                    {WEDDING.bride.name}
                  </h4>
                  <div className="my-1 h-px w-10 bg-sage-300" />
                  <p className="max-w-xs text-xs leading-relaxed text-sage-700">
                    {WEDDING.bride.order}
                    <br />
                    <span className="font-semibold text-sage-800">
                      {WEDDING.bride.parents}
                    </span>
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <div className="flex items-center justify-center gap-3 text-sage-400">
                <span className="h-px w-16 bg-sage-300/60" />
                <Icon name="heart" size={20} />
                <span className="h-px w-16 bg-sage-300/60" />
              </div>
            </Reveal>

            <Reveal variant="right">
              <figure className="relative flex w-full flex-col items-center">
                <div className="absolute top-32 -left-3 z-10">
                  <p className="font-greatvibes -rotate-90 text-4xl whitespace-nowrap text-sage-400 opacity-70">
                    The Groom
                  </p>
                </div>
                <div
                  className="mb-5 h-[318px] w-[240px] overflow-hidden rounded-2xl border-4 border-white"
                  style={{
                    boxShadow: "-18px 14px 40px -12px rgba(107,125,94,.45)",
                  }}
                >
                  <img
                    src={WEDDING.groom.photo}
                    alt={WEDDING.groom.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="flex flex-col items-center gap-1.5">
                  <h4 className="font-cormorant text-2xl font-bold text-sage-900 italic">
                    {WEDDING.groom.name}
                  </h4>
                  <div className="my-1 h-px w-10 bg-sage-300" />
                  <p className="max-w-xs text-xs leading-relaxed text-sage-700">
                    {WEDDING.groom.order}
                    <br />
                    <span className="font-semibold text-sage-800">
                      {WEDDING.groom.parents}
                    </span>
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section className="quote-section flex flex-col items-center gap-3 px-8 py-16 text-center">
          <Icon name="quote" size={30} className="text-white/30" />
          <h6 className="font-cormorant mx-auto max-w-xs text-lg leading-loose font-light text-ivory-50 italic">
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
            menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar
            kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
            antaramu rasa kasih dan sayang.&rdquo;
          </h6>
          <div className="my-2 h-px w-12 bg-white/40" />
          <p className="text-xs font-semibold tracking-[3px] text-ivory-100 uppercase">
            Q.S. Ar-Rum: 21
          </p>
        </section>

        <section id="acara" className="bg-offwhite px-4 py-12">
          <Reveal>
            <div className="mb-6 text-center">
              <p className="mb-1 text-[11px] font-semibold tracking-[4px] text-sage-600 uppercase">
                Save The Date
              </p>
              <h3 className="font-greatvibes text-5xl text-sage-800">
                Wedding Day
              </h3>
              <p className="mt-2 text-xs text-sage-600">{WEDDING.dateLabel}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-8 flex justify-center gap-2.5">
              <div className="aspect-[197/147] w-1/2 overflow-hidden rounded-tl-[85px] border border-sage-200 shadow-lg">
                <img
                  src={WEDDING.savePhotos[0]}
                  alt="Save the date"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="aspect-[197/147] w-1/2 overflow-hidden rounded-br-[85px] border border-sage-200 shadow-lg">
                <img
                  src={WEDDING.savePhotos[1]}
                  alt="Save the date"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex overflow-hidden rounded-2xl border border-sage-200 shadow-2xl">
              <div className="flex w-[68px] flex-none items-center justify-center bg-gradient-to-b from-sage to-sage-700 py-6">
                <h5 className="font-greatvibes -rotate-90 text-3xl whitespace-nowrap text-white">
                  Wedding Event
                </h5>
              </div>
              <div className="flex-1 bg-ivory-100 p-5">
                <div className="mb-5 border-b border-sage-200 pb-5">
                  <div className="mb-2 flex items-center gap-2 text-sage">
                    <Icon name="mosque" size={16} />
                    <h4 className="text-sm font-bold tracking-wider text-sage-800 uppercase">
                      Akad Nikah
                    </h4>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-sage-700">
                    <Icon name="calendar" size={13} className="text-sage" />
                    {WEDDING.dateLabel}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-sage-800">
                    <Icon name="clock" size={13} className="text-sage" />
                    {WEDDING.akad}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-sage-800">
                    {WEDDING.venue}
                  </p>
                  <p className="mt-0.5 text-xs text-sage-600">
                    {WEDDING.address}
                  </p>
                  <a
                    href={WEDDING.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sage mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium active:scale-95"
                  >
                    <Icon name="pin" size={13} /> Buka Map
                  </a>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-sage">
                    <Icon name="rings" size={16} />
                    <h4 className="text-sm font-bold tracking-wider text-sage-800 uppercase">
                      Resepsi
                    </h4>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-sage-700">
                    <Icon name="calendar" size={13} className="text-sage" />
                    {WEDDING.dateLabel}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-sage-800">
                    <Icon name="clock" size={13} className="text-sage" />
                    {WEDDING.resepsi}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-sage-800">
                    {WEDDING.venue}
                  </p>
                  <p className="mt-0.5 text-xs text-sage-600">
                    {WEDDING.address}
                  </p>
                  <a
                    href={WEDDING.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sage mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium active:scale-95"
                  >
                    <Icon name="pin" size={13} /> Buka Map
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="section-divider">
          <Icon name="sparkle" size={14} />
        </div>

        <section className="bg-offwhite px-5 py-12">
          <Reveal>
            <div className="mb-8 text-center">
              <p className="mb-2 text-[11px] font-semibold tracking-[4px] text-sage-600 uppercase">
                🤍 Our Little Journey 🤍
              </p>
              <h3 className="font-greatvibes text-5xl text-sage-800">
                Lisa &amp; Ilham
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-xs text-sage-600 italic">
                Setiap langkah kecil membawa kami sampai di titik ini.
              </p>
            </div>
          </Reveal>
          <div className="timeline mx-auto max-w-md">
            {STORY.map((item, index) => (
              <Reveal key={item.title} variant="up" delay={index * 60}>
                <article className="story">
                  <div className="glass-card rounded-xl p-5">
                    <time className="text-[10px] font-bold tracking-[0.12em] text-sage-600 uppercase">
                      {item.time}
                    </time>
                    <h4 className="font-cormorant mt-1 mb-1.5 text-xl font-semibold text-sage-800 italic">
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-sage-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-center font-cormorant text-lg italic text-sage-700">
              From a simple hello, to forever. 🤍
            </p>
          </Reveal>
        </section>

        <div className="section-divider">
          <Icon name="camera" size={14} />
        </div>

        <GallerySection active={mainVisible} />

        <div className="section-divider">
          <Icon name="gift" size={14} />
        </div>

        <GiftSection showToast={showToast} />

        <WishesSection guestName={displayGuestName} showToast={showToast} />

        <section className="h-screen-fallback relative overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <img
              src={WEDDING.closingPhoto}
              alt={`${WEDDING.brideShort} dan ${WEDDING.groomShort}`}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage-900/40 to-sage-900" />
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-20 text-center text-white">
            <p className="mb-3 text-xs font-light tracking-[5px] text-sage-200/80 uppercase">
              Terima Kasih
            </p>
            <h3 className="font-greatvibes mb-3 text-6xl text-white">
              {WEDDING.brideShort} &amp; {WEDDING.groomShort}
            </h3>
            <div className="mx-auto my-3 h-px w-16 bg-sage-300/40" />
            <p className="mx-auto max-w-xs text-[11px] leading-relaxed font-light text-sage-100/90 italic">
              &ldquo;Merupakan sebuah kehormatan dan kebahagiaan bagi kami jika
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi
              kami.&rdquo;
            </p>
          </div>
        </section>

        <footer
          className="relative z-10 p-8 text-center text-white"
          style={{
            background: "linear-gradient(135deg, var(--sage), var(--sage-700))",
          }}
        >
          <p className="text-[10px] tracking-[3px] text-sage-100/80 uppercase">
            Dengan penuh cinta dan kebahagiaan
          </p>
          <p className="font-cormorant mt-2 text-xl italic text-sage-50">
            {WEDDING.brideShort} &amp; {WEDDING.groomShort} ♡
          </p>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-sage-100/60">
            <Icon name="users" size={12} />
            {visits.toLocaleString("id-ID")} kali undangan ini dibuka
          </p>
        </footer>
      </main>

      <audio
        ref={audioRef}
        loop
        preload="none"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      >
        <source src="https://files.catbox.moe/r858b6.mp3" type="audio/mpeg" />
      </audio>

      <button
        id="musicToggle"
        type="button"
        onClick={() => void toggleMusic()}
        aria-label={musicPlaying ? "Matikan musik" : "Putar musik"}
        className={`fixed right-5 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-sage-700 shadow-xl ${
          musicPlaying ? "playing" : ""
        } ${mainVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <Icon
          name={musicPlaying ? "music" : "muted"}
          size={17}
          className={musicPlaying ? "spin-slow" : ""}
        />
      </button>

      <div id="toast" className={toast.show ? "show" : ""} role="status">
        <Icon name="check" size={14} />
        {toast.message}
      </div>
    </>
  );
}