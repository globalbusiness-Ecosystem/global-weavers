"use client";

import { Home, Search, PlusCircle, ShoppingBag, Wallet } from "lucide-react";
import type React from "react";

export type TabId = "home" | "browse" | "sell" | "orders" | "wallet";

interface NavItem {
  id:      TabId;
  label:   string;
  labelAr: string;
  icon:    React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",   label: "Home",   labelAr: "الرئيسية", icon: Home },
  { id: "browse", label: "Browse", labelAr: "تصفح",    icon: Search },
  { id: "sell",   label: "Sell",   labelAr: "بيع",     icon: PlusCircle },
  { id: "orders", label: "Orders", labelAr: "طلباتي",  icon: ShoppingBag },
  { id: "wallet", label: "Wallet", labelAr: "المحفظة", icon: Wallet },
];

interface BottomNavProps {
  activeTab:   TabId;
  onTabChange: (tab: TabId) => void;
  isRTL?:      boolean;
  orderBadge?: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  isRTL = false,
  orderBadge = 0,
}: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 z-40"
      style={{
        backgroundColor: "#1a1040",
        borderTop: "1px solid rgba(245,240,232,0.07)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
      }}
      aria-label={isRTL ? "التنقل الرئيسي" : "Main navigation"}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isSell   = item.id === "sell";
          const Icon     = item.icon;
          const hasBadge = item.id === "orders" && orderBadge > 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-90 relative"
              aria-label={isRTL ? item.labelAr : item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active top indicator bar */}
              {isActive && !isSell && (
                <span
                  className="absolute top-0 inset-x-3 h-[2.5px] rounded-b-full"
                  style={{ backgroundColor: "#c4622d" }}
                  aria-hidden="true"
                />
              )}

              {isSell ? (
                /* Elevated sell button */
                <div
                  className="flex flex-col items-center gap-1 -mt-4"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: isActive
                        ? "linear-gradient(140deg, #d4732d 0%, #a0451b 100%)"
                        : "linear-gradient(140deg, #c4622d 0%, #8f3a12 100%)",
                      boxShadow: "0 4px 18px rgba(196,98,45,0.55)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" style={{ color: "#f5f0e8" }} />
                  </div>
                  <span
                    className="text-[9px] font-semibold"
                    style={{
                      color: isActive ? "#c4622d" : "rgba(245,240,232,0.38)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {isRTL ? item.labelAr : item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: isActive ? "#c4622d" : "rgba(245,240,232,0.32)",
                      }}
                    />
                    {hasBadge && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{
                          backgroundColor: "#c4622d",
                          color: "#f5f0e8",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                        aria-label={`${orderBadge} new orders`}
                      >
                        {orderBadge > 9 ? "9+" : orderBadge}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive ? "#c4622d" : "rgba(245,240,232,0.32)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {isRTL ? item.labelAr : item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
