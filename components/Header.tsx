"use client";

import { useState } from "react";
import { X, Menu, Settings, ChevronRight, Sun, Moon, Monitor, Bell, Info } from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";

interface HeaderProps {
  onSearch?:    () => void;
  isRTL?:       boolean;
  onToggleRTL?: () => void;
  notifCount?:  number;
  onCategorySelect?: (division: string) => void;
}

// ── Sidebar nav items ──────────────────────────────────────────────────────────
const SIDEBAR_DIVISIONS = [
  { id: "Clothing",   label: "Clothing",   labelAr: "ملابس",      icon: "✦" },
  { id: "Curtain",    label: "Curtains",   labelAr: "ستائر",      icon: "◻" },
  { id: "Upholstery", label: "Upholstery", labelAr: "أثاث منجد",  icon: "◼" },
  { id: "Carpet",     label: "Carpets",    labelAr: "سجاد",       icon: "◉" },
];
const SIDEBAR_MATERIALS = [
  { id: "Silk",      label: "Silk",      labelAr: "حرير",  color: "#8b5679" },
  { id: "Cotton",    label: "Cotton",    labelAr: "قطن",   color: "#4e8a63" },
  { id: "Wool",      label: "Wool",      labelAr: "صوف",   color: "#7a4f2c" },
  { id: "Linen",     label: "Linen",     labelAr: "كتان",  color: "#a07c2e" },
  { id: "Synthetic", label: "Synthetic", labelAr: "صناعي", color: "#3d6296" },
];

