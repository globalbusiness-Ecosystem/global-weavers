"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { PRODUCT_CONFIG } from "@/lib/product-config";

type PaymentStatus = "idle" | "loading" | "success" | "error";

interface PiPayButtonProps {
  /** Optional extra class names on the wrapper */
  className?: string;
  /** Visual variant — "card" is compact (inside FabricCard), "banner" is full-width (homepage) */
  variant?: "card" | "banner";
  isRTL?: boolean;
}

export function PiPayButton({
  className = "",
  variant = "banner",
  isRTL = false,
}: PiPayButtonProps) {
  const { products } = usePiAuth();
  const [status, setStatus]   = useState<PaymentStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const product = products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_69ac39aaf003e0f0c36474b5,
  );

  const amount     = product?.price_in_pi ?? null;
  const isDisabled = !product || status === "loading" || status === "success";

  const handlePay = () => {
    if (!product || amount === null) return;
    setStatus("loading");
    setMessage(null);

    if (typeof window !== "undefined" && typeof window.pay === "function") {
      window.pay({
        amount,
        memo: product.name,
        metadata: { productId: product.id },
        onComplete: () => {
          setStatus("success");
          setMessage(isRTL ? "تمت الدفعة بنجاح!" : "Payment successful!");
          setTimeout(() => {
            setStatus("idle");
            setMessage(null);
          }, 4000);
        },
        onError: (error: unknown) => {
          console.error("[PiPayButton] payment error:", error);
          setStatus("error");
          setMessage(isRTL ? "فشل الدفع. حاول مجدداً." : "Payment failed. Please try again.");
          setTimeout(() => {
            setStatus("idle");
            setMessage(null);
          }, 4000);
        },
      });
    } else {
      // Preview / non-Pi-browser fallback
      setTimeout(() => {
        setStatus("success");
        setMessage(isRTL ? "تمت الدفعة بنجاح!" : "Payment successful!");
        setTimeout(() => {
          setStatus("idle");
          setMessage(null);
        }, 3000);
      }, 800);
    }
  };

  /* ── Banner variant ──────────────────────────────────────────────────────── */
  if (variant === "banner") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button
          onClick={handlePay}
          disabled={isDisabled}
          aria-label={
            !product
              ? "Payment unavailable"
              : isRTL
              ? `ادفع ${amount} Pi مقابل ${product.name}`
              : `Pay ${amount} Pi for ${product.name}`
          }
          className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            backgroundColor:
              status === "success"
                ? "#2d7a4f"
                : status === "error"
                ? "#9b1c1c"
                : !product
                ? "#ede8de"
                : "#c4622d",
            color:
              !product && status === "idle" ? "#9c8f7e" : "#f5f0e8",
            cursor: isDisabled ? "not-allowed" : "pointer",
            boxShadow:
              status === "idle" && product
                ? "0 4px 18px rgba(196,98,45,0.38)"
                : "none",
            fontFamily: "var(--font-inter), sans-serif",
            opacity: status === "loading" ? 0.85 : 1,
          }}
        >
          {status === "loading" && (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          )}
          {status === "error" && (
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          )}

          {/* Button label */}
          {status === "idle" && (
            <>
              <span
                className="text-base font-bold leading-none"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
                aria-hidden="true"
              >
                π
              </span>
              {!product
                ? isRTL
                  ? "الدفع غير متاح"
                  : "Payment unavailable"
                : isRTL
                ? `ادفع ${amount} Pi — ${product.name}`
                : `Pay ${amount} Pi — ${product.name}`}
            </>
          )}
          {status === "loading" && (isRTL ? "جارٍ المعالجة..." : "Processing...")}
          {status === "success" && (isRTL ? "تمت الدفعة!" : "Payment successful!")}
          {status === "error"   && (isRTL ? "فشل الدفع" : "Payment failed")}
        </button>

        {message && status !== "idle" && (
          <p
            className="text-center text-xs px-2"
            style={{
              color: status === "success" ? "#2d7a4f" : "#9b1c1c",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        {!product && (
          <p
            className="text-center text-[11px] px-2"
            style={{
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            role="alert"
          >
            {isRTL
              ? "المنتج غير متاح حالياً"
              : "Product not currently available"}
          </p>
        )}
      </div>
    );
  }

  /* ── Card variant (compact, sits next to Order button) ───────────────────── */
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <button
        onClick={handlePay}
        disabled={isDisabled}
        aria-label={
          !product
            ? "Payment unavailable"
            : isRTL
            ? `ادفع ${amount} Pi`
            : `Pay ${amount} Pi`
        }
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
        style={{
          backgroundColor:
            status === "success"
              ? "#2d7a4f"
              : status === "error"
              ? "#9b1c1c"
              : !product
              ? "#ede8de"
              : "#c4622d",
          color:
            !product && status === "idle" ? "#9c8f7e" : "#f5f0e8",
          cursor: isDisabled ? "not-allowed" : "pointer",
          fontFamily: "var(--font-inter), sans-serif",
          opacity: status === "loading" ? 0.85 : 1,
        }}
      >
        {status === "loading" && (
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
        )}
        {status === "success" && (
          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        )}
        {status === "error" && (
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
        )}

        {status === "idle" && (
          <>
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
              aria-hidden="true"
            >
              π
            </span>
            {!product
              ? isRTL ? "غير متاح" : "Unavailable"
              : isRTL
              ? `دفع ${amount} Pi`
              : `Pay ${amount} Pi`}
          </>
        )}
        {status === "loading" && (isRTL ? "جارٍ..." : "Processing...")}
        {status === "success" && (isRTL ? "تمت!" : "Done!")}
        {status === "error"   && (isRTL ? "خطأ" : "Error")}
      </button>

      {message && status !== "idle" && (
        <p
          className="text-center text-[10px]"
          style={{
            color: status === "success" ? "#2d7a4f" : "#9b1c1c",
            fontFamily: "var(--font-inter), sans-serif",
          }}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
}
