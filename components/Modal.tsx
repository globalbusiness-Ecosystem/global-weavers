"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  title?:   string;
  children: React.ReactNode;
  size?:    "sm" | "md" | "lg";
  isRTL?:  boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  isRTL = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Escape key handler */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxW =
    size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: "rgba(26,16,64,0.7)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`w-full ${maxW} rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-slide-up`}
        style={{
          backgroundColor: "#f5f0e8",
          maxHeight: "92dvh",
          boxShadow: "0 -12px 56px rgba(26,16,64,0.3)",
        }}
      >
        {/* Mobile drag handle */}
        <div
          className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0"
          aria-hidden="true"
        >
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "#ddd4c0" }}
          />
        </div>

        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
            style={{ borderBottom: "1px solid #ddd4c0" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{
                color: "#1a1040",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ backgroundColor: "#ede8de" }}
              aria-label={isRTL ? "إغلاق" : "Close"}
            >
              <X className="w-4 h-4" style={{ color: "#1a1040" }} />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
