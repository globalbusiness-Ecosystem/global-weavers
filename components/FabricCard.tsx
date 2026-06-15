"use client";

import { useState } from "react";
import { Heart, Star, MapPin, Package } from "lucide-react";
import { PiPayButton } from "@/components/PiPayButton";

export type FabricGrade = "A" | "B" | "C";
export type FabricUnit  = "meter" | "roll" | "yard";

export type FabricDivision = "Clothing" | "Curtain" | "Upholstery" | "Carpet";

export interface Fabric {
  id:            string;
  name:          string;
  division?:     FabricDivision;
  type:          "Cotton" | "Silk" | "Linen" | "Wool" | "Synthetic" | "Luxury" | "Cultural" |
                 "Leather" | "Sheer" | "Blackout" | "Outdoor" | "Velvet";
  subtype?:      string;
  origin:        string;
  originFlag:    string;
  pricePerMeter: number;
  minOrder:      number;
  unit:          FabricUnit;
  grade:         FabricGrade;
  colors:        string[];
  imageUrl:      string;
  seller:        string;
  rating:        number;
  reviews:       number;
  inStock:       boolean;
  description:   string;
}

interface FabricCardProps {
  fabric:   Fabric;
  onBuy?:  (fabric: Fabric) => void;
  onView?: (fabric: Fabric) => void;
  compact?: boolean;
  isRTL?:  boolean;
}

const GRADE_CONFIG: Record<FabricGrade, { label: string; bg: string; color: string }> = {
  A: { label: "Grade A", bg: "rgba(196,98,45,0.9)",   color: "#fff" },
  B: { label: "Grade B", bg: "rgba(26,16,64,0.82)",   color: "#f5f0e8" },
  C: { label: "Grade C", bg: "rgba(107,93,74,0.82)",  color: "#f5f0e8" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  // Clothing
  Cotton:    { bg: "#4e8a63", text: "#fff" },
  Silk:      { bg: "#8b5679", text: "#fff" },
  Linen:     { bg: "#a07c2e", text: "#fff" },
  Wool:      { bg: "#7a4f2c", text: "#fff" },
  Synthetic: { bg: "#3d6296", text: "#fff" },
  Luxury:    { bg: "#7a3b8c", text: "#fff" },
  Cultural:  { bg: "#c4622d", text: "#fff" },
  // Curtain
  Sheer:     { bg: "#5b8fa8", text: "#fff" },
  Blackout:  { bg: "#2c3e50", text: "#fff" },
  Outdoor:   { bg: "#2e7d52", text: "#fff" },
  // Upholstery / shared
  Leather:   { bg: "#6b3a2a", text: "#fff" },
  Velvet:    { bg: "#5b2d7a", text: "#fff" },
  // Legacy alias
  Heritage:  { bg: "#c4622d", text: "#fff" },
};

export function FabricCard({
  fabric,
  onBuy,
  onView,
  compact = false,
  isRTL = false,
}: FabricCardProps) {
  const [liked, setLiked] = useState(false);
  const grade     = GRADE_CONFIG[fabric.grade];
  const typeStyle = TYPE_COLORS[fabric.type] ?? { bg: "#888", text: "#fff" };
  const imgHeight = compact ? 130 : 168;

  return (
    <article
      className="rounded-2xl overflow-hidden transition-transform active:scale-[0.97] cursor-pointer"
      style={{
        backgroundColor: "#fdfaf5",
        border: "1px solid #ddd4c0",
        boxShadow: "0 2px 14px rgba(26,16,64,0.07)",
      }}
      onClick={() => onView?.(fabric)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: imgHeight }}
      >
        <img
          src={fabric.imageUrl}
          alt={`${fabric.name} — ${fabric.type} from ${fabric.origin}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(26,16,64,0.52) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Grade badge — top left */}
        <span
          className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: grade.bg,
            color: grade.color,
            fontFamily: "var(--font-inter), sans-serif",
            backdropFilter: "blur(6px)",
          }}
        >
          {grade.label}
        </span>

        {/* Type chip — top, next to grade */}
        <span
          className="absolute top-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            left: isRTL ? "auto" : "calc(0.5rem + 3.5rem)",
            right: isRTL ? "calc(0.5rem + 3.5rem)" : "auto",
            backgroundColor: typeStyle.bg,
            color: typeStyle.text,
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {fabric.subtype ?? fabric.type}
        </span>

        {/* Wishlist button — top right */}
        <button
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
        >
          <Heart
            className="w-3 h-3"
            style={{
              color: liked ? "#e53e3e" : "#9c8f7e",
              fill: liked ? "#e53e3e" : "none",
            }}
          />
        </button>

        {/* Out-of-stock overlay */}
        {!fabric.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(26,16,64,0.6)" }}
          >
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(185,28,28,0.88)",
                color: "#fff",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {isRTL ? "نفذ المخزون" : "Out of Stock"}
            </span>
          </div>
        )}

        {/* Color swatches — bottom left */}
        <div
          className="absolute bottom-2 flex gap-1"
          style={{ [isRTL ? "right" : "left"]: "0.5rem" }}
          aria-hidden="true"
        >
          {fabric.colors.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full shadow-sm"
              style={{
                backgroundColor: c,
                border: "1.5px solid rgba(255,255,255,0.65)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="px-2.5 pt-2.5 pb-2.5" dir={isRTL ? "rtl" : "ltr"}>
        {/* Name */}
        <h3
          className="font-semibold leading-snug mb-1 text-balance line-clamp-2"
          style={{
            color: "#1a1040",
            fontFamily: "var(--font-serif), 'Playfair Display', serif",
            fontSize: compact ? "12px" : "13px",
            lineHeight: 1.35,
          }}
        >
          {fabric.name}
        </h3>

        {/* Division tag */}
        {fabric.division && (
          <span
            className="inline-block text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md mb-1"
            style={{
              backgroundColor: "#ede8de",
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {fabric.division}
          </span>
        )}

        {/* Origin */}
        <div className="flex items-center gap-1 mb-1">
          <MapPin
            className="w-2.5 h-2.5 flex-shrink-0"
            style={{ color: "#9c8f7e" }}
            aria-hidden="true"
          />
          <span
            className="text-[10px] truncate"
            style={{
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {fabric.originFlag} {fabric.origin}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          <Star
            className="w-2.5 h-2.5 fill-current flex-shrink-0"
            style={{ color: "#f59e0b" }}
            aria-hidden="true"
          />
          <span
            className="text-[10px] font-semibold"
            style={{
              color: "#1a1040",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {fabric.rating.toFixed(1)}
          </span>
          <span
            className="text-[10px]"
            style={{
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            ({fabric.reviews})
          </span>
        </div>

        {/* Price & min order */}
        <div className="flex items-end justify-between mb-2.5">
          <div className="leading-none">
            <span
              className="font-bold"
              style={{
                color: "#c4622d",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
                fontSize: compact ? "14px" : "16px",
              }}
            >
              π {fabric.pricePerMeter}
            </span>
            <span
              className="text-[10px] ml-0.5"
              style={{
                color: "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              /m
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Package
              className="w-2.5 h-2.5"
              style={{ color: "#9c8f7e" }}
              aria-hidden="true"
            />
            <span
              className="text-[10px]"
              style={{
                color: "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {isRTL ? `${fabric.minOrder}م` : `Min ${fabric.minOrder}m`}
            </span>
          </div>
        </div>

        {/* CTA buttons: Order + Pi Pay side by side */}
        <div className="flex gap-1.5">
          <button
            className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: fabric.inStock ? "#1a1040" : "#ede8de",
              color: fabric.inStock ? "#f5f0e8" : "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
              cursor: fabric.inStock ? "pointer" : "not-allowed",
            }}
            disabled={!fabric.inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (fabric.inStock) onBuy?.(fabric);
            }}
          >
            {fabric.inStock
              ? isRTL
                ? "طلب"
                : "Order"
              : isRTL
              ? "غير متوفر"
              : "Unavailable"}
          </button>

          {fabric.inStock && (
            <div
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <PiPayButton variant="card" isRTL={isRTL} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
