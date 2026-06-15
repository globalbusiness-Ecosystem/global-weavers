"use client";

import { useState } from "react";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Star,
  ArrowLeft,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

interface Order {
  id:          string;
  fabricName:  string;
  type:        string;
  origin:      string;
  quantity:    number;
  totalPi:     number;
  status:      OrderStatus;
  date:        string;
  imageUrl:    string;
  seller:      string;
  trackingId?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label:   string;
    labelAr: string;
    icon:    React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    color: string;
    bg:    string;
  }
> = {
  pending:   { label: "Pending",   labelAr: "معلّق",    icon: Clock,       color: "#b45309", bg: "rgba(180,83,9,0.1)" },
  confirmed: { label: "Confirmed", labelAr: "مؤكّد",   icon: CheckCircle, color: "#0369a1", bg: "rgba(3,105,161,0.1)" },
  shipped:   { label: "Shipped",   labelAr: "مُشحون",  icon: Truck,       color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  delivered: { label: "Delivered", labelAr: "مُسلَّم", icon: CheckCircle, color: "#15803d", bg: "rgba(21,128,61,0.1)" },
  cancelled: { label: "Cancelled", labelAr: "ملغى",    icon: XCircle,     color: "#b91c1c", bg: "rgba(185,28,28,0.1)" },
};

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    fabricName: "Egyptian Long-Staple Cotton",
    type: "Cotton", origin: "Egypt",
    quantity: 10, totalPi: 125,
    status: "shipped", date: "Mar 5, 2024",
    imageUrl: "/placeholder.svg?height=80&width=80",
    seller: "@cairo_weaver", trackingId: "TRK-4829X",
  },
  {
    id: "ORD-2024-002",
    fabricName: "Mulberry Silk Dupioni",
    type: "Silk", origin: "India",
    quantity: 5, totalPi: 225,
    status: "delivered", date: "Feb 28, 2024",
    imageUrl: "/placeholder.svg?height=80&width=80",
    seller: "@varanasi_silk",
  },
  {
    id: "ORD-2024-003",
    fabricName: "Belgian Linen Premium",
    type: "Linen", origin: "Belgium",
    quantity: 8, totalPi: 144,
    status: "pending", date: "Mar 6, 2024",
    imageUrl: "/placeholder.svg?height=80&width=80",
    seller: "@brussels_linen",
  },
  {
    id: "ORD-2024-004",
    fabricName: "New Zealand Merino Wool",
    type: "Wool", origin: "New Zealand",
    quantity: 6, totalPi: 192,
    status: "confirmed", date: "Mar 4, 2024",
    imageUrl: "/placeholder.svg?height=80&width=80",
    seller: "@nz_merino",
  },
];

type TabFilter = "all" | "active" | "delivered";

interface OrdersProps {
  isRTL?: boolean;
}

