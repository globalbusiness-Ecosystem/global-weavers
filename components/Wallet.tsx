"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";

type TxType = "receive" | "send" | "purchase" | "sale";

interface Transaction {
  id:          string;
  type:        TxType;
  amount:      number;
  description: string;
  date:        string;
  status:      "completed" | "pending";
}

const TX_CONFIG: Record<
  TxType,
  {
    icon:  React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    bg:    string;
    sign:  "+" | "-";
  }
> = {
  receive:  { icon: ArrowDownLeft, color: "#15803d", bg: "rgba(21,128,61,0.12)",  sign: "+" },
  send:     { icon: ArrowUpRight,  color: "#b91c1c", bg: "rgba(185,28,28,0.1)",   sign: "-" },
  purchase: { icon: ShoppingCart,  color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  sign: "-" },
  sale:     { icon: Tag,           color: "#c4622d", bg: "rgba(196,98,45,0.12)",  sign: "+" },
};

const TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "sale",     amount: 125, description: "Cotton sale to @user_abc",      date: "Mar 5, 2024",  status: "completed" },
  { id: "t2", type: "purchase", amount: 225, description: "Mulberry Silk Dupioni",          date: "Feb 28, 2024", status: "completed" },
  { id: "t3", type: "sale",     amount: 144, description: "Linen roll to @fabric_co",       date: "Feb 25, 2024", status: "completed" },
  { id: "t4", type: "receive",  amount:  50, description: "Pi transfer from @pioneer",      date: "Feb 20, 2024", status: "completed" },
  { id: "t5", type: "purchase", amount: 192, description: "Merino Wool Fleece",             date: "Mar 4, 2024",  status: "pending"   },
  { id: "t6", type: "sale",     amount: 340, description: "Heritage silk to @luxury_brand", date: "Feb 15, 2024", status: "completed" },
];

interface WalletProps {
  isRTL?: boolean;
}

export function Wallet({ isRTL = false }: WalletProps) {
  const { userData } = usePiAuth();
  const [showAll,  setShowAll]  = useState(false);
  const [copied,   setCopied]   = useState(false);

  const balance     = userData?.credits_balance ?? 0;
  const username    = userData?.username ?? "Pioneer";
  const totalEarned = TRANSACTIONS
    .filter((t) => TX_CONFIG[t.type].sign === "+")
    .reduce((s, t) => s + t.amount, 0);
  const totalSpent  = TRANSACTIONS
    .filter((t) => TX_CONFIG[t.type].sign === "-" && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const displayTx = showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(`@${username}`).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col pb-8" dir={isRTL ? "rtl" : "ltr"}>

      {/* Balance card */}
      <div
        className="mx-4 mt-5 rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1040 0%, #2e1860 55%, #3d1840 100%)",
          boxShadow: "0 8px 32px rgba(26,16,64,0.28)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: "#c4622d" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: "#c9973a" }}
          aria-hidden="true"
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-1 relative">
          <p
            className="text-[10px] font-semibold tracking-widest uppercase"
            style={{
              color: "rgba(245,240,232,0.5)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {isRTL ? "رصيد Pi" : "Pi Balance"}
          </p>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(74,222,128,0.2)",
              color: "#4ade80",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {isRTL ? "نشط" : "Active"}
          </span>
        </div>

        {/* Balance figure */}
        <div className="flex items-baseline gap-2 mb-5 relative">
          <span
            className="text-4xl font-bold"
            style={{
              color: "#f5f0e8",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
            }}
          >
            π {balance.toLocaleString()}
          </span>
        </div>

        {/* Earned / Spent */}
        <div className="flex items-center gap-3 relative">
          <div
            className="flex-1 rounded-2xl p-3"
            style={{ backgroundColor: "rgba(245,240,232,0.07)" }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp
                className="w-3.5 h-3.5"
                style={{ color: "#4ade80" }}
                aria-hidden="true"
              />
              <span
                className="text-[11px]"
                style={{
                  color: "rgba(245,240,232,0.5)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? "مكتسب" : "Earned"}
              </span>
            </div>
            <p
              className="text-base font-bold"
              style={{
                color: "#4ade80",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
              }}
            >
              π {totalEarned}
            </p>
          </div>
          <div
            className="flex-1 rounded-2xl p-3"
            style={{ backgroundColor: "rgba(245,240,232,0.07)" }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingCart
                className="w-3.5 h-3.5"
                style={{ color: "#c4622d" }}
                aria-hidden="true"
              />
              <span
                className="text-[11px]"
                style={{
                  color: "rgba(245,240,232,0.5)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? "مُنفق" : "Spent"}
              </span>
            </div>
            <p
              className="text-base font-bold"
              style={{
                color: "#c4622d",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
              }}
            >
              π {totalSpent}
            </p>
          </div>
        </div>

        {/* Pi address row */}
        <div
          className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl relative"
          style={{ backgroundColor: "rgba(245,240,232,0.06)" }}
        >
          <span
            className="text-[10px] flex-1 truncate"
            style={{
              color: "rgba(245,240,232,0.4)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            @{username}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-medium transition-all active:scale-90"
            style={{ color: "rgba(245,240,232,0.45)" }}
            aria-label={copied ? "Copied" : "Copy address"}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Pi escrow notice */}
      <div
        className="mx-4 mt-3 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{
          backgroundColor: "rgba(196,98,45,0.07)",
          border: "1px solid rgba(196,98,45,0.18)",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 pi-glow"
          style={{ backgroundColor: "#c4622d" }}
          aria-hidden="true"
        >
          <span
            className="text-xs font-bold"
            style={{ color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
          >
            π
          </span>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "#6b5e4a", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {isRTL
            ? "تُعالَج المدفوعات بأمان عبر بلوكشين Pi. يُحتجز Pi في الضمان حتى تأكيد التسليم."
            : "Payments processed securely via Pi blockchain. Pi held in escrow until delivery is confirmed."}
        </p>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-4 flex gap-3">
        {[
          {
            label: isRTL ? "إرسال"   : "Send Pi",
            icon: ArrowUpRight,
            color: "#1a1040",
          },
          {
            label: isRTL ? "استقبال" : "Receive",
            icon: ArrowDownLeft,
            color: "#c4622d",
          },
          {
            label: isRTL ? "تحديث"   : "Refresh",
            icon: RefreshCw,
            color: "#0369a1",
          },
        ].map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all active:scale-95"
            style={{
              backgroundColor: "#fdfaf5",
              border: "1px solid #ddd4c0",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}1a` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: "#1a1040",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-base font-bold"
            style={{
              color: "#1a1040",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
            }}
          >
            {isRTL ? "المعاملات" : "Transactions"}
          </h3>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {showAll
              ? isRTL ? "عرض أقل" : "Show less"
              : isRTL ? "عرض الكل" : "View all"}
          </button>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #ddd4c0" }}
        >
          {displayTx.map((tx, i) => {
            const cfg  = TX_CONFIG[tx.type];
            const Icon = cfg.icon;
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom:
                    i < displayTx.length - 1 ? "1px solid #ddd4c0" : "none",
                  backgroundColor: "#fdfaf5",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{
                      color: "#1a1040",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {tx.description}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: "#9c8f7e",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {tx.date}
                    {tx.status === "pending" && (
                      <span
                        className={isRTL ? "mr-2" : "ml-2"}
                        style={{ color: "#b45309", fontWeight: 600 }}
                      >
                        · {isRTL ? "معلّق" : "Pending"}
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{
                    color: cfg.color,
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {cfg.sign}π {tx.amount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