export function Header({
  isRTL = false,
  onToggleRTL,
  notifCount = 0,
  onCategorySelect,
}: HeaderProps) {
  const { userData } = usePiAuth();
  const username = userData?.username ?? "Pioneer";

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings state
  const [theme,         setTheme]         = useState<"light" | "dark" | "auto">("auto");
  const [notifEnabled,  setNotifEnabled]  = useState(true);

  const handleDivisionClick = (divId: string) => {
    onCategorySelect?.(divId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* ── Fixed header bar ────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          backgroundColor: "#1a1040",
          borderBottom: "1px solid rgba(245,240,232,0.07)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Main row — three-column grid: icon | center | icon */}
        <div className="grid grid-cols-3 items-center px-4 h-14">

          {/* LEFT — Hamburger */}
          <div className={isRTL ? "flex justify-end" : "flex justify-start"}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{ backgroundColor: "rgba(245,240,232,0.08)" }}
              aria-label={isRTL ? "قائمة التنقل" : "Open navigation menu"}
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-4 h-4" style={{ color: "rgba(245,240,232,0.75)" }} />
            </button>
          </div>

          {/* CENTER — Logo + domain */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5">
              {/* Woven-grid logomark */}
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#c4622d", boxShadow: "0 2px 8px rgba(196,98,45,0.45)" }}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1"  y="1"  width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                  <rect x="9.5" y="1"  width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                  <rect x="1"  y="9.5" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                  <rect x="9.5" y="9.5" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.45)" />
                  <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.8)" />
                </svg>
              </div>
              <p
                className="text-[15px] font-bold leading-none tracking-tight"
                style={{
                  color: "#f5f0e8",
                  fontFamily: "var(--font-serif), 'Playfair Display', serif",
                }}
              >
                {isRTL ? "النساجون العالميون" : "GlobalWeavers"}
              </p>
            </div>
            <p
              className="text-[9px] tracking-[0.12em] mt-0.5 leading-none"
              style={{
                color: "rgba(245,240,232,0.35)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              globalweavers.pi
            </p>
          </div>

          {/* RIGHT — Settings gear */}
          <div className={isRTL ? "flex justify-start" : "flex justify-end"}>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 relative"
              style={{ backgroundColor: "rgba(245,240,232,0.08)" }}
              aria-label={isRTL ? "الإعدادات" : "Open settings"}
              aria-expanded={settingsOpen}
            >
              <Settings className="w-4 h-4" style={{ color: "rgba(245,240,232,0.75)" }} />
              {notifCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#c4622d", border: "1.5px solid #1a1040" }}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>

        {/* Connected to Pi Network status bar */}
        <div
          className="flex items-center gap-2 px-4 pb-2.5"
          style={{ borderTop: "1px solid rgba(245,240,232,0.04)" }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#4ade80" }}
            aria-hidden="true"
          />
          <span
            className="text-[10px]"
            style={{
              color: "rgba(245,240,232,0.32)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {isRTL ? "متصل بشبكة Pi" : "Connected to Pi Network"}
          </span>
          <span
            className={`${isRTL ? "mr-auto" : "ml-auto"} text-[10px] font-semibold`}
            style={{
              color: "#c9973a",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            @{username}
          </span>
        </div>
      </header>

      {/* ── Sidebar overlay ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            className="relative flex flex-col z-10 overflow-y-auto"
            style={{
              width: 272,
              backgroundColor: "#130d30",
              borderRight: "1px solid rgba(245,240,232,0.08)",
              [isRTL ? "marginLeft" : "marginRight"]: "auto",
            }}
            aria-label={isRTL ? "قائمة التنقل" : "Navigation drawer"}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 h-14 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(245,240,232,0.07)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#c4622d" }}
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="1"   y="1"   width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                    <rect x="9.5" y="1"   width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                    <rect x="1"   y="9.5" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.95)" />
                    <rect x="9.5" y="9.5" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.45)" />
                    <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.7" fill="rgba(245,240,232,0.8)" />
                  </svg>
                </div>
                <span
                  className="text-[14px] font-bold"
                  style={{
                    color: "#f5f0e8",
                    fontFamily: "var(--font-serif), 'Playfair Display', serif",
                  }}
                >
                  {isRTL ? "النساجون العالميون" : "GlobalWeavers"}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ backgroundColor: "rgba(245,240,232,0.06)" }}
                aria-label={isRTL ? "إغلاق القائمة" : "Close menu"}
              >
                <X className="w-3.5 h-3.5" style={{ color: "rgba(245,240,232,0.5)" }} />
              </button>
            </div>

            {/* Divisions section */}
            <div className="px-4 pt-5 pb-2">
              <p
                className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3"
                style={{
                  color: "rgba(245,240,232,0.3)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? "الأقسام" : "Divisions"}
              </p>
              <nav aria-label={isRTL ? "أقسام المنسوجات" : "Fabric divisions"}>
                {SIDEBAR_DIVISIONS.map((div) => (
                  <button
                    key={div.id}
                    onClick={() => handleDivisionClick(div.id)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl mb-1 transition-all active:scale-98 group"
                    style={{ backgroundColor: "rgba(245,240,232,0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "rgba(196,98,45,0.18)", color: "#c4622d" }}
                        aria-hidden="true"
                      >
                        {div.icon}
                      </span>
                      <span
                        className="text-[13px] font-semibold"
                        style={{
                          color: "#f5f0e8",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {isRTL ? div.labelAr : div.label}
                      </span>
                    </div>
                    <ChevronRight
                      className="w-3.5 h-3.5 opacity-30"
                      style={{ color: "#f5f0e8", transform: isRTL ? "scaleX(-1)" : undefined }}
                    />
                  </button>
                ))}
              </nav>
            </div>

            {/* Divider */}
            <div
              className="mx-4 my-1"
              style={{ borderTop: "1px solid rgba(245,240,232,0.07)" }}
              aria-hidden="true"
            />

            {/* Materials section */}
            <div className="px-4 pt-3 pb-5">
              <p
                className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3"
                style={{
                  color: "rgba(245,240,232,0.3)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isRTL ? "المواد" : "Materials"}
              </p>
              <nav aria-label={isRTL ? "أنواع الأقمشة" : "Fabric materials"}>
                {SIDEBAR_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => handleDivisionClick(mat.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 transition-all active:scale-98"
                    style={{ backgroundColor: "rgba(245,240,232,0.04)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: mat.color }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[13px] font-medium"
                        style={{
                          color: "rgba(245,240,232,0.8)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {isRTL ? mat.labelAr : mat.label}
                      </span>
                    </div>
                    <ChevronRight
                      className="w-3 h-3 opacity-25"
                      style={{ color: "#f5f0e8", transform: isRTL ? "scaleX(-1)" : undefined }}
                    />
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom user row */}
            <div
              className="mt-auto px-5 py-4 flex items-center gap-3"
              style={{ borderTop: "1px solid rgba(245,240,232,0.07)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: "#c4622d", color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
                aria-hidden="true"
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className="text-[12px] font-semibold truncate"
                  style={{ color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  @{username}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "rgba(245,240,232,0.35)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Pi Network
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Settings panel overlay ───────────────────────────────────────────── */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={() => setSettingsOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <div
            className="relative z-10 w-full overflow-y-auto"
            style={{
              backgroundColor: "#1a1040",
              borderRadius: "20px 20px 0 0",
              maxHeight: "88dvh",
              border: "1px solid rgba(245,240,232,0.1)",
              borderBottom: "none",
            }}
            role="dialog"
            aria-label={isRTL ? "الإعدادات" : "Settings"}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: "rgba(245,240,232,0.15)" }}
                aria-hidden="true"
              />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2">
              <div>
                <h2
                  className="text-[17px] font-bold leading-tight"
                  style={{
                    color: "#f5f0e8",
                    fontFamily: "var(--font-serif), 'Playfair Display', serif",
                  }}
                >
                  {isRTL ? "الإعدادات" : "Settings"}
                </h2>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "rgba(245,240,232,0.35)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  GlobalWeavers v1.0 · Pi Network
                </p>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(245,240,232,0.08)" }}
                aria-label={isRTL ? "إغلاق" : "Close settings"}
              >
                <X className="w-3.5 h-3.5" style={{ color: "rgba(245,240,232,0.55)" }} />
              </button>
            </div>

            <div className="px-4 pb-10 flex flex-col gap-3">

              {/* Theme */}
              <SettingsSection label={isRTL ? "المظهر" : "Theme"}>
                <div className="flex gap-2">
                  {([
                    { id: "light", label: isRTL ? "فاتح" : "Light",  icon: Sun },
                    { id: "dark",  label: isRTL ? "داكن" : "Dark",   icon: Moon },
                    { id: "auto",  label: isRTL ? "تلقائي" : "Auto", icon: Monitor },
                  ] as const).map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95"
                      style={{
                        backgroundColor: theme === id ? "rgba(196,98,45,0.2)" : "rgba(245,240,232,0.06)",
                        border: theme === id ? "1.5px solid rgba(196,98,45,0.5)" : "1.5px solid transparent",
                      }}
                      aria-pressed={theme === id}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: theme === id ? "#c4622d" : "rgba(245,240,232,0.45)" }}
                      />
                      <span
                        className="text-[11px] font-semibold"
                        style={{
                          color: theme === id ? "#c4622d" : "rgba(245,240,232,0.5)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </SettingsSection>

              {/* Language */}
              <SettingsSection label={isRTL ? "اللغة" : "Language"}>
                <div className="flex gap-2">
                  {([
                    { id: "en", label: "English" },
                    { id: "ar", label: "العربية" },
                  ]).map(({ id, label }) => {
                    const active = id === "ar" ? isRTL : !isRTL;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          if ((id === "ar") !== isRTL) onToggleRTL?.();
                        }}
                        className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all active:scale-95"
                        style={{
                          backgroundColor: active ? "rgba(196,98,45,0.2)" : "rgba(245,240,232,0.06)",
                          border: active ? "1.5px solid rgba(196,98,45,0.5)" : "1.5px solid transparent",
                          color: active ? "#c4622d" : "rgba(245,240,232,0.5)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                        aria-pressed={active}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </SettingsSection>

              {/* Currency */}
              <SettingsSection label={isRTL ? "العملة" : "Currency"}>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(245,240,232,0.06)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: "#c4622d", color: "#f5f0e8" }}
                      aria-hidden="true"
                    >
                      π
                    </div>
                    <div>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {isRTL ? "شبكة Pi" : "Pi Network"}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "rgba(245,240,232,0.35)", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {isRTL ? "العملة الرسمية" : "Official currency"}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(74,222,128,0.15)", color: "#4ade80" }}
                  >
                    {isRTL ? "مُفعَّل" : "Active"}
                  </span>
                </div>
              </SettingsSection>

              {/* Notifications */}
              <SettingsSection label={isRTL ? "الإشعارات" : "Notifications"}>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(245,240,232,0.06)" }}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" style={{ color: "rgba(245,240,232,0.45)" }} />
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {isRTL ? "إشعارات الطلبات والصفقات" : "Orders & deals alerts"}
                    </span>
                  </div>
                  {/* Toggle */}
                  <button
                    role="switch"
                    aria-checked={notifEnabled}
                    onClick={() => setNotifEnabled((v) => !v)}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ backgroundColor: notifEnabled ? "#c4622d" : "rgba(245,240,232,0.15)" }}
                    aria-label={isRTL ? "تبديل الإشعارات" : "Toggle notifications"}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
                      style={{
                        backgroundColor: "#f5f0e8",
                        transform: notifEnabled ? "translateX(22px)" : "translateX(2px)",
                      }}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </SettingsSection>

              {/* About */}
              <SettingsSection label={isRTL ? "حول التطبيق" : "About GlobalWeavers"}>
                <div
                  className="flex flex-col gap-1 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(245,240,232,0.06)" }}
                >
                  {[
                    { label: isRTL ? "الإصدار"        : "Version",         value: "1.0.0" },
                    { label: isRTL ? "الشبكة"          : "Network",         value: "Pi Mainnet" },
                    { label: isRTL ? "معرف التطبيق"   : "App ID",          value: "globalweavers.pi" },
                    { label: isRTL ? "التطوير"         : "Built with",      value: "Next.js · Pi SDK" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                      <span
                        className="text-[12px]"
                        style={{ color: "rgba(245,240,232,0.45)", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: "rgba(245,240,232,0.8)", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex items-center gap-2 mt-2 pt-2"
                    style={{ borderTop: "1px solid rgba(245,240,232,0.07)" }}
                  >
                    <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(245,240,232,0.3)" }} />
                    <p
                      className="text-[10px] leading-relaxed"
                      style={{ color: "rgba(245,240,232,0.3)", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {isRTL
                        ? "سوق عالمي للأقمشة والمنسوجات على شبكة Pi. اشترِ وبع بعملة Pi."
                        : "Global fabric & textile marketplace on Pi Network. Buy and sell with Pi."}
                    </p>
                  </div>
                </div>
              </SettingsSection>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Small helper ──────────────────────────────────────────────────────────────
function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="text-[9px] font-bold tracking-[0.18em] uppercase mb-2 px-1"
        style={{
          color: "rgba(245,240,232,0.3)",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