export function Orders({ isRTL = false }: OrdersProps) {
  const [activeFilter,  setActiveFilter]  = useState<TabFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = SAMPLE_ORDERS.filter((o) => {
    if (activeFilter === "active")
      return ["pending", "confirmed", "shipped"].includes(o.status);
    if (activeFilter === "delivered") return o.status === "delivered";
    return true;
  });

  const filters: {
    id: TabFilter;
    label: string;
    labelAr: string;
    count: number;
  }[] = [
    { id: "all",       label: "All",       labelAr: "الكل",      count: SAMPLE_ORDERS.length },
    { id: "active",    label: "Active",    labelAr: "نشطة",      count: SAMPLE_ORDERS.filter((o) => ["pending","confirmed","shipped"].includes(o.status)).length },
    { id: "delivered", label: "Delivered", labelAr: "مُسلَّمة", count: SAMPLE_ORDERS.filter((o) => o.status === "delivered").length },
  ];

  // ── Order detail view ──────────────────────────────────────────────────────
  if (selectedOrder) {
    const cfg        = STATUS_CONFIG[selectedOrder.status];
    const StatusIcon = cfg.icon;

    const steps: { key: OrderStatus; label: string; labelAr: string }[] = [
      { key: "pending",   label: "Placed",    labelAr: "تم الطلب" },
      { key: "confirmed", label: "Confirmed", labelAr: "مؤكّد" },
      { key: "shipped",   label: "Shipped",   labelAr: "مُشحون" },
      { key: "delivered", label: "Delivered", labelAr: "مُسلَّم" },
    ];
    const activeStep = steps.findIndex((s) => s.key === selectedOrder.status);

    return (
      <div className="flex flex-col min-h-full animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
        {/* Back header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid #ddd4c0" }}
        >
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-1.5 text-sm font-medium transition-all active:scale-95"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
            aria-label={isRTL ? "رجوع" : "Go back"}
          >
            <ArrowLeft
              className="w-4 h-4"
              style={{ transform: isRTL ? "rotate(180deg)" : "none" }}
            />
            {isRTL ? "رجوع" : "Back"}
          </button>
          <h2
            className="text-base font-semibold"
            style={{
              color: "#1a1040",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
            }}
          >
            {selectedOrder.id}
          </h2>
        </div>

        <div className="p-4 flex flex-col gap-4 pb-8">
          {/* Status banner */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: cfg.bg }}
          >
            <StatusIcon
              className="w-6 h-6 flex-shrink-0"
              style={{ color: cfg.color }}
            />
            <div>
              <p
                className="text-sm font-bold"
                style={{
                  color: cfg.color,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? cfg.labelAr : cfg.label}
              </p>
              {selectedOrder.trackingId && (
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: cfg.color,
                    fontFamily: "var(--font-inter), sans-serif",
                    opacity: 0.8,
                  }}
                >
                  {isRTL ? "رقم التتبع:" : "Tracking:"}{" "}
                  {selectedOrder.trackingId}
                </p>
              )}
            </div>
          </div>

          {/* Progress tracker */}
          {selectedOrder.status !== "cancelled" && (
            <div className="flex items-center justify-between px-1">
              {steps.map((step, i) => {
                const done    = i <= activeStep;
                const current = i === activeStep;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    {i < steps.length - 1 && (
                      <div
                        className="absolute top-3.5 h-0.5"
                        style={{
                          left: "50%",
                          right: "-50%",
                          backgroundColor: i < activeStep ? "#c4622d" : "#ddd4c0",
                          zIndex: 0,
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 relative"
                      style={{
                        backgroundColor: done ? "#c4622d" : "#ede8de",
                        color: done ? "#f5f0e8" : "#9c8f7e",
                        border: current
                          ? "2px solid #c4622d"
                          : "2px solid transparent",
                        boxShadow: current
                          ? "0 0 0 3px rgba(196,98,45,0.2)"
                          : "none",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className="text-[9px] mt-1 text-center leading-tight"
                      style={{
                        color: done ? "#1a1040" : "#9c8f7e",
                        fontFamily: "var(--font-inter), sans-serif",
                        maxWidth: 48,
                      }}
                    >
                      {isRTL ? step.labelAr : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fabric info */}
          <div
            className="flex gap-3 p-4 rounded-2xl"
            style={{
              backgroundColor: "#fdfaf5",
              border: "1px solid #ddd4c0",
            }}
          >
            <img
              src={selectedOrder.imageUrl}
              alt={selectedOrder.fabricName}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3
                className="font-bold text-base mb-1"
                style={{
                  color: "#1a1040",
                  fontFamily: "var(--font-serif), 'Playfair Display', serif",
                }}
              >
                {selectedOrder.fabricName}
              </h3>
              <p
                className="text-sm mb-1"
                style={{
                  color: "#9c8f7e",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {selectedOrder.type} · {selectedOrder.origin}
              </p>
              <p
                className="text-sm"
                style={{
                  color: "#9c8f7e",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? "البائع:" : "Seller:"} {selectedOrder.seller}
              </p>
            </div>
          </div>

          {/* Order details table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #ddd4c0" }}
          >
            {[
              {
                label: isRTL ? "الكمية" : "Quantity",
                value: `${selectedOrder.quantity} meters`,
              },
              {
                label: isRTL ? "الإجمالي المدفوع" : "Total Paid",
                value: `π ${selectedOrder.totalPi}`,
                highlight: true,
              },
              {
                label: isRTL ? "تاريخ الطلب" : "Order Date",
                value: selectedOrder.date,
              },
              {
                label: isRTL ? "رقم الطلب" : "Order ID",
                value: selectedOrder.id,
              },
            ].map(({ label, value, highlight }, i, arr) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #ddd4c0" : "none",
                  backgroundColor: "#fdfaf5",
                }}
              >
                <span
                  className="text-sm"
                  style={{
                    color: "#9c8f7e",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {label}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: highlight ? "#c4622d" : "#1a1040",
                    fontFamily: highlight
                      ? "var(--font-serif), 'Playfair Display', serif"
                      : "var(--font-inter), sans-serif",
                    fontSize: highlight ? "15px" : "14px",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Leave review CTA */}
          {selectedOrder.status === "delivered" && (
            <button
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                backgroundColor: "rgba(245,158,11,0.1)",
                color: "#92400e",
                fontFamily: "var(--font-inter), sans-serif",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              <Star
                className="w-4 h-4 fill-current"
                style={{ color: "#f59e0b" }}
              />
              {isRTL ? "اترك تقييماً" : "Leave a Review"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Order list ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2
          className="text-2xl font-bold mb-1"
          style={{
            color: "#1a1040",
            fontFamily: "var(--font-serif), 'Playfair Display', serif",
          }}
        >
          {isRTL ? "طلباتي" : "My Orders"}
        </h2>
        <p
          className="text-sm"
          style={{
            color: "#9c8f7e",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {SAMPLE_ORDERS.length} {isRTL ? "طلبات" : "orders total"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5"
            style={{
              backgroundColor:
                activeFilter === f.id ? "#1a1040" : "#ede8de",
              color:
                activeFilter === f.id ? "#f5f0e8" : "#7a6e5e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            aria-pressed={activeFilter === f.id}
          >
            {isRTL ? f.labelAr : f.label}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  activeFilter === f.id
                    ? "rgba(245,240,232,0.18)"
                    : "rgba(26,16,64,0.08)",
                color: activeFilter === f.id ? "#f5f0e8" : "#9c8f7e",
              }}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-3 px-4 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Package
              className="w-12 h-12"
              style={{ color: "#9c8f7e" }}
              aria-hidden="true"
            />
            <p
              className="text-base font-semibold"
              style={{
                color: "#1a1040",
                fontFamily: "var(--font-serif), 'Playfair Display', serif",
              }}
            >
              {isRTL ? "لا توجد طلبات" : "No orders found"}
            </p>
            <p
              className="text-sm text-center"
              style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL
                ? "تصفح الأقمشة لتضع طلبك الأول"
                : "Browse fabrics to place your first order"}
            </p>
          </div>
        ) : (
          filtered.map((order) => {
            const cfg        = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            return (
              <button
                key={order.id}
                className="w-full rounded-2xl p-3 flex items-center gap-3 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: "#fdfaf5",
                  border: "1px solid #ddd4c0",
                  boxShadow: "0 2px 8px rgba(26,16,64,0.05)",
                  textAlign: isRTL ? "right" : "left",
                }}
                onClick={() => setSelectedOrder(order)}
              >
                <img
                  src={order.imageUrl}
                  alt={order.fabricName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-sm truncate mb-0.5"
                    style={{
                      color: "#1a1040",
                      fontFamily: "var(--font-serif), 'Playfair Display', serif",
                    }}
                  >
                    {order.fabricName}
                  </h3>
                  <p
                    className="text-xs mb-1.5"
                    style={{
                      color: "#9c8f7e",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {order.quantity}m · π {order.totalPi} · {order.date}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {isRTL ? cfg.labelAr : cfg.label}
                  </span>
                </div>
                <ChevronRight
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    color: "#9c8f7e",
                    transform: isRTL ? "rotate(180deg)" : "none",
                  }}
                  aria-hidden="true"
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
