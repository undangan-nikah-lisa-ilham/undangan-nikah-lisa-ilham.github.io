"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/lib/data";
import { Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";

type Props = { active: boolean };

export default function GallerySection({ active }: Props) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbAnimating, setLbAnimating] = useState(false);

  const pausedRef = useRef(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchRef = useRef({ x: 0, y: 0, moved: false });

  const goTo = useCallback((next: number) => {
    setFading(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setIndex(((next % GALLERY.length) + GALLERY.length) % GALLERY.length);
      setFading(false);
    }, 320);
  }, []);

  const pause = useCallback((ms = 6000) => {
    pausedRef.current = true;
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % GALLERY.length);
        setFading(false);
      }, 320);
    }, 5200);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          pausedRef.current = !entry.isIntersecting;
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openLightbox = (i: number) => {
    setLbIndex(i);
    setLightbox(true);
    pausedRef.current = true;
    document.body.classList.add("overflow-hidden");
  };

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    document.body.classList.remove("overflow-hidden");
    pause(5000);
  }, [pause]);

  const navigate = useCallback((dir: number) => {
    setLbAnimating(true);
    setTimeout(() => {
      setLbIndex((prev) => (prev + dir + GALLERY.length) % GALLERY.length);
      setLbAnimating(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, navigate]);

  const onTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) return;
    touchRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      moved: false,
    };
  };

  const onTouchMove = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - touchRef.current.x;
    const dy = event.touches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      touchRef.current.moved = true;
    }
  };

  const onTouchEnd = (event: React.TouchEvent, inLightbox: boolean) => {
    if (!touchRef.current.moved) return;
    const dx = event.changedTouches[0].clientX - touchRef.current.x;
    if (Math.abs(dx) > 50) {
      const dir = dx < 0 ? 1 : -1;
      if (inLightbox) navigate(dir);
      else {
        goTo(index + dir);
        pause(6000);
      }
    }
    touchRef.current.moved = false;
  };

  return (
    <section
      ref={sectionRef}
      id="galeri"
      className="bg-offwhite px-5 py-14"
    >
      <Reveal>
        <div className="mb-6 text-center">
          <p className="mb-1 text-[11px] font-semibold tracking-[4px] text-sage-600 uppercase">
            Memories
          </p>
          <h3 className="font-greatvibes text-5xl text-sage-800">
            Our Gallery
          </h3>
          <div className="my-3 flex items-center justify-center gap-3 text-sage-400">
            <span className="h-px w-12 bg-sage-300/60" />
            <Icon name="camera" size={16} />
            <span className="h-px w-12 bg-sage-300/60" />
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="relative mb-3 aspect-5/6 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
          <img
            src={GALLERY[index].src}
            alt={GALLERY[index].caption}
            className={`viewer-img h-full w-full cursor-zoom-in object-cover ${
              fading ? "slide-out" : ""
            }`}
            loading="lazy"
            decoding="async"
            style={{ touchAction: "pan-y" }}
            onClick={() => openLightbox(index)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={(event) => onTouchEnd(event, false)}
          />
        </div>
      </Reveal>

      <div className="grid grid-cols-4 gap-2">
        {GALLERY.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Lihat foto ${i + 1}`}
            onClick={() => {
              goTo(i);
              pause(7000);
            }}
            onDoubleClick={() => openLightbox(i)}
            className={`gallery-thumb h-20 overflow-hidden rounded-lg ${
              i === index ? "active" : ""
            }`}
          >
            <img
              src={item.src}
              alt={item.caption}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      <div
        className={`lightbox ${lightbox ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!lightbox}
        onClick={closeLightbox}
      >
        <div className="lb-header" onClick={(event) => event.stopPropagation()}>
          <span className="lb-counter" />
          <button
            type="button"
            className="lb-close"
            onClick={closeLightbox}
            aria-label="Tutup galeri"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div
          className="lb-stage"
          onClick={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={(event) => onTouchEnd(event, true)}
        >
          <button
            type="button"
            className="lb-nav"
            onClick={() => navigate(-1)}
            aria-label="Foto sebelumnya"
          >
            <Icon name="left" size={20} />
          </button>
          <img
            src={GALLERY[lbIndex].src}
            alt={GALLERY[lbIndex].caption}
            className={lbAnimating ? "animating" : ""}
            decoding="async"
          />
          <button
            type="button"
            className="lb-nav"
            onClick={() => navigate(1)}
            aria-label="Foto berikutnya"
          >
            <Icon name="right" size={20} />
          </button>
        </div>
        <p className="lb-hint" />
      </div>
    </section>
  );
}