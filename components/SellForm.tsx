"use client";

import { useState } from "react";
import { Camera, Plus, ChevronDown, Check, Upload } from "lucide-react";

type FabricType = "Cotton" | "Silk" | "Linen" | "Wool" | "Synthetic" | "Heritage";
type Grade      = "A" | "B" | "C";
type TradeUnit  = "meter" | "roll" | "yard";

const FABRIC_TYPES: { id: FabricType; labelAr: string; color: string }[] = [
  { id: "Cotton",    labelAr: "قطن",    color: "#4e8a63" },
  { id: "Silk",      labelAr: "حرير",   color: "#8b5679" },
  { id: "Linen",     labelAr: "كتان",   color: "#a07c2e" },
  { id: "Wool",      labelAr: "صوف",    color: "#7a4f2c" },
  { id: "Synthetic", labelAr: "صناعي",  color: "#3d6296" },
  { id: "Heritage",  labelAr: "تراثي",  color: "#c4622d" },
];

const GRADES: {
  id: Grade;
  label: string;
  labelAr: string;
  desc: string;
  descAr: string;
}[] = [
  { id: "A", label: "Grade A", labelAr: "درجة أ", desc: "Premium",  descAr: "ممتاز" },
  { id: "B", label: "Grade B", labelAr: "درجة ب", desc: "Standard", descAr: "عادي" },
  { id: "C", label: "Grade C", labelAr: "درجة ج", desc: "Economy",  descAr: "اقتصادي" },
];

const TRADE_UNITS: { id: TradeUnit; label: string; labelAr: string }[] = [
  { id: "meter", label: "Per Meter", labelAr: "بالمتر" },
  { id: "roll",  label: "Per Roll",  labelAr: "بالرول" },
  { id: "yard",  label: "Per Yard",  labelAr: "بالياردة" },
];

const COUNTRIES = [
  "Egypt", "India", "China", "Turkey", "Italy", "France", "Japan", "Morocco",
  "Peru", "Bangladesh", "Pakistan", "Indonesia", "Vietnam", "Iran", "Uzbekistan",
  "Brazil", "Mexico", "Ghana", "Ethiopia", "United Kingdom",
];

const COLOR_OPTIONS = [
  "#f5f0e8", "#1a1040", "#c4622d", "#7b9e87", "#b5899c",
  "#c4a862", "#9e7b5a", "#7b8fb5", "#2d4a8c", "#8b0000",
  "#006400", "#4a4a4a", "#f0e68c", "#ffffff", "#000000",
];

// ── Shared styles ───────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  backgroundColor: "#fdfaf5",
  border: "1.5px solid #ddd4c0",
  borderRadius: "0.75rem",
  padding: "0.65rem 0.875rem",
  color: "#1a1040",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "0.875rem",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#9c8f7e",
  fontFamily: "var(--font-inter), sans-serif",
  marginBottom: "6px",
};

interface SellFormProps {
  isRTL?: boolean;
}

export function SellForm({ isRTL = false }: SellFormProps) {
  const [name,                setName]                = useState("");
  const [fabricType,          setFabricType]          = useState<FabricType | "">("");
  const [country,             setCountry]             = useState("");
  const [grade,               setGrade]               = useState<Grade | "">("");
  const [tradeUnit,           setTradeUnit]           = useState<TradeUnit>("meter");
  const [price,               setPrice]               = useState("");
  const [minOrder,            setMinOrder]            = useState("1");
  const [description,         setDescription]         = useState("");
  const [selectedColors,      setSelectedColors]      = useState<string[]>([]);
  const [showTypeDropdown,    setShowTypeDropdown]    = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [submitted,           setSubmitted]           = useState(false);

  const toggleColor = (c: string) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c].slice(0, 6)
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabricType || !grade || !country || !name || !price) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setFabricType("");
    setCountry("");
    setGrade("");
    setPrice("");
    setMinOrder("1");
    setDescription("");
    setSelectedColors([]);
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-6 text-center gap-5 animate-fade-in"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #c4622d 0%, #a0451b 100%)",
            boxShadow: "0 8px 28px rgba(196,98,45,0.4)",
          }}
          aria-hidden="true"
        >
          <Check className="w-9 h-9" style={{ color: "#f5f0e8" }} />
        </div>
        <h3
          className="text-2xl font-bold"
          style={{
            color: "#1a1040",
            fontFamily: "var(--font-serif), 'Playfair Display', serif",
          }}
        >
          {isRTL ? "تم إرسال الإعلان!" : "Listing Submitted!"}
        </h3>
        <p
          className="text-sm leading-relaxed max-w-xs"
          style={{
            color: "#6b5e4a",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {isRTL
            ? "قائمتك تحت المراجعة وستكون متاحة خلال 24 ساعة على Global Weavers."
            : "Your fabric listing is under review and will go live on Global Weavers within 24 hours."}
        </p>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{
            backgroundColor: "rgba(21,128,61,0.1)",
            border: "1px solid rgba(21,128,61,0.2)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#15803d" }}
            aria-hidden="true"
          />
          <span
            className="text-xs font-medium"
            style={{ color: "#15803d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "مدفوعات Pi آمنة" : "Secured by Pi Network Escrow"}
          </span>
        </div>
        <button
          onClick={resetForm}
          className="mt-1 px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: "#1a1040",
            color: "#f5f0e8",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {isRTL ? "إضافة قائمة أخرى" : "Add another listing"}
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 pt-5 pb-10 flex flex-col gap-5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Heading */}
      <div>
        <h2
          className="text-2xl font-bold mb-1"
          style={{
            color: "#1a1040",
            fontFamily: "var(--font-serif), 'Playfair Display', serif",
          }}
        >
          {isRTL ? "أضف قماشك للبيع" : "List Your Fabric"}
        </h2>
        <p
          style={{
            color: "#9c8f7e",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.875rem",
          }}
        >
          {isRTL
            ? "بع للمشترين حول العالم — اربح بـ Pi"
            : "Sell to buyers worldwide · Earn in Pi"}
        </p>
      </div>

      {/* Photo upload */}
      <div>
        <label style={labelStyle}>{isRTL ? "الصور" : "Photos"}</label>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-60"
            style={{ border: "2px dashed #ddd4c0", backgroundColor: "#ede8de" }}
            aria-label={isRTL ? "أضف صورة" : "Add main photo"}
          >
            <Camera className="w-5 h-5" style={{ color: "#9c8f7e" }} />
            <span
              style={{
                color: "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "9px",
              }}
            >
              {isRTL ? "رئيسية" : "Main"}
            </span>
          </button>
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-60"
              style={{ border: "2px dashed #ddd4c0", backgroundColor: "#ede8de" }}
              aria-label={isRTL ? "أضف صورة" : `Add photo ${i + 1}`}
            >
              <Plus className="w-5 h-5" style={{ color: "#c8bfb0" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Fabric name */}
      <div>
        <label htmlFor="fabric-name" style={labelStyle}>
          {isRTL ? "اسم القماش" : "Fabric Name"}
        </label>
        <input
          id="fabric-name"
          type="text"
          placeholder={
            isRTL
              ? "مثال: قطن مصري طويل التيلة"
              : "e.g. Egyptian Long-Staple Cotton"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      {/* Fabric type */}
      <div className="relative">
        <label style={labelStyle}>
          {isRTL ? "نوع القماش" : "Fabric Type"}
        </label>
        <button
          type="button"
          className="flex items-center justify-between"
          style={{
            ...inputStyle,
            cursor: "pointer",
            textAlign: isRTL ? "right" : "left",
          }}
          onClick={() => {
            setShowTypeDropdown((v) => !v);
            setShowCountryDropdown(false);
          }}
          aria-haspopup="listbox"
          aria-expanded={showTypeDropdown}
        >
          <span style={{ color: fabricType ? "#1a1040" : "#9c8f7e" }}>
            {fabricType
              ? isRTL
                ? FABRIC_TYPES.find((t) => t.id === fabricType)?.labelAr ?? fabricType
                : fabricType
              : isRTL
              ? "اختر نوع القماش"
              : "Select fabric type"}
          </span>
          <ChevronDown
            className="w-4 h-4 flex-shrink-0"
            style={{
              color: "#9c8f7e",
              transform: showTypeDropdown ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>

        {showTypeDropdown && (
          <div
            className="absolute left-0 right-0 z-20 rounded-xl overflow-hidden shadow-xl"
            style={{
              backgroundColor: "#fdfaf5",
              border: "1.5px solid #ddd4c0",
              top: "calc(100% + 4px)",
            }}
            role="listbox"
          >
            {FABRIC_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={fabricType === t.id}
                className="w-full px-4 py-2.5 flex items-center justify-between transition-colors"
                style={{
                  backgroundColor:
                    fabricType === t.id ? "rgba(196,98,45,0.07)" : "transparent",
                  color: "#1a1040",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.875rem",
                  textAlign: isRTL ? "right" : "left",
                }}
                onClick={() => {
                  setFabricType(t.id);
                  setShowTypeDropdown(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                    aria-hidden="true"
                  />
                  {isRTL ? t.labelAr : t.id}
                </div>
                {fabricType === t.id && (
                  <Check className="w-4 h-4" style={{ color: "#c4622d" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country of origin */}
      <div className="relative">
        <label style={labelStyle}>
          {isRTL ? "بلد المنشأ" : "Country of Origin"}
        </label>
        <button
          type="button"
          className="flex items-center justify-between"
          style={{
            ...inputStyle,
            cursor: "pointer",
            textAlign: isRTL ? "right" : "left",
          }}
          onClick={() => {
            setShowCountryDropdown((v) => !v);
            setShowTypeDropdown(false);
          }}
          aria-haspopup="listbox"
          aria-expanded={showCountryDropdown}
        >
          <span style={{ color: country ? "#1a1040" : "#9c8f7e" }}>
            {country || (isRTL ? "اختر البلد" : "Select country")}
          </span>
          <ChevronDown
            className="w-4 h-4 flex-shrink-0"
            style={{
              color: "#9c8f7e",
              transform: showCountryDropdown ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </button>

        {showCountryDropdown && (
          <div
            className="absolute left-0 right-0 z-20 rounded-xl overflow-hidden shadow-xl"
            style={{
              backgroundColor: "#fdfaf5",
              border: "1.5px solid #ddd4c0",
              top: "calc(100% + 4px)",
              maxHeight: 200,
              overflowY: "auto",
            }}
            role="listbox"
          >
            {COUNTRIES.map((c) => (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={country === c}
                className="w-full px-4 py-2.5 flex items-center justify-between"
                style={{
                  backgroundColor:
                    country === c ? "rgba(196,98,45,0.07)" : "transparent",
                  color: "#1a1040",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.875rem",
                  textAlign: isRTL ? "right" : "left",
                }}
                onClick={() => {
                  setCountry(c);
                  setShowCountryDropdown(false);
                }}
              >
                {c}
                {country === c && (
                  <Check className="w-4 h-4" style={{ color: "#c4622d" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quality grade */}
      <div>
        <label style={labelStyle}>
          {isRTL ? "درجة الجودة" : "Quality Grade"}
        </label>
        <div className="flex gap-2">
          {GRADES.map((g) => (
            <button
              key={g.id}
              type="button"
              className="flex-1 py-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95"
              style={{
                backgroundColor: grade === g.id ? "#1a1040" : "#ede8de",
                color: grade === g.id ? "#f5f0e8" : "#9c8f7e",
                border:
                  grade === g.id ? "none" : "1.5px solid #ddd4c0",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              onClick={() => setGrade(g.id)}
              aria-pressed={grade === g.id}
            >
              <span className="font-bold text-sm">
                {isRTL ? g.labelAr : g.label}
              </span>
              <span className="text-[9px] opacity-70">
                {isRTL ? g.descAr : g.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trade unit */}
      <div>
        <label style={labelStyle}>
          {isRTL ? "وحدة التداول" : "Trade Unit"}
        </label>
        <div className="flex gap-2">
          {TRADE_UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{
                backgroundColor:
                  tradeUnit === u.id ? "#c4622d" : "#ede8de",
                color: tradeUnit === u.id ? "#f5f0e8" : "#9c8f7e",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              onClick={() => setTradeUnit(u.id)}
              aria-pressed={tradeUnit === u.id}
            >
              {isRTL ? u.labelAr : u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price & min order */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="sell-price" style={labelStyle}>
            {isRTL ? "السعر (π)" : "Price (π)"}
          </label>
          <input
            id="sell-price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={{ width: 110 }}>
          <label htmlFor="min-order" style={labelStyle}>
            {isRTL ? "الحد الأدنى" : "Min Order"}
          </label>
          <input
            id="min-order"
            type="number"
            min="1"
            placeholder="1"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label style={labelStyle}>
          {isRTL
            ? `الألوان المتاحة (${selectedColors.length}/6)`
            : `Available Colors (${selectedColors.length}/6)`}
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              className="w-8 h-8 rounded-full transition-transform active:scale-90 flex items-center justify-center"
              style={{
                backgroundColor: c,
                border: selectedColors.includes(c)
                  ? "3px solid #c4622d"
                  : "2px solid #ddd4c0",
                boxShadow: selectedColors.includes(c)
                  ? "0 0 0 2px #f5f0e8, 0 0 0 4px #c4622d"
                  : "none",
              }}
              onClick={() => toggleColor(c)}
              aria-label={`Select color ${c}`}
              aria-pressed={selectedColors.includes(c)}
            >
              {selectedColors.includes(c) && (
                <Check
                  className="w-3 h-3"
                  style={{
                    color: ["#f5f0e8", "#f0e68c", "#ffffff"].includes(c)
                      ? "#333"
                      : "#fff",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="fabric-desc" style={labelStyle}>
          {isRTL ? "الوصف" : "Description"}
        </label>
        <textarea
          id="fabric-desc"
          placeholder={
            isRTL
              ? "صف قماشك: النسيج، الوزن، الشهادات..."
              : "Describe your fabric: weave, weight, certifications..."
          }
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>

      {/* Pi earnings notice */}
      <div
        className="flex items-center gap-3 p-3.5 rounded-2xl"
        style={{
          backgroundColor: "rgba(196,98,45,0.07)",
          border: "1px solid rgba(196,98,45,0.18)",
        }}
      >
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold pi-glow"
          style={{
            backgroundColor: "#c4622d",
            color: "#f5f0e8",
            fontFamily: "var(--font-inter), sans-serif",
          }}
          aria-hidden="true"
        >
          π
        </span>
        <p
          className="text-xs leading-relaxed"
          style={{
            color: "#6b5e4a",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {isRTL
            ? "ستتلقى المدفوعات مباشرة بعملة Pi عبر النظام الآمن للضمان."
            : "You'll receive payments directly in Pi through our secure escrow system."}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #c4622d 0%, #a0451b 100%)",
          color: "#f5f0e8",
          fontFamily: "var(--font-serif), 'Playfair Display', serif",
          boxShadow: "0 4px 20px rgba(196,98,45,0.4)",
        }}
      >
        <Upload className="w-4 h-4" />
        {isRTL ? "انشر للبيع — اربح بـ Pi" : "List for Sale · Earn in Pi"}
      </button>
    </form>
  );
}
