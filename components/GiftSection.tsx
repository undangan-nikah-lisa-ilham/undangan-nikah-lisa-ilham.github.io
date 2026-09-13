"use client";

import { useRef, useState } from "react";
import { BANKS, GIFT_ADDRESS } from "@/lib/data";
import { copyToClipboard } from "@/lib/format";
import { Icon } from "@/components/icons";
import Reveal from "@/components/Reveal";

type Props = {
  showToast: (message: string) => void;
};

export default function GiftSection({ showToast }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  };

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) {
      showToast("Gagal menyalin, silakan salin manual");
      return;
    }
    setCopied(key);
    showToast("Tersalin ke clipboard!");
    window.setTimeout(
      () => setCopied((current) => (current === key ? null : current)),
      1800,
    );
  };

  return (
    <section
      id="hadiah"
      ref={sectionRef}
      className="bg-ivory px-5 py-12 text-center"
    >
      <Reveal>
        <p className="mb-1 text-xs font-semibold tracking-[4px] text-sage-600 uppercase">
          Tanda Kasih
        </p>
        <h3 className="font-greatvibes mb-3 text-5xl text-sage-800">
          Wedding Gift
        </h3>
        <p className="mx-auto max-w-xs text-xs leading-relaxed text-sage-600">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun
          jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado
          secara cashless.
        </p>
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={open}
          className="btn-sage mt-5 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-xs font-medium tracking-wider uppercase shadow-lg transition-transform duration-150 active:scale-95 touch-manipulation"
          style={{ touchAction: "manipulation" }}
        >
          <Icon name="gift" size={15} />
          <span>{open ? "Tutup" : "Klik di sini"}</span>
          <Icon
            name="chevron-down"
            size={13}
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </Reveal>

      <div className={`gift-collapse mt-5 text-left ${open ? "open" : ""}`}>
        <div>
          <div className="space-y-3 pt-1">
            {BANKS.map((bank) => {
              const key = `bank-${bank.number}`;
              const isCopied = copied === key;
              return (
                <div
                  key={bank.number}
                  className={`gift-bank-card glass-card rounded-2xl border border-sage-200 p-4 shadow-lg ${isCopied ? "copied" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-sage-800">
                        {bank.holder}
                      </p>
                      <p className="mt-1 font-mono text-sm tracking-wider text-sage-600">
                        {bank.number}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${bank.badgeClass}`}
                    >
                      {bank.bank}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bank.number, key)}
                    className="btn-sage mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs active:scale-95"
                  >
                    <Icon name={isCopied ? "check" : "copy"} size={13} />
                    <span>{isCopied ? "Tersalin!" : "Salin"}</span>
                  </button>
                </div>
              );
            })}

            <div
              className={`gift-bank-card glass-card rounded-2xl border border-sage-200 p-4 shadow-lg ${copied === "address" ? "copied" : ""}`}
            >
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-sage-800">
                <Icon name="gift" size={14} className="text-sage" />
                {GIFT_ADDRESS.label}
              </p>
              <p className="text-xs leading-relaxed text-sage-600">
                {GIFT_ADDRESS.detail}
              </p>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${GIFT_ADDRESS.receiver} — ${GIFT_ADDRESS.detail}`,
                    "address",
                  )
                }
                className="btn-sage mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs active:scale-95"
              >
                <Icon
                  name={copied === "address" ? "check" : "copy"}
                  size={13}
                />
                <span>
                  {copied === "address" ? "Tersalin!" : "Salin Alamat"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}