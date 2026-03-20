"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import QRCode from "qrcode";
import Image from "next/image";
import { VCARD, VCARD_URL, QUOTE_URL } from "@/lib/card-constants";
import { Mail, Phone, Globe, Share2, FileText } from "lucide-react";

function useQRCode(url: string) {
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: "#0A1A2F", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then(setSrc);
  }, [url]);
  return src;
}

function useIsStandalone() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          (window.navigator as unknown as { standalone: boolean }).standalone)
    );
  }, []);
  return standalone;
}

export function BusinessCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const qrContact = useQRCode(VCARD_URL);
  const qrQuote = useQRCode(QUOTE_URL);
  const isStandalone = useIsStandalone();

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const rotateY = useMotionValue(0);
  const glowOpacity = useTransform(
    rotateY,
    [0, 70, 90, 110, 180],
    [0, 0, 1, 0, 0]
  );
  const glowShadow = useTransform(
    glowOpacity,
    (v) => `0 0 30px rgba(43, 182, 201, ${v * 0.35})`
  );

  const cardWidth = isStandalone
    ? "min(92vw, calc(75dvh * 1.7), 700px)"
    : "min(90vw, calc(55svh * 1.7), 600px)";

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-[2dvh] landscape:justify-center landscape:gap-[1.5dvh]"
      style={isStandalone ? { paddingTop: 0 } : undefined}
    >
      {/* Card container */}
      <div
        className="relative cursor-pointer"
        style={{
          perspective: 1200,
          width: cardWidth,
          aspectRatio: "17 / 10",
        }}
        onClick={flip}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            transformStyle: "preserve-3d",
            rotateY,
            boxShadow: glowShadow,
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ==================== FRONT FACE ==================== */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border border-gray-200 p-[5%] shadow-2xl shadow-black/20"
            style={{
              backfaceVisibility: "hidden",
              background: "#ffffff",
            }}
          >
            {/* Dot grid background texture */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(10, 26, 47, 0.04) 0.5px, transparent 0.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative flex h-full flex-col justify-between">
              {/* Top: Trinity logo + brand name */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  {/* Subtle glow behind logo */}
                  <div
                    className="absolute -inset-2 rounded-full blur-xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(43, 182, 201, 0.15) 0%, transparent 70%)",
                    }}
                  />
                  <Image
                    src="/trinity-logo.png"
                    alt="Trinity Remodeling"
                    width={40}
                    height={40}
                    className="relative h-[12%] w-auto"
                    style={{ minWidth: 28, minHeight: 28 }}
                  />
                </div>
                <div>
                  <h1 className="font-serif text-[clamp(13px,3.5vw,22px)] font-semibold leading-tight tracking-tight text-[#0A1A2F]">
                    Trinity Remodeling
                  </h1>
                  <p className="mt-0.5 text-[clamp(11px,2.5vw,16px)] text-[#4A5568]">
                    Nick Stephens
                  </p>
                  <p
                    className="mt-1 font-mono text-[clamp(6px,1.5vw,10px)] uppercase"
                    style={{ letterSpacing: "2px", color: "#2BB6C9" }}
                  >
                    Owner & General Contractor
                  </p>
                </div>
              </div>

              {/* Gradient separator line */}
              <div
                className="my-1 h-px w-full"
                style={{
                  background: "linear-gradient(to right, #2BB6C9, transparent)",
                  opacity: 0.3,
                }}
              />

              {/* Stats line */}
              <p
                className="text-[clamp(7px,1.8vw,11px)]"
                style={{ color: "#2BB6C9", letterSpacing: "1px" }}
              >
                500+ Projects · 15+ Years in DFW
              </p>

              {/* Contact info */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#4A5568]">
                  <Mail className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span>{VCARD.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#4A5568]">
                  <Phone className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span>{VCARD.phoneFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#4A5568]">
                  <Globe className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span
                    className="font-mono text-[clamp(10px,2.2vw,15px)] tracking-wide"
                    style={{ color: "#2BB6C9" }}
                  >
                    trinity-remodeling.com
                  </span>
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <div
              className="absolute bottom-1 right-2 text-[clamp(7px,1.5vw,10px)] font-medium"
              style={{ color: "rgba(43, 182, 201, 0.5)" }}
            >
              flip it
            </div>
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl px-[5%] shadow-2xl shadow-black/40"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #132D4A 0%, #0A1A2F 100%)",
            }}
          >
            {/* Dot grid background texture (matches front) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(43, 182, 201, 0.06) 0.5px, transparent 0.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Teal gradient bar */}
            <div
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
              style={{
                background: "linear-gradient(to right, #2BB6C9, #239AA9)",
              }}
            />

            {/* Compact logo */}
            <div className="relative mb-3 mt-4 flex items-center gap-2">
              <div className="rounded-md bg-white p-1">
                <Image
                  src="/trinity-logo.png"
                  alt="Trinity Remodeling"
                  width={24}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <span className="font-serif text-sm font-semibold text-[#F5F5F5]">
                Trinity Remodeling
              </span>
            </div>

            {/* Dual QR codes side by side */}
            <div className="relative flex w-full items-start justify-center gap-[8%]">
              {/* Save Contact QR */}
              <div className="flex w-[38%] flex-col items-center">
                {qrContact && (
                  <div className="rounded-xl bg-white p-1.5">
                    <img
                      src={qrContact}
                      alt="Scan to save contact"
                      className="w-full rounded-lg"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-[#2BB6C9]" />
                  <p className="text-[clamp(9px,2vw,13px)] font-semibold text-[#8899AA]">
                    Save Contact
                  </p>
                </div>
              </div>

              {/* Get a Quote QR */}
              <div className="flex w-[38%] flex-col items-center">
                {qrQuote && (
                  <div className="rounded-xl bg-white p-1.5">
                    <img
                      src={qrQuote}
                      alt="Scan to get a quote"
                      className="w-full rounded-lg"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#2BB6C9]" />
                  <p className="text-[clamp(9px,2vw,13px)] font-semibold text-[#8899AA]">
                    Get a Quote
                  </p>
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <div
              className="absolute bottom-1 right-2 text-[clamp(7px,1.5vw,10px)] font-medium"
              style={{ color: "rgba(43, 182, 201, 0.4)" }}
            >
              flip it
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand watermark — hidden in landscape to save space */}
      <p className="shrink-0 text-[11px] landscape:hidden" style={{ color: "rgba(136, 153, 170, 0.4)" }}>
        Trinity Remodeling
      </p>
    </div>
  );
}
