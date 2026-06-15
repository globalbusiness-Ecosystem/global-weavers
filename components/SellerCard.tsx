"use client";

import { Star, ShoppingBag, MapPin, BadgeCheck, Clock, ArrowRight } from "lucide-react";

export interface Seller {
  id:            string;
  username:      string;
  displayName:   string;
  country:       string;
  countryFlag:   string;
  avatar:        string;
  rating:        number;
  totalSales:    number;
  totalListings: number;
  specialties:   string[];
  verified:      boolean;
  memberSince:   string;
  responseTime:  string;
}

interface SellerCardProps {
  seller:   Seller;
  onVisit?: (seller: Seller) => void;
  isRTL?:  boolean;
}

export function SellerCard({
  seller,
  onVisit,
  isRTL = false,
}: SellerCardProps) {
  return (
    <article
      className="rounded-2xl p-3.5 flex items-center gap-3 transition-all active:scale-[0.97] cursor-pointer"
      style={{
        backgroundColor: "#fdfaf5",
        border: "1px solid #ddd4c0",
        boxShadow: "0 2px 10px rgba(26,16,64,0.05)",
      }}
      onClick={() => onVisit?.(seller)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Avatar + verified */}
      <div className="relative flex-shrink-0">
        <img
          src={seller.avatar}
          alt={seller.displayName}
          className="w-12 h-12 rounded-xl object-cover"
          style={{ border: "2px solid #ddd4c0" }}
          loading="lazy"
        />
        {seller.verified && (
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#1a1040",
              border: "1.5px solid #f5f0e8",
            }}
            aria-label="Verified seller"
          >
            <BadgeCheck className="w-3 h-3" style={{ color: "#c4622d" }} />
          </span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-sm leading-tight truncate mb-0.5"
          style={{
            color: "#1a1040",
            fontFamily: "var(--font-serif), 'Playfair Display', serif",
          }}
        >
          {seller.displayName}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <MapPin
            className="w-2.5 h-2.5 flex-shrink-0"
            style={{ color: "#9c8f7e" }}
            aria-hidden="true"
          />
          <span
            className="text-[11px] truncate"
            style={{
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {seller.countryFlag} {seller.country}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star
              className="w-2.5 h-2.5 fill-current"
              style={{ color: "#f59e0b" }}
              aria-hidden="true"
            />
            <span
              className="text-[11px] font-semibold"
              style={{
                color: "#1a1040",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {seller.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag
              className="w-2.5 h-2.5"
              style={{ color: "#9c8f7e" }}
              aria-hidden="true"
            />
            <span
              className="text-[11px]"
              style={{
                color: "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {seller.totalSales.toLocaleString()} {isRTL ? "بيعة" : "sales"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock
              className="w-2.5 h-2.5"
              style={{ color: "#9c8f7e" }}
              aria-hidden="true"
            />
            <span
              className="text-[11px]"
              style={{
                color: "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {seller.responseTime}
            </span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1 justify-end max-w-[88px]">
          {seller.specialties.slice(0, 2).map((s) => (
            <span
              key={s}
              className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{
                backgroundColor: "rgba(196,98,45,0.1)",
                color: "#c4622d",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* View button */}
        <button
          className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95"
          style={{
            backgroundColor: "#1a1040",
            color: "#f5f0e8",
            fontFamily: "var(--font-inter), sans-serif",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onVisit?.(seller);
          }}
          aria-label={`${isRTL ? "عرض متجر" : "View shop of"} ${seller.displayName}`}
        >
          {isRTL ? "عرض" : "View"}
          <ArrowRight
            className="w-3 h-3"
            style={{ transform: isRTL ? "rotate(180deg)" : "none" }}
          />
        </button>
      </div>
    </article>
  );
}
