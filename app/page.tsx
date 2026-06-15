"use client";

import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { FabricCard, type Fabric } from "@/components/FabricCard";
import { SellerCard, type Seller } from "@/components/SellerCard";
import { SellForm } from "@/components/SellForm";
import { Orders } from "@/components/Orders";
import { Wallet } from "@/components/Wallet";
import { Modal } from "@/components/Modal";
import { usePiAuth } from "@/contexts/pi-auth-context";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  TrendingUp,
  Globe,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Minus,
  Plus,
  Star,
  Shield,
  Package,
} from "lucide-react";
import { PiPayButton } from "@/components/PiPayButton";

// ─── Fabric images (Unsplash) ─────────────────────────────────────────────────

const IMG = {
  // Clothing
  silk:      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop",
  cotton:    "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400&auto=format&fit=crop",
  wool:      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop",
  linen:     "https://images.unsplash.com/photo-1586495777744-4e6232bf0b7e?w=400&auto=format&fit=crop",
  velvet:    "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&auto=format&fit=crop",
  brocade:   "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&auto=format&fit=crop",
  batik:     "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=400&auto=format&fit=crop",
  satin:     "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop",
  lace:      "https://images.unsplash.com/photo-1586495777744-4e6232bf0b7e?w=400&auto=format&fit=crop",
  cultural:  "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=400&auto=format&fit=crop",
  // Curtain
  sheer:     "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop",
  blackout:  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop",
  curtain:   "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop",
  // Upholstery
  leather:   "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop",
  chenille:  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop",
  upholstery:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop",
  bouclé:    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop",
  // Carpet & Rug
  rug:       "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop",
  persian:   "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&auto=format&fit=crop",
  carpet:    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&auto=format&fit=crop",
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const FABRICS: Fabric[] = [
  // ── Everyday Fabrics ────────────────────────────────────────────────────────
  {
    id: "f1",
    name: "Egyptian Long-Staple Cotton",
    type: "Cotton", subtype: "Egyptian Cotton", origin: "Egypt", originFlag: "🇪🇬",
    pricePerMeter: 12.5, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8d5b0", "#c8a882", "#8b7355"],
    imageUrl: IMG.cotton,
    seller: "@cairo_weaver", rating: 4.9, reviews: 312, inStock: true,
    description: "Premium long-staple cotton from the Nile Delta, renowned worldwide for its exceptional softness and durability. Each thread is hand-picked and stone-washed.",
  },
  {
    id: "f2",
    name: "Mulberry Silk Dupioni",
    type: "Silk", subtype: "Dupioni Silk", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 45, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#b5899c", "#d4a0b5", "#8b0057", "#ffd700"],
    imageUrl: IMG.silk,
    seller: "@varanasi_silk", rating: 4.8, reviews: 198, inStock: true,
    description: "Hand-loomed Dupioni silk from Varanasi with rich natural slubs, brilliant lustre and a characteristic crisp texture.",
  },
  {
    id: "f3",
    name: "Belgian Linen Premium",
    type: "Linen", subtype: "Belgian Linen", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 18, minOrder: 10, unit: "meter", grade: "A",
    colors: ["#d4c5a9", "#b8a78a", "#8b7d6b", "#f5f0e8"],
    imageUrl: IMG.linen,
    seller: "@brussels_linen", rating: 4.7, reviews: 245, inStock: true,
    description: "Certified organic Belgian linen with a beautiful natural texture and outstanding breathability. Ideal for clothing and home textiles.",
  },
  {
    id: "f4",
    name: "New Zealand Merino Wool",
    type: "Wool", subtype: "Merino Wool", origin: "New Zealand", originFlag: "🇳🇿",
    pricePerMeter: 32, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5b0", "#8b7d6b", "#4a3728"],
    imageUrl: IMG.wool,
    seller: "@nz_merino", rating: 4.9, reviews: 167, inStock: true,
    description: "Ultra-fine 17.5 micron merino from New Zealand's South Island. Soft enough for next-to-skin wear, naturally odour-resistant.",
  },
  {
    id: "f5",
    name: "Moroccan Berber Heritage",
    type: "Cultural", subtype: "Moroccan Berber", origin: "Morocco", originFlag: "🇲🇦",
    pricePerMeter: 55, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#1a1040", "#f5f0e8", "#ffd700"],
    imageUrl: IMG.cultural,
    seller: "@marrakech_craft", rating: 5.0, reviews: 89, inStock: true,
    description: "Hand-woven traditional Berber textile with authentic geometric patterns. Each piece is unique and tells a story of Amazigh heritage.",
  },
  {
    id: "f6",
    name: "Japanese Technical Mesh",
    type: "Synthetic", subtype: "Technical Mesh", origin: "Japan", originFlag: "🇯🇵",
    pricePerMeter: 8.5, minOrder: 20, unit: "meter", grade: "B",
    colors: ["#1a1040", "#7b8fb5", "#f5f0e8", "#4a4a4a"],
    imageUrl: IMG.linen,
    seller: "@tokyo_textiles", rating: 4.5, reviews: 423, inStock: true,
    description: "High-performance technical mesh engineered for sportswear. Superior moisture-wicking and 4-way stretch.",
  },
  {
    id: "f7",
    name: "Turkish Hammam Cotton",
    type: "Cotton", subtype: "Turkish Cotton", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 14, minOrder: 8, unit: "meter", grade: "B",
    colors: ["#f5f0e8", "#7b9e87", "#2d4a8c", "#c4622d"],
    imageUrl: IMG.cotton,
    seller: "@istanbul_weavers", rating: 4.6, reviews: 289, inStock: false,
    description: "Authentic Turkish peshtemal cotton, super absorbent and quick-drying. Traditional flat-woven bath textile.",
  },
  {
    id: "f8",
    name: "Chinese Raw Silk",
    type: "Silk", subtype: "Raw Silk", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 28, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#ffd700", "#f5f0e8", "#8b0057", "#c4622d"],
    imageUrl: IMG.silk,
    seller: "@suzhou_silk", rating: 4.4, reviews: 156, inStock: true,
    description: "Traditional raw silk from Suzhou, the Silk Capital of China. Natural sheen and exceptional drape.",
  },
  {
    id: "f9",
    name: "Peruvian Baby Alpaca",
    type: "Wool", subtype: "Alpaca Wool", origin: "Peru", originFlag: "🇵🇪",
    pricePerMeter: 38, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#d4c5a9", "#8b7d6b", "#4a3728", "#f5f0e8"],
    imageUrl: IMG.wool,
    seller: "@lima_alpaca", rating: 4.8, reviews: 134, inStock: true,
    description: "Baby alpaca fibers from the Andean highlands — hypoallergenic, incredibly soft, and sustainably sourced.",
  },
  {
    id: "f10",
    name: "Indian Khadi Cotton",
    type: "Cultural", subtype: "Indian Khadi", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 22, minOrder: 6, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#8b7d6b", "#1a1040"],
    imageUrl: IMG.cultural,
    seller: "@gandhi_khadi", rating: 4.9, reviews: 201, inStock: true,
    description: "Handspun and hand-woven Khadi cotton — a timeless symbol of Indian craftsmanship and sustainable production.",
  },
  {
    id: "f11",
    name: "French Jacquard Brocade",
    type: "Luxury", subtype: "French Jacquard", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 72, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#1a1040", "#8b5679"],
    imageUrl: IMG.brocade,
    seller: "@lyon_textiles", rating: 4.9, reviews: 67, inStock: true,
    description: "Luxury French Jacquard brocade woven in Lyon. Intricate floral patterns with metallic gold thread highlights.",
  },
  {
    id: "f12",
    name: "Italian Wool Suiting",
    type: "Wool", subtype: "Cashmere Blend", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 48, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#4a3728", "#1a1040", "#8b7d6b", "#c4622d"],
    imageUrl: IMG.wool,
    seller: "@biella_wool", rating: 4.7, reviews: 112, inStock: true,
    description: "Classic Italian suiting wool from Biella, the cashmere capital of Italy. Perfect for bespoke tailoring.",
  },

  // ── Luxury & Specialty ──────────────────────────────────────────────────────
  {
    id: "f13",
    name: "Italian Silk Velvet",
    type: "Luxury", subtype: "Silk Velvet", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 95, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#1a1040", "#8b0057", "#c4622d", "#006466"],
    imageUrl: IMG.velvet,
    seller: "@milan_velvet", rating: 5.0, reviews: 54, inStock: true,
    description: "Hand-cut Italian silk velvet from Como. Sumptuous pile depth, rich colour saturation, and an unmistakable sheen for haute couture and luxury interiors.",
  },
  {
    id: "f14",
    name: "Crushed Velvet — Midnight",
    type: "Luxury", subtype: "Crushed Velvet", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 38, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#0d0d2b", "#1a1040", "#2d1a60", "#6b4f9e"],
    imageUrl: IMG.velvet,
    seller: "@paris_velours", rating: 4.6, reviews: 88, inStock: true,
    description: "Dramatic crushed velvet with a directional sheen. Perfect for evening wear, theatrical costumes, and statement cushions.",
  },
  {
    id: "f15",
    name: "Duchess Satin — Ivory",
    type: "Luxury", subtype: "Duchess Satin", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 52, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c5a9", "#fff8ef"],
    imageUrl: IMG.satin,
    seller: "@como_satin", rating: 4.8, reviews: 73, inStock: true,
    description: "Heavy-weight Duchess satin with a firm hand and brilliant reflective surface. The definitive choice for bridal gowns and formal eveningwear.",
  },
  {
    id: "f16",
    name: "French Charmeuse Satin",
    type: "Luxury", subtype: "Charmeuse Satin", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 44, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c4622d", "#8b0057", "#f5f0e8"],
    imageUrl: IMG.satin,
    seller: "@lyon_charmeuse", rating: 4.7, reviews: 91, inStock: true,
    description: "Feather-light charmeuse satin with a liquid drape and satin-matte reverse. A favourite for lingerie, blouses and evening dresses.",
  },
  {
    id: "f17",
    name: "Chinese Silk Brocade",
    type: "Luxury", subtype: "Chinese Brocade", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 62, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#1a1040", "#8b0057"],
    imageUrl: IMG.brocade,
    seller: "@suzhou_brocade", rating: 4.9, reviews: 115, inStock: true,
    description: "Traditional Chinese brocade featuring phoenix and dragon motifs, woven on Jacquard looms in Suzhou with pure silk and metallic threads.",
  },
  {
    id: "f18",
    name: "Indian Zari Brocade",
    type: "Luxury", subtype: "Indian Brocade", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 78, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c9973a", "#ffd700", "#8b0057", "#1a1040"],
    imageUrl: IMG.brocade,
    seller: "@banaras_zari", rating: 5.0, reviews: 62, inStock: true,
    description: "Opulent Banarasi Zari brocade with real gold and silver threads. Prized for bridal lehengas and royal ceremonial garments.",
  },
  {
    id: "f19",
    name: "Syrian Damask — Rose",
    type: "Luxury", subtype: "Syrian Damask", origin: "Syria", originFlag: "🇸🇾",
    pricePerMeter: 58, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#b5254a", "#e8a0b0", "#f5f0e8", "#1a1040"],
    imageUrl: IMG.silk,
    seller: "@damascus_weave", rating: 4.9, reviews: 48, inStock: true,
    description: "Classic Syrian damask with its characteristic reversible floral pattern. Woven in silk on traditional looms — a UNESCO-listed heritage craft.",
  },
  {
    id: "f20",
    name: "Italian Damask — Gold",
    type: "Luxury", subtype: "Italian Damask", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 84, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c9973a", "#ffd700", "#f5f0e8", "#4a3728"],
    imageUrl: IMG.silk,
    seller: "@venezia_damask", rating: 4.8, reviews: 39, inStock: true,
    description: "Venetian damask woven with silk-cotton blends and gold-tone threads. Self-patterned ornamental weave for opulent drapery and upholstery.",
  },
  {
    id: "f21",
    name: "Belgian Lace — Bruges",
    type: "Luxury", subtype: "Bruges Lace", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 135, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#ffffff", "#d4c5a9"],
    imageUrl: IMG.lace,
    seller: "@bruges_lace", rating: 5.0, reviews: 31, inStock: true,
    description: "Handmade Bruges bobbin lace with intricate floral and geometric patterns. Each meter takes dozens of hours to complete by master lacemakers.",
  },
  {
    id: "f22",
    name: "French Chantilly Lace",
    type: "Luxury", subtype: "French Chantilly", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 118, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#1a1040", "#e8dcc8", "#ffffff"],
    imageUrl: IMG.lace,
    seller: "@chantilly_atelier", rating: 4.9, reviews: 27, inStock: true,
    description: "Delicate silk Chantilly lace with a fine hexagonal ground and detailed floral motifs. The couture standard for veils and bridal overlays.",
  },
  {
    id: "f23",
    name: "Venetian Needlepoint Lace",
    type: "Luxury", subtype: "Venetian Lace", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 160, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#ffffff", "#e8dcc8", "#c9a86c"],
    imageUrl: IMG.lace,
    seller: "@burano_needle", rating: 5.0, reviews: 19, inStock: true,
    description: "Rare Burano needlepoint lace hand-crafted by Venetian artisans. Each motif is built stitch by stitch — true wearable art.",
  },
  {
    id: "f24",
    name: "French Silk Tulle",
    type: "Luxury", subtype: "Silk Tulle", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 32, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#ffffff", "#f0e6d2", "#d4c5a9"],
    imageUrl: IMG.silk,
    seller: "@calais_tulle", rating: 4.7, reviews: 84, inStock: true,
    description: "Ultra-fine silk tulle from Calais with a barely-there hand. The perfect base for embroidery overlays, veils and ballet costumes.",
  },
  {
    id: "f25",
    name: "Silk Organza — Blush",
    type: "Luxury", subtype: "Silk Organza", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 36, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f2c6b4", "#e8a89a", "#f5f0e8", "#d4a0a0"],
    imageUrl: IMG.silk,
    seller: "@hangzhou_organza", rating: 4.6, reviews: 102, inStock: true,
    description: "Crisp, translucent silk organza with a luminous finish. Widely used for structured gowns, overlays and dramatic sleeves.",
  },
  {
    id: "f26",
    name: "Silk Georgette — Cobalt",
    type: "Luxury", subtype: "Silk Georgette", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 29, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#0047ab", "#1a1040", "#3b6fdb", "#8ab4f8"],
    imageUrl: IMG.silk,
    seller: "@surat_georgette", rating: 4.5, reviews: 178, inStock: true,
    description: "Pure silk georgette with a characteristic crepe texture and fluid drape. Ideal for draped eveningwear, sarees and scarves.",
  },
  {
    id: "f27",
    name: "Devore Velvet — Floral",
    type: "Luxury", subtype: "Devore Velvet", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 68, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#1a1040", "#8b0057", "#c4622d", "#ffd700"],
    imageUrl: IMG.velvet,
    seller: "@paris_devore", rating: 4.8, reviews: 43, inStock: false,
    description: "Burnout velvet with acid-etched floral motifs revealing sheer silk ground. Exquisite for statement jackets and evening shawls.",
  },

  // ── African Cultural Fabrics ─────────────────────────────────────────────────
  {
    id: "f28",
    name: "Kente Cloth — Ghana",
    type: "Cultural", subtype: "Kente", origin: "Ghana", originFlag: "🇬🇭",
    pricePerMeter: 48, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c4622d", "#1a5c38", "#1a1040"],
    imageUrl: IMG.cultural,
    seller: "@accra_kente", rating: 5.0, reviews: 143, inStock: true,
    description: "Hand-woven Ghanaian Kente cloth in traditional royal patterns. Each strip is woven on a narrow-band loom and assembled by master weavers of the Ashanti kingdom.",
  },
  {
    id: "f29",
    name: "Ankara Dutch Wax Print",
    type: "Cultural", subtype: "Ankara / Dutch Wax", origin: "Nigeria", originFlag: "🇳🇬",
    pricePerMeter: 12, minOrder: 6, unit: "meter", grade: "B",
    colors: ["#c4622d", "#ffd700", "#1a5c38", "#2d4a8c"],
    imageUrl: IMG.cultural,
    seller: "@lagos_ankara", rating: 4.7, reviews: 312, inStock: true,
    description: "Bold and vibrant Ankara wax-resist printed cotton in contemporary African graphic patterns. Versatile for fashion, accessories and home décor.",
  },
  {
    id: "f30",
    name: "Bogolan Mudcloth — Mali",
    type: "Cultural", subtype: "Bogolan / Mudcloth", origin: "Mali", originFlag: "🇲🇱",
    pricePerMeter: 35, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#3d2007", "#8b5e3c", "#f5f0e8", "#1a1040"],
    imageUrl: IMG.cultural,
    seller: "@bamako_bogolan", rating: 4.9, reviews: 76, inStock: true,
    description: "Authentic hand-painted Malian mudcloth with fermented-mud geometric motifs on hand-spun cotton. Each cloth tells a personal story or proverb.",
  },
  {
    id: "f31",
    name: "Kanga Printed Cotton",
    type: "Cultural", subtype: "Kanga", origin: "Kenya", originFlag: "🇰🇪",
    pricePerMeter: 9, minOrder: 6, unit: "meter", grade: "B",
    colors: ["#c4622d", "#ffd700", "#2d8c4a", "#f5f0e8"],
    imageUrl: IMG.cultural,
    seller: "@nairobi_kanga", rating: 4.5, reviews: 189, inStock: true,
    description: "East African Kanga with vivid printed borders and a Swahili proverb. Worn as wraps, used as carriers and gifted at ceremonies across the region.",
  },
  {
    id: "f32",
    name: "Adire Indigo — Nigeria",
    type: "Cultural", subtype: "Adire", origin: "Nigeria", originFlag: "🇳🇬",
    pricePerMeter: 28, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#1a1040", "#2d4a8c", "#4a6fa5", "#f5f0e8"],
    imageUrl: IMG.cultural,
    seller: "@abeokuta_adire", rating: 4.8, reviews: 95, inStock: true,
    description: "Yoruba hand-dyed Adire cloth using resist techniques with indigo pigment. Patterns carry traditional meanings tied to Yoruba cosmology.",
  },

  // ── Asian Cultural Fabrics ───────────────────────────────────────────────────
  {
    id: "f33",
    name: "Javanese Batik Tulis",
    type: "Cultural", subtype: "Batik Javanese", origin: "Indonesia", originFlag: "🇮🇩",
    pricePerMeter: 42, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#3d2007", "#c4622d", "#ffd700", "#1a1040"],
    imageUrl: IMG.batik,
    seller: "@jogja_batik", rating: 5.0, reviews: 167, inStock: true,
    description: "Hand-drawn Batik Tulis from Yogyakarta using a canting wax pen. Each piece takes days to complete and features traditional Parang or Kawung motifs.",
  },
  {
    id: "f34",
    name: "Malaysian Batik Sarong",
    type: "Cultural", subtype: "Batik Malaysian", origin: "Malaysia", originFlag: "🇲🇾",
    pricePerMeter: 18, minOrder: 4, unit: "meter", grade: "B",
    colors: ["#c4622d", "#ffd700", "#1a5c38", "#f5f0e8"],
    imageUrl: IMG.batik,
    seller: "@kl_batik", rating: 4.6, reviews: 134, inStock: true,
    description: "Malaysian Batik with bold floral and leaf patterns in vibrant tropical colours. Produced using a distinctive brushed wax technique.",
  },
  {
    id: "f35",
    name: "Central Asian Ikat Silk",
    type: "Cultural", subtype: "Central Asian Ikat", origin: "Uzbekistan", originFlag: "🇺🇿",
    pricePerMeter: 65, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#8b0057", "#1a1040"],
    imageUrl: IMG.batik,
    seller: "@samarkand_ikat", rating: 4.9, reviews: 58, inStock: true,
    description: "Uzbek Adras Ikat — a lustrous silk-cotton blend with resist-dyed warp threads creating blurred flame-like patterns. A Silk Road treasure.",
  },
  {
    id: "f36",
    name: "Patola Double Ikat — Gujarat",
    type: "Cultural", subtype: "Indian Ikat", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 88, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#8b0057", "#c4622d", "#ffd700", "#1a1040"],
    imageUrl: IMG.batik,
    seller: "@patan_patola", rating: 5.0, reviews: 34, inStock: true,
    description: "Rare double-ikat Patola silk from Patan where both warp and weft are resist-dyed before weaving. Among the most technically demanding textiles on Earth.",
  },
  {
    id: "f37",
    name: "Malaysian Songket Gold",
    type: "Cultural", subtype: "Songket", origin: "Malaysia", originFlag: "🇲🇾",
    pricePerMeter: 75, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c9973a", "#8b0057", "#1a1040"],
    imageUrl: IMG.brocade,
    seller: "@terengganu_songket", rating: 4.9, reviews: 47, inStock: true,
    description: "Hand-woven Malaysian Songket with supplementary gold-wrapped silk threads forming traditional bunga motifs. Worn at royal ceremonies and weddings.",
  },
  {
    id: "f38",
    name: "Batak Ulos — Sumatra",
    type: "Cultural", subtype: "Ulos Batak", origin: "Indonesia", originFlag: "🇮🇩",
    pricePerMeter: 40, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#1a1040", "#c4622d", "#ffd700", "#f5f0e8"],
    imageUrl: IMG.batik,
    seller: "@medan_ulos", rating: 4.8, reviews: 52, inStock: true,
    description: "Sacred Batak Ulos textile hand-woven in North Sumatra. Gifted at births, marriages and funerals as a symbol of blessing and kinship.",
  },
  {
    id: "f39",
    name: "Filipino Piña Cloth",
    type: "Cultural", subtype: "Filipino Ikat", origin: "Philippines", originFlag: "🇵🇭",
    pricePerMeter: 72, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#f2e8d0", "#e8dcc8", "#c9a86c"],
    imageUrl: IMG.linen,
    seller: "@aklan_pina", rating: 4.9, reviews: 29, inStock: false,
    description: "Translucent Philippine Piña cloth hand-loomed from pineapple leaf fibres. A national heritage fabric used for the formal Barong Tagalog.",
  },

  // ── Middle Eastern Cultural Fabrics ─────────────────────────────────────────
  {
    id: "f40",
    name: "Palestinian Tatreez Embroidery",
    type: "Cultural", subtype: "Palestinian Tatreez", origin: "Palestine", originFlag: "🇵🇸",
    pricePerMeter: 95, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#c4622d", "#8b0057", "#1a1040", "#f5f0e8"],
    imageUrl: IMG.cultural,
    seller: "@hebron_tatreez", rating: 5.0, reviews: 61, inStock: true,
    description: "Hand-embroidered Palestinian Tatreez on linen ground. Each village has its own distinct cross-stitch vocabulary — a living visual language of identity and resistance.",
  },
  {
    id: "f41",
    name: "Omani Handwoven Textile",
    type: "Cultural", subtype: "Omani Weaves", origin: "Oman", originFlag: "🇴🇲",
    pricePerMeter: 52, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#1a1040", "#f5f0e8"],
    imageUrl: "/placeholder.svg?height=200&width=300",
    seller: "@muscat_textiles", rating: 4.8, reviews: 38, inStock: true,
    description: "Traditional Omani woven textile with geometric falaj-inspired patterns in gold and terracotta. Made in Nizwa by generational craftspeople.",
  },

  // ── Latin American Cultural Fabrics ─────────────────────────────────────────
  {
    id: "f42",
    name: "Guatemalan Jaspe Cotton",
    type: "Cultural", subtype: "Guatemalan Jaspe", origin: "Guatemala", originFlag: "🇬🇹",
    pricePerMeter: 22, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#8b0057", "#c4622d", "#ffd700", "#1a5c38"],
    imageUrl: "/placeholder.svg?height=200&width=300",
    seller: "@chichicastenango", rating: 4.9, reviews: 83, inStock: true,
    description: "Guatemalan Jaspe ikat cotton with resist-tied warp threads hand-dyed in vivid Maya-inspired patterns. Woven on backstrap looms by indigenous artisans.",
  },
  {
    id: "f43",
    name: "Peruvian Andean Textile",
    type: "Cultural", subtype: "Peruvian Andean", origin: "Peru", originFlag: "🇵🇪",
    pricePerMeter: 45, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#1a5c38", "#8b0057"],
    imageUrl: "/placeholder.svg?height=200&width=300",
    seller: "@cusco_weavers", rating: 5.0, reviews: 71, inStock: true,
    description: "Andean tapestry-woven textile from Chinchero using natural plant-dyed alpaca and sheep wool. Geometric iconography maps the Andean cosmos.",
  },
  {
    id: "f44",
    name: "Mexican Huipil Cloth",
    division: "Clothing", type: "Cultural", subtype: "Mexican Huipil", origin: "Mexico", originFlag: "🇲🇽",
    pricePerMeter: 34, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#8b0057", "#1a5c38"],
    imageUrl: IMG.cultural,
    seller: "@oaxaca_textiles", rating: 4.9, reviews: 96, inStock: true,
    description: "Zapotec and Mixtec hand-woven Huipil cloth from Oaxaca, richly embroidered with floral and animal motifs using cochineal and indigo natural dyes.",
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CURTAIN FABRICS
  // ══════════════════════════════════════════════════════════════════════════════

  // Sheer
  {
    id: "c1",
    name: "French Voile Sheer",
    division: "Curtain", type: "Sheer", subtype: "Voile", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 8, minOrder: 10, unit: "meter", grade: "A",
    colors: ["#ffffff", "#f5f0e8", "#e8dcc8", "#d4c5a9"],
    imageUrl: IMG.sheer,
    seller: "@paris_sheers", rating: 4.6, reviews: 234, inStock: true,
    description: "Airy, lightweight French voile with a fine open weave. Diffuses light beautifully while maintaining privacy. Machine-washable, easy-care finish.",
  },
  {
    id: "c2",
    name: "Belgian Organza Sheer",
    division: "Curtain", type: "Sheer", subtype: "Organza", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 12, minOrder: 8, unit: "meter", grade: "A",
    colors: ["#ffffff", "#f5f0e8", "#d4c5a9", "#c8b89a"],
    imageUrl: IMG.sheer,
    seller: "@brussels_sheers", rating: 4.7, reviews: 188, inStock: true,
    description: "Crisp Belgian organza sheer with a slight sheen. Holds its shape superbly, ideal for pinch-pleat and eyelet headings.",
  },
  {
    id: "c3",
    name: "French Tulle Net Sheer",
    division: "Curtain", type: "Sheer", subtype: "Tulle", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 6, minOrder: 12, unit: "meter", grade: "B",
    colors: ["#ffffff", "#f5f0e8", "#ede8de", "#e8dcc8"],
    imageUrl: IMG.sheer,
    seller: "@calais_net", rating: 4.4, reviews: 312, inStock: true,
    description: "Classic French tulle net in wide widths. Timeless sheer for traditional and contemporary interiors, with reinforced selvedges.",
  },
  {
    id: "c4",
    name: "Flemish Lace Panel Sheer",
    division: "Curtain", type: "Sheer", subtype: "Lace Sheer", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 22, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#ffffff", "#f5f0e8", "#e8dcc8", "#d4c5a9"],
    imageUrl: IMG.curtain,
    seller: "@ghent_lace", rating: 4.8, reviews: 143, inStock: true,
    description: "Intricate Flemish lace-effect panel sheer woven on Jacquard looms. Botanical and geometric motifs add visual texture without blocking light.",
  },

  // Blackout
  {
    id: "c5",
    name: "Triple-Weave Blackout Lining",
    division: "Curtain", type: "Blackout", subtype: "Triple-weave Blackout", origin: "Germany", originFlag: "🇩🇪",
    pricePerMeter: 15, minOrder: 10, unit: "meter", grade: "A",
    colors: ["#1a1040", "#2c2c2c", "#4a4a4a", "#f5f0e8"],
    imageUrl: IMG.blackout,
    seller: "@berlin_blackout", rating: 4.9, reviews: 421, inStock: true,
    description: "German-engineered triple-weave blackout fabric blocking 100% of light and reducing outside noise by up to 60%. Thermal-insulating and energy-efficient.",
  },
  {
    id: "c6",
    name: "Thermal Blackout Velvet",
    division: "Curtain", type: "Blackout", subtype: "Thermal Blackout", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 32, minOrder: 6, unit: "meter", grade: "A",
    colors: ["#1a1040", "#8b0057", "#2e4a2e", "#4a3728"],
    imageUrl: IMG.velvet,
    seller: "@milan_blackout", rating: 4.8, reviews: 267, inStock: true,
    description: "Luxurious Italian velvet with integrated thermal blackout backing. Combines opulence with exceptional light and temperature control.",
  },

  // Semi-Sheer
  {
    id: "c7",
    name: "Linen Blend Semi-Sheer",
    division: "Curtain", type: "Sheer", subtype: "Linen Blend Semi-Sheer", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 18, minOrder: 8, unit: "meter", grade: "A",
    colors: ["#d4c5a9", "#b8a78a", "#8b7d6b", "#f5f0e8"],
    imageUrl: IMG.linen,
    seller: "@antwerp_linen", rating: 4.7, reviews: 198, inStock: true,
    description: "Natural Belgian linen-cotton blend with a relaxed, textured drape. Filters light softly while providing partial privacy — perfect for living rooms.",
  },
  {
    id: "c8",
    name: "Cotton Blend Semi-Sheer",
    division: "Curtain", type: "Sheer", subtype: "Cotton Blend Semi-Sheer", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 11, minOrder: 10, unit: "meter", grade: "B",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c5a9", "#7b9e87"],
    imageUrl: IMG.cotton,
    seller: "@istanbul_curtains", rating: 4.5, reviews: 302, inStock: true,
    description: "Turkish cotton-polyester blend semi-sheer. Practical, durable, and easy to launder. Available in 20+ colours and 300cm drop widths.",
  },

  // Luxury Curtain
  {
    id: "c9",
    name: "Silk Dupioni Curtain",
    division: "Curtain", type: "Luxury", subtype: "Silk Dupioni Curtain", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 55, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c4622d", "#8b0057", "#b5899c"],
    imageUrl: IMG.silk,
    seller: "@varanasi_curtains", rating: 4.9, reviews: 89, inStock: true,
    description: "Varanasi Silk Dupioni with characteristic slubs and a rich sheen. Pools elegantly at the floor for dramatic floor-to-ceiling curtain installations.",
  },
  {
    id: "c10",
    name: "Italian Velvet Curtain",
    division: "Curtain", type: "Luxury", subtype: "Velvet Curtain", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 72, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#1a1040", "#8b0057", "#2e4a2e", "#c4622d"],
    imageUrl: IMG.velvet,
    seller: "@como_velvet", rating: 5.0, reviews: 67, inStock: true,
    description: "Dense-pile Italian velvet with exceptional colour depth. Heavy enough to block light and insulate, opulent enough for palaces and five-star hotels.",
  },
  {
    id: "c11",
    name: "French Jacquard Curtain",
    division: "Curtain", type: "Luxury", subtype: "Jacquard Curtain", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 58, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#1a1040", "#d4c5a9"],
    imageUrl: IMG.brocade,
    seller: "@lyon_jacquard", rating: 4.8, reviews: 112, inStock: true,
    description: "Lyon Jacquard curtain fabric with woven damask patterns in warm gold and terracotta. Adds heirloom-quality gravitas to dining rooms and libraries.",
  },
  {
    id: "c12",
    name: "Syrian Damask Curtain",
    division: "Curtain", type: "Luxury", subtype: "Damask Curtain", origin: "Syria", originFlag: "🇸🇾",
    pricePerMeter: 48, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#b5254a", "#ffd700", "#1a1040", "#f5f0e8"],
    imageUrl: IMG.brocade,
    seller: "@damascus_curtains", rating: 4.9, reviews: 56, inStock: true,
    description: "Traditional Syrian damask with reversible self-patterned roses and fleur-de-lis. Woven in silk-cotton blend on heritage Jacquard looms.",
  },

  // Outdoor Curtain
  {
    id: "c13",
    name: "Solution-Dyed Acrylic Outdoor",
    division: "Curtain", type: "Outdoor", subtype: "Solution-dyed Acrylic", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 28, minOrder: 6, unit: "meter", grade: "A",
    colors: ["#2e4a2e", "#3d6296", "#c4622d", "#f5f0e8"],
    imageUrl: IMG.curtain,
    seller: "@sunbrella_us", rating: 4.8, reviews: 389, inStock: true,
    description: "Sunbrella-grade solution-dyed acrylic outdoor curtain fabric. UV-resistant, mould-proof, and colourfast for 5+ years of outdoor exposure.",
  },
  {
    id: "c14",
    name: "Marine-Grade Polyester Outdoor",
    division: "Curtain", type: "Outdoor", subtype: "Solution-dyed Polyester", origin: "Germany", originFlag: "🇩🇪",
    pricePerMeter: 22, minOrder: 8, unit: "meter", grade: "B",
    colors: ["#3d6296", "#1a1040", "#2e4a2e", "#c4622d"],
    imageUrl: IMG.curtain,
    seller: "@hamburg_outdoor", rating: 4.6, reviews: 231, inStock: true,
    description: "German marine-grade solution-dyed polyester for pergolas, terraces and sun rooms. Waterproof, anti-fungal coating with 300cm wide rolls available.",
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // UPHOLSTERY FABRICS
  // ══════════════════════════════════════════════════════════════════════════════

  // Velvet Upholstery
  {
    id: "u1",
    name: "Plain Cut Velvet — Teal",
    division: "Upholstery", type: "Velvet", subtype: "Cut Velvet", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 68, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#006466", "#007a7c", "#005050", "#004040"],
    imageUrl: IMG.velvet,
    seller: "@milan_upholstery", rating: 4.9, reviews: 78, inStock: true,
    description: "Dense-pile cut velvet upholstery with 32,000 Martindale rub count. Suitable for sofas, dining chairs and statement headboards.",
  },
  {
    id: "u2",
    name: "Crushed Velvet — Dusty Rose",
    division: "Upholstery", type: "Velvet", subtype: "Crushed Velvet", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 38, minOrder: 3, unit: "meter", grade: "B",
    colors: ["#d4a0a0", "#c47e8a", "#b5707a", "#f5e8e8"],
    imageUrl: IMG.velvet,
    seller: "@istanbul_upholstery", rating: 4.6, reviews: 156, inStock: true,
    description: "On-trend crushed velvet upholstery fabric with a multi-directional sheen. 25,000 Martindale rub count — suitable for accent chairs and cushions.",
  },

  // Leather
  {
    id: "u3",
    name: "Italian Full-Grain Leather",
    division: "Upholstery", type: "Leather", subtype: "Full-grain Leather", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 185, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#6b3a2a", "#4a2518", "#8b5239", "#d4a07a"],
    imageUrl: IMG.leather,
    seller: "@florence_leather", rating: 5.0, reviews: 43, inStock: true,
    description: "Vegetable-tanned Tuscan full-grain leather with natural markings and a rich patina that deepens with age. The highest grade of upholstery leather available.",
  },
  {
    id: "u4",
    name: "Top-Grain Corrected Leather",
    division: "Upholstery", type: "Leather", subtype: "Top-grain Leather", origin: "Spain", originFlag: "🇪🇸",
    pricePerMeter: 95, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#4a3728", "#6b3a2a", "#8b7355", "#d4c5a9"],
    imageUrl: IMG.leather,
    seller: "@madrid_piel", rating: 4.7, reviews: 122, inStock: true,
    description: "Spanish top-grain corrected leather with consistent colour and a uniform embossed grain. Highly durable, easy to clean, and water-resistant.",
  },
  {
    id: "u5",
    name: "Premium Faux Leather PU",
    division: "Upholstery", type: "Leather", subtype: "Faux Leather", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 18, minOrder: 10, unit: "meter", grade: "B",
    colors: ["#1a1040", "#4a3728", "#2c2c2c", "#8b7355"],
    imageUrl: IMG.leather,
    seller: "@guangzhou_pu", rating: 4.4, reviews: 567, inStock: true,
    description: "High-quality PU faux leather with a natural-grain emboss. 40,000 Martindale rub count, ideal for commercial restaurant seating and automotive applications.",
  },

  // Other Upholstery
  {
    id: "u6",
    name: "Belgian Linen Blend Upholstery",
    division: "Upholstery", type: "Linen", subtype: "Linen Upholstery Blend", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 32, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#d4c5a9", "#b8a78a", "#8b7d6b", "#f5f0e8"],
    imageUrl: IMG.linen,
    seller: "@brussels_upholstery", rating: 4.7, reviews: 201, inStock: true,
    description: "Heavy-weight Belgian linen-cotton upholstery blend with a 30,000 Martindale rub count. Natural, breathable, and beautifully textured for sofas and armchairs.",
  },
  {
    id: "u7",
    name: "Cotton Canvas Duck",
    division: "Upholstery", type: "Cotton", subtype: "Cotton Canvas", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 14, minOrder: 8, unit: "meter", grade: "B",
    colors: ["#f5f0e8", "#d4c5a9", "#8b7d6b", "#4a3728"],
    imageUrl: IMG.cotton,
    seller: "@carolina_canvas", rating: 4.5, reviews: 389, inStock: true,
    description: "10oz cotton duck canvas — the workhorse of upholstery. Sturdy, breathable and pre-shrunk. Ideal for slipcovers, cushion covers and ottomans.",
  },
  {
    id: "u8",
    name: "Boucle Upholstery — Cream",
    division: "Upholstery", type: "Wool", subtype: "Boucle", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 78, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c5a9", "#fff8f0"],
    imageUrl: IMG.bouclé,
    seller: "@paris_boucle", rating: 4.9, reviews: 134, inStock: true,
    description: "Luxurious French boucle in a looped-yarn texture that defines the contemporary design aesthetic. Wool-nylon blend for durability with the look and feel of pure wool.",
  },
  {
    id: "u9",
    name: "Chenille Sofa Fabric",
    division: "Upholstery", type: "Cotton", subtype: "Chenille", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 22, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#7a4f2c", "#c4622d", "#1a1040", "#4e8a63"],
    imageUrl: IMG.chenille,
    seller: "@istanbul_chenille", rating: 4.6, reviews: 478, inStock: true,
    description: "Velvety chenille upholstery with a soft, pile-like texture. 25,000 Martindale rub count. One of the most popular and practical sofa fabrics worldwide.",
  },
  {
    id: "u10",
    name: "Microfiber Suede Upholstery",
    division: "Upholstery", type: "Synthetic", subtype: "Microfiber", origin: "South Korea", originFlag: "🇰🇷",
    pricePerMeter: 16, minOrder: 8, unit: "meter", grade: "B",
    colors: ["#4a3728", "#8b7355", "#6b5a4a", "#d4c5a9"],
    imageUrl: IMG.upholstery,
    seller: "@seoul_microfiber", rating: 4.5, reviews: 634, inStock: true,
    description: "Korean ultra-microfiber suede upholstery — stain-resistant, pet-friendly and fade-proof. Exceptionally soft with a genuine suede appearance.",
  },
  {
    id: "u11",
    name: "European Tapestry Upholstery",
    division: "Upholstery", type: "Wool", subtype: "Tapestry", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 45, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#c4622d", "#1a1040", "#ffd700", "#4e8a63"],
    imageUrl: IMG.brocade,
    seller: "@brussels_tapestry", rating: 4.8, reviews: 98, inStock: true,
    description: "Flemish tapestry-woven upholstery with medallion and flora motifs in a wool-cotton blend. 40,000 Martindale rub count — built for heirloom-quality furniture.",
  },
  {
    id: "u12",
    name: "Sunbrella Outdoor Upholstery",
    division: "Upholstery", type: "Outdoor", subtype: "Sunbrella Acrylic", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 38, minOrder: 4, unit: "meter", grade: "A",
    colors: ["#3d6296", "#2e4a2e", "#c4622d", "#f5f0e8"],
    imageUrl: IMG.curtain,
    seller: "@sunbrella_official", rating: 4.9, reviews: 712, inStock: true,
    description: "Marine-grade Sunbrella solution-dyed acrylic for outdoor furniture. 100% UV resistant, waterproof, and mould-proof. The global standard for outdoor upholstery.",
  },
  {
    id: "u13",
    name: "Olefin Outdoor Fabric",
    division: "Upholstery", type: "Outdoor", subtype: "Olefin", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 24, minOrder: 6, unit: "meter", grade: "B",
    colors: ["#2e4a2e", "#3d6296", "#6b5a4a", "#f5f0e8"],
    imageUrl: IMG.curtain,
    seller: "@dallas_outdoor", rating: 4.5, reviews: 389, inStock: true,
    description: "Budget-friendly Olefin outdoor upholstery fabric. Naturally stain-resistant, quick-drying, and colourfast. Ideal for poolside and patio furniture.",
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CARPET & RUG FABRICS
  // ══════════════════════════════════════════════════════════════════════════════

  // Wool Rugs
  {
    id: "r1",
    name: "Hand-Knotted Persian Rug Wool",
    division: "Carpet", type: "Wool", subtype: "Hand-knotted Persian", origin: "Iran", originFlag: "🇮🇷",
    pricePerMeter: 220, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#c4622d", "#1a1040", "#ffd700", "#8b0057"],
    imageUrl: IMG.persian,
    seller: "@tehran_rugs", rating: 5.0, reviews: 89, inStock: true,
    description: "Finest Iranian hand-knotted pile wool with 200+ knots per square inch. Each square meter takes weeks of work by master weavers following centuries-old cartoons.",
  },
  {
    id: "r2",
    name: "Turkish Kilim Wool",
    division: "Carpet", type: "Wool", subtype: "Hand-knotted Turkish", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 145, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#c4622d", "#1a1040", "#ffd700", "#4e8a63"],
    imageUrl: IMG.persian,
    seller: "@cappadocia_kilim", rating: 4.9, reviews: 134, inStock: true,
    description: "Hand-woven flatweave Kilim from Cappadocia using natural wool dyed with plants and minerals. Geometric Anatolian patterns with no pile for a flat, reversible weave.",
  },
  {
    id: "r3",
    name: "Moroccan Beni Ourain Wool",
    division: "Carpet", type: "Wool", subtype: "Hand-knotted Moroccan", origin: "Morocco", originFlag: "🇲🇦",
    pricePerMeter: 165, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#3d3028", "#1a1040"],
    imageUrl: IMG.persian,
    seller: "@atlas_berber", rating: 5.0, reviews: 76, inStock: true,
    description: "Thick-pile Beni Ourain Berber rug wool in natural undyed ivory with hand-drawn black geometric symbols. UNESCO Intangible Heritage craft from the Atlas Mountains.",
  },
  {
    id: "r4",
    name: "Afghan Bokhara Rug Wool",
    division: "Carpet", type: "Wool", subtype: "Hand-knotted Afghan", origin: "Afghanistan", originFlag: "🇦🇫",
    pricePerMeter: 130, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#8b0020", "#c4622d", "#1a1040", "#ffd700"],
    imageUrl: IMG.persian,
    seller: "@kabul_rugs", rating: 4.8, reviews: 62, inStock: true,
    description: "Afghan Bokhara rug wool hand-knotted by Tekke Turkmen weavers. Classic gül (flower) motifs in deep madder red with 120+ knots per square inch.",
  },

  // Silk Rugs
  {
    id: "r5",
    name: "Hereke Silk Rug — Fine",
    division: "Carpet", type: "Silk", subtype: "Silk Rug", origin: "Turkey", originFlag: "🇹🇷",
    pricePerMeter: 780, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c4622d", "#8b0057", "#1a1040"],
    imageUrl: IMG.persian,
    seller: "@hereke_atelier", rating: 5.0, reviews: 18, inStock: true,
    description: "Hereke silk rug fabric with 900+ knots per square inch — among the world's finest. Pure silk pile on a silk warp and weft creates microscopic floral detail and an extraordinary iridescent sheen.",
  },
  {
    id: "r6",
    name: "Qom Silk Rug Fabric",
    division: "Carpet", type: "Silk", subtype: "Silk Rug", origin: "Iran", originFlag: "🇮🇷",
    pricePerMeter: 620, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#8b0057", "#c4622d", "#ffd700", "#1a1040"],
    imageUrl: IMG.persian,
    seller: "@qom_silk", rating: 5.0, reviews: 22, inStock: true,
    description: "Qom (Qum) pure-silk rug material with 500+ KPSI. One of Iran's most celebrated rug cities — patterns include hunting scenes, gardens, and medallions of extreme intricacy.",
  },

  // Cotton Flatweave
  {
    id: "r7",
    name: "Indian Dhurrie Flatweave",
    division: "Carpet", type: "Cotton", subtype: "Cotton Flatweave", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 24, minOrder: 2, unit: "meter", grade: "B",
    colors: ["#c4622d", "#ffd700", "#4e8a63", "#f5f0e8"],
    imageUrl: IMG.carpet,
    seller: "@jaipur_dhurrie", rating: 4.7, reviews: 312, inStock: true,
    description: "Hand-woven Indian Dhurrie flatweave in cotton with bold geometric patterns. Reversible, machine-washable, and perfect for contemporary and boho-style interiors.",
  },
  {
    id: "r8",
    name: "Swedish Rya Flatweave Cotton",
    division: "Carpet", type: "Cotton", subtype: "Cotton Flatweave", origin: "Sweden", originFlag: "🇸🇪",
    pricePerMeter: 35, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#4a3728", "#4e8a63"],
    imageUrl: IMG.carpet,
    seller: "@stockholm_rya", rating: 4.6, reviews: 178, inStock: true,
    description: "Scandinavian Rya flatweave cotton rug fabric with long hand-knotted pile tufts. Traditional Nordic craft reimagined in contemporary natural palettes.",
  },

  // Synthetic Carpet
  {
    id: "r9",
    name: "Nylon Carpet Broadloom",
    division: "Carpet", type: "Synthetic", subtype: "Nylon Broadloom", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 18, minOrder: 20, unit: "meter", grade: "B",
    colors: ["#d4c5a9", "#8b7d6b", "#4a3728", "#1a1040"],
    imageUrl: IMG.carpet,
    seller: "@shaw_carpets", rating: 4.5, reviews: 892, inStock: true,
    description: "Commercial-grade nylon broadloom carpet with solution dyeing for exceptional stain resistance. 30,000+ hours wear rating — ideal for hotels, offices and high-traffic residential.",
  },
  {
    id: "r10",
    name: "Polypropylene Berber Loop",
    division: "Carpet", type: "Synthetic", subtype: "Polypropylene Berber", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 12, minOrder: 20, unit: "meter", grade: "B",
    colors: ["#d4c5a9", "#b8a78a", "#8b7d6b", "#f5f0e8"],
    imageUrl: IMG.carpet,
    seller: "@brussels_carpet", rating: 4.4, reviews: 567, inStock: true,
    description: "Polypropylene Berber loop pile carpet — the most practical choice for kitchens, hallways and commercial spaces. Waterproof, fade-resistant and very easy to maintain.",
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // CLOTHING FABRICS — SILK SUBCATEGORIES
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "cl-s1",
    name: "French Charmeuse Silk",
    division: "Clothing", type: "Silk", subtype: "Charmeuse", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 42, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#c4622d", "#8b0057", "#ffd700"],
    imageUrl: IMG.silk,
    seller: "@lyon_charmeuse", rating: 4.8, reviews: 134, inStock: true,
    description: "Pure silk charmeuse with a liquid drape and glossy satin face with a dull crepe back. Essential for luxury blouses, lingerie, and flowing evening gowns.",
  },
  {
    id: "cl-s2",
    name: "Silk Chiffon — Pearl",
    division: "Clothing", type: "Silk", subtype: "Chiffon", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 28, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#ffffff", "#f2e8d0", "#e8dcc8"],
    imageUrl: IMG.silk,
    seller: "@hangzhou_chiffon", rating: 4.7, reviews: 189, inStock: true,
    description: "Lightweight silk chiffon in a gossamer plain weave — airy, translucent, and beautifully draped. Classic choice for overlays, scarves, and floaty sleeves.",
  },
  {
    id: "cl-s3",
    name: "Silk Crepe de Chine",
    division: "Clothing", type: "Silk", subtype: "Crepe", origin: "Japan", originFlag: "🇯🇵",
    pricePerMeter: 38, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#1a1040", "#8b0057", "#2d4a8c", "#006466"],
    imageUrl: IMG.silk,
    seller: "@kyoto_crepe", rating: 4.9, reviews: 98, inStock: true,
    description: "Japanese silk crepe de chine with a fine crinkled surface texture and a subtle matte lustre. Perfect for tailored shirts, dresses, and kimono-inspired garments.",
  },

  // ── CLOTHING FABRICS — COTTON SUBCATEGORIES ─────────────────────────────────
  {
    id: "cl-c1",
    name: "Egyptian Giza 45 Cotton",
    division: "Clothing", type: "Cotton", subtype: "Egyptian Giza", origin: "Egypt", originFlag: "🇪🇬",
    pricePerMeter: 16, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#ffffff", "#e8dcc8", "#d4c5a9"],
    imageUrl: IMG.cotton,
    seller: "@cairo_weaver", rating: 5.0, reviews: 267, inStock: true,
    description: "Giza 45 extra-long-staple Egyptian cotton — the pinnacle of cotton quality. Exceptionally smooth, strong, and with a natural lustre. Ideal for premium shirts and bed linen.",
  },
  {
    id: "cl-c2",
    name: "Supima Pima Cotton",
    division: "Clothing", type: "Cotton", subtype: "Pima", origin: "USA", originFlag: "🇺🇸",
    pricePerMeter: 13, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#7b9e87", "#2d4a8c"],
    imageUrl: IMG.cotton,
    seller: "@arizona_pima", rating: 4.7, reviews: 312, inStock: true,
    description: "American Supima-certified Pima cotton with extra-long staples grown in California and Arizona. Three times stronger than regular cotton, silky soft with vivid colour retention.",
  },
  {
    id: "cl-c3",
    name: "Indian Muslin — Fine",
    division: "Clothing", type: "Cotton", subtype: "Muslin", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 7, minOrder: 10, unit: "meter", grade: "B",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c5a9", "#b8a78a"],
    imageUrl: IMG.cotton,
    seller: "@dhaka_muslin", rating: 4.5, reviews: 445, inStock: true,
    description: "Fine plain-weave muslin cotton — the original 'woven air' of South Asia. Lightweight, breathable, and versatile for garments, linings, and toiles.",
  },
  {
    id: "cl-c4",
    name: "Swiss Cotton Voile",
    division: "Clothing", type: "Cotton", subtype: "Voile", origin: "Switzerland", originFlag: "🇨🇭",
    pricePerMeter: 9, minOrder: 8, unit: "meter", grade: "A",
    colors: ["#ffffff", "#f5f0e8", "#e8dcc8", "#c8e6d4"],
    imageUrl: IMG.cotton,
    seller: "@zurich_voile", rating: 4.8, reviews: 198, inStock: true,
    description: "Swiss cotton voile — a fine, slightly stiff plain weave that holds its shape beautifully. Classic choice for blouses, baby garments, and curtain sheers.",
  },
  {
    id: "cl-c5",
    name: "Liberty Cotton Lawn",
    division: "Clothing", type: "Cotton", subtype: "Lawn", origin: "UK", originFlag: "🇬🇧",
    pricePerMeter: 18, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#f2c6b4", "#c8e6d4", "#b5c8e8", "#ffd700"],
    imageUrl: IMG.cotton,
    seller: "@london_liberty", rating: 4.9, reviews: 312, inStock: true,
    description: "Fine plain-weave cotton lawn of the type made famous by Liberty of London. An ultra-lightweight, semi-sheer fabric perfect for delicate blouses, dresses, and children's clothing.",
  },
  {
    id: "cl-c6",
    name: "Oxford Weave Poplin",
    division: "Clothing", type: "Cotton", subtype: "Poplin", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 11, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#ffffff", "#f5f0e8", "#2d4a8c", "#1a1040"],
    imageUrl: IMG.cotton,
    seller: "@milan_poplin", rating: 4.6, reviews: 378, inStock: true,
    description: "Tightly woven Italian cotton poplin with a characteristic fine rib texture. The definitive shirt fabric — crisp, cool, and with a subtle lustre. Available in 150+ colours.",
  },

  // ── CLOTHING FABRICS — WOOL SUBCATEGORIES ────────────────────────────────────
  {
    id: "cl-w1",
    name: "Scottish Cashmere Fine",
    division: "Clothing", type: "Wool", subtype: "Cashmere", origin: "UK", originFlag: "🇬🇧",
    pricePerMeter: 125, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#1a1040", "#8b5679"],
    imageUrl: IMG.wool,
    seller: "@hawick_cashmere", rating: 5.0, reviews: 89, inStock: true,
    description: "2-ply Scottish cashmere milled in the Scottish Borders — the world capital of cashmere knitwear. Ultra-fine 14-micron fibres sourced from Mongolian hircus goats.",
  },
  {
    id: "cl-w2",
    name: "Ladakhi Pashmina",
    division: "Clothing", type: "Wool", subtype: "Pashmina", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 95, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#8b5679", "#c4622d", "#1a1040"],
    imageUrl: IMG.wool,
    seller: "@srinagar_pashmina", rating: 5.0, reviews: 67, inStock: true,
    description: "Authentic GI-certified Pashmina from Ladakh, hand-spun and hand-woven from the fleece of Changthangi goats at 4,500m altitude. The finest cashmere on Earth.",
  },
  {
    id: "cl-w3",
    name: "South African Mohair",
    division: "Clothing", type: "Wool", subtype: "Mohair", origin: "South Africa", originFlag: "🇿🇦",
    pricePerMeter: 68, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#ffd700", "#c4622d"],
    imageUrl: IMG.wool,
    seller: "@karoo_mohair", rating: 4.8, reviews: 112, inStock: true,
    description: "South African kid mohair — exceptionally lustrous, silky, and strong. The Eastern Cape Karoo is the world's primary mohair producing region. Anti-wrinkle and dye-receptive.",
  },
  {
    id: "cl-w4",
    name: "Harris Tweed — Hebrides",
    division: "Clothing", type: "Wool", subtype: "Tweed", origin: "UK", originFlag: "🇬🇧",
    pricePerMeter: 55, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#4a3728", "#7a6e5e", "#2e4a2e", "#8b7d6b"],
    imageUrl: IMG.wool,
    seller: "@harris_tweed", rating: 4.9, reviews: 134, inStock: true,
    description: "Certified Harris Tweed handwoven by islanders in the Outer Hebrides of Scotland — protected by UK law. Made from 100% pure virgin wool dyed and spun on the islands.",
  },

  // ── CLOTHING FABRICS — LINEN SUBCATEGORIES ───────────────────────────────────
  {
    id: "cl-l1",
    name: "Irish Linen — Washed",
    division: "Clothing", type: "Linen", subtype: "Irish Linen", origin: "Ireland", originFlag: "🇮🇪",
    pricePerMeter: 22, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#8b7d6b", "#c4622d"],
    imageUrl: IMG.linen,
    seller: "@ulster_linen", rating: 4.8, reviews: 178, inStock: true,
    description: "Stone-washed pure Irish linen — a heritage fabric of Ulster with centuries of tradition. Enzyme-washed for exceptional softness while retaining linen's natural texture and breathability.",
  },
  {
    id: "cl-l2",
    name: "French Normandy Linen",
    division: "Clothing", type: "Linen", subtype: "French Linen", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 19, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#e8dcc8", "#d4c5a9", "#b8a78a", "#f5f0e8"],
    imageUrl: IMG.linen,
    seller: "@normandy_lin", rating: 4.7, reviews: 201, inStock: true,
    description: "Normandy-grown and milled French linen with a fine, even weave. Cool against the skin and improving in softness with every wash — France's answer to Belgian flax.",
  },
  {
    id: "cl-l3",
    name: "Egyptian Flax Linen",
    division: "Clothing", type: "Linen", subtype: "Egyptian Linen", origin: "Egypt", originFlag: "🇪🇬",
    pricePerMeter: 21, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#e8dcc8", "#c8a882", "#d4c5a9"],
    imageUrl: IMG.linen,
    seller: "@alexandria_linen", rating: 4.6, reviews: 156, inStock: true,
    description: "Egyptian Nile Delta flax linen — warm-climate fibre with a distinctive golden tone and exceptional durability. Traditionally used for pharaonic burial shrouds; today a luxury fashion staple.",
  },

  // ── CLOTHING FABRICS — SYNTHETIC SUBCATEGORIES ───────────────────────────────
  {
    id: "cl-sy1",
    name: "Recycled Polyester Woven",
    division: "Clothing", type: "Synthetic", subtype: "Polyester", origin: "South Korea", originFlag: "🇰🇷",
    pricePerMeter: 6, minOrder: 20, unit: "meter", grade: "B",
    colors: ["#1a1040", "#2d4a8c", "#4a4a4a", "#f5f0e8"],
    imageUrl: IMG.linen,
    seller: "@seoul_poly", rating: 4.4, reviews: 678, inStock: true,
    description: "GRS-certified recycled polyester woven fabric from post-consumer PET bottles. Wrinkle-resistant, moisture-wicking, and suitable for workwear, activewear, and linings.",
  },
  {
    id: "cl-sy2",
    name: "Performance Nylon Ripstop",
    division: "Clothing", type: "Synthetic", subtype: "Nylon", origin: "Taiwan", originFlag: "🇹🇼",
    pricePerMeter: 9, minOrder: 15, unit: "meter", grade: "B",
    colors: ["#1a1040", "#2e4a2e", "#c4622d", "#3d6296"],
    imageUrl: IMG.linen,
    seller: "@taipei_nylon", rating: 4.5, reviews: 445, inStock: true,
    description: "Lightweight nylon ripstop with a reinforced grid weave that prevents tears from spreading. Water-repellent DWR finish. Ideal for outdoor jackets, windbreakers, and sportswear.",
  },
  {
    id: "cl-sy3",
    name: "Stretch Spandex Jersey",
    division: "Clothing", type: "Synthetic", subtype: "Spandex", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 8, minOrder: 10, unit: "meter", grade: "B",
    colors: ["#1a1040", "#8b0057", "#2d4a8c", "#006466"],
    imageUrl: IMG.linen,
    seller: "@guangzhou_stretch", rating: 4.3, reviews: 892, inStock: true,
    description: "4-way stretch spandex-nylon jersey with 80% recovery rate. The foundation fabric for swimwear, activewear, dance costumes, and fitted garments.",
  },
  {
    id: "cl-sy4",
    name: "Viscose Rayon — Printed",
    division: "Clothing", type: "Synthetic", subtype: "Viscose", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 7, minOrder: 10, unit: "meter", grade: "B",
    colors: ["#c4622d", "#ffd700", "#8b0057", "#2d4a8c"],
    imageUrl: IMG.batik,
    seller: "@surat_viscose", rating: 4.4, reviews: 1024, inStock: true,
    description: "Viscose rayon with a fluid, silk-like drape and vibrant digital or screen print. Breathable and cool for tropical climates. India's most widely produced synthetic fibre for fashion.",
  },
  {
    id: "cl-sy5",
    name: "Lenzing Modal Knit",
    division: "Clothing", type: "Synthetic", subtype: "Modal", origin: "Austria", originFlag: "🇦🇹",
    pricePerMeter: 12, minOrder: 8, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#d4c5a9", "#1a1040", "#7b9e87"],
    imageUrl: IMG.linen,
    seller: "@vienna_modal", rating: 4.7, reviews: 312, inStock: true,
    description: "Lenzing-certified ECOVERO Modal knit — a bio-based fibre from sustainably sourced beechwood. 50% softer than cotton, with superior dye uptake and minimal shrinkage.",
  },
  {
    id: "cl-sy6",
    name: "Tencel Lyocell Twill",
    division: "Clothing", type: "Synthetic", subtype: "Tencel", origin: "Austria", originFlag: "🇦🇹",
    pricePerMeter: 14, minOrder: 5, unit: "meter", grade: "A",
    colors: ["#7b9e87", "#2e4a2e", "#f5f0e8", "#d4c5a9"],
    imageUrl: IMG.linen,
    seller: "@tencel_austria", rating: 4.8, reviews: 267, inStock: true,
    description: "Lenzing TENCEL lyocell twill — produced in a closed-loop solvent process with 99% solvent recovery. Exceptionally smooth, breathable, and biodegradable. The sustainable alternative to silk.",
  },

  // ── CLOTHING FABRICS — TRADITIONAL SUBCATEGORIES ─────────────────────────────
  {
    id: "cl-t1",
    name: "Kanchipuram Silk — Gold",
    division: "Clothing", type: "Cultural", subtype: "Kanchipuram", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 110, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#8b0057", "#ffd700", "#c4622d", "#1a1040"],
    imageUrl: IMG.brocade,
    seller: "@kanchi_silk", rating: 5.0, reviews: 78, inStock: true,
    description: "GI-certified Kanchipuram silk from Tamil Nadu — India's most prestigious silk weaving tradition. Three-shuttle technique creates distinct contrasting borders and pallav with real zari.",
  },
  {
    id: "cl-t2",
    name: "Banarasi Silk Georgette",
    division: "Clothing", type: "Cultural", subtype: "Banarasi Silk", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 85, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#c4622d", "#ffd700", "#8b0057", "#1a1040"],
    imageUrl: IMG.brocade,
    seller: "@banaras_zari", rating: 4.9, reviews: 91, inStock: true,
    description: "Banarasi silk georgette with exquisite jangla buti embroidery in gold and silver zari. Used for the finest bridal sarees, lehengas, and occasion wear.",
  },
  {
    id: "cl-t3",
    name: "Scottish Tartan Wool",
    division: "Clothing", type: "Cultural", subtype: "Tartan", origin: "UK", originFlag: "🇬🇧",
    pricePerMeter: 38, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#8b0020", "#1a5c38", "#ffd700", "#1a1040"],
    imageUrl: IMG.wool,
    seller: "@edinburgh_tartan", rating: 4.8, reviews: 167, inStock: true,
    description: "Authentic registered clan tartan in pure Scottish wool twill. Each sett is held on the Scottish Register of Tartans. Woven in Selkirk using traditional four-shaft looms.",
  },
  {
    id: "cl-t4",
    name: "Silk Georgette — Rose",
    division: "Clothing", type: "Cultural", subtype: "Georgette", origin: "India", originFlag: "🇮🇳",
    pricePerMeter: 24, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#e8a0b0", "#c47e8a", "#f5e8e8", "#8b0057"],
    imageUrl: IMG.silk,
    seller: "@surat_georgette", rating: 4.6, reviews: 312, inStock: true,
    description: "Pure silk georgette with highly twisted S and Z yarns creating a grainy, crepe-like surface. Drapes beautifully for sarees, kurtas, and draped eveningwear.",
  },
  {
    id: "cl-t5",
    name: "Alençon Chantilly Lace",
    division: "Clothing", type: "Cultural", subtype: "Chantilly", origin: "France", originFlag: "🇫🇷",
    pricePerMeter: 98, minOrder: 1, unit: "meter", grade: "A",
    colors: ["#f5f0e8", "#1a1040", "#ffffff", "#e8dcc8"],
    imageUrl: IMG.lace,
    seller: "@alencon_atelier", rating: 4.9, reviews: 34, inStock: true,
    description: "Alençon-style needle lace in fine cotton and silk blend — France's most celebrated lace tradition. Raised outlining cord on a net ground creates three-dimensional floral motifs.",
  },
  {
    id: "cl-t6",
    name: "Jacquard Tapestry Cloth",
    division: "Clothing", type: "Luxury", subtype: "Jacquard", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 48, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#1a1040", "#c4622d", "#ffd700", "#4e8a63"],
    imageUrl: IMG.brocade,
    seller: "@ghent_jacquard", rating: 4.7, reviews: 98, inStock: true,
    description: "Belgian Jacquard tapestry cloth with complex woven imagery in multiple colours and textures. Used for structured jackets, coats, and decorative fashion applications.",
  },
  {
    id: "cl-t7",
    name: "Cut Velvet Evening Fabric",
    division: "Clothing", type: "Luxury", subtype: "Velvet", origin: "Italy", originFlag: "🇮🇹",
    pricePerMeter: 72, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#8b0057", "#1a1040", "#c4622d", "#006466"],
    imageUrl: IMG.velvet,
    seller: "@milan_velvet", rating: 4.9, reviews: 67, inStock: true,
    description: "Italian cut-pile velvet for eveningwear with dense, uniform pile and exceptional depth of colour. Flows superbly for palazzo trousers, structured blazers, and cocktail dresses.",
  },
  {
    id: "cl-t8",
    name: "Damask Silk Evening Fabric",
    division: "Clothing", type: "Luxury", subtype: "Damask", origin: "Syria", originFlag: "🇸🇾",
    pricePerMeter: 62, minOrder: 2, unit: "meter", grade: "A",
    colors: ["#ffd700", "#c4622d", "#1a1040", "#8b0057"],
    imageUrl: IMG.brocade,
    seller: "@damascus_weave", rating: 4.8, reviews: 45, inStock: true,
    description: "Pure silk damask with reversible self-patterned roses and paisleys. Woven on heritage looms in Damascus — a garment-weight fabric for structured occasion wear and evening coats.",
  },

  // ── UPHOLSTERY — ADDITIONAL SUBCATEGORIES ────────────────────────────────────
  {
    id: "u14",
    name: "Plain Velvet Upholstery — Navy",
    division: "Upholstery", type: "Velvet", subtype: "Plain Velvet", origin: "Belgium", originFlag: "🇧🇪",
    pricePerMeter: 52, minOrder: 3, unit: "meter", grade: "A",
    colors: ["#1a2a5e", "#2d4a8c", "#0d1a3d", "#1a1040"],
    imageUrl: IMG.velvet,
    seller: "@ghent_velvet", rating: 4.8, reviews: 134, inStock: true,
    description: "Belgian plain-pile velvet upholstery in deep navy — 40,000 Martindale rub count. Suitable for period and contemporary furniture alike. Available in 45 colourways.",
  },
  {
    id: "u15",
    name: "Bonded Leather Panel",
    division: "Upholstery", type: "Leather", subtype: "Bonded Leather", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 12, minOrder: 10, unit: "meter", grade: "C",
    colors: ["#1a1040", "#4a3728", "#8b7355", "#2c2c2c"],
    imageUrl: IMG.leather,
    seller: "@guangzhou_bonded", rating: 4.1, reviews: 389, inStock: true,
    description: "Bonded leather made from shredded leather fibres and polyurethane binder. The most affordable leather-look upholstery option — suitable for low-use decorative applications.",
  },

  // ── CARPET — ADDITIONAL SUBCATEGORIES ────────────────────────────────────────
  {
    id: "r11",
    name: "Bamboo Silk Rug — Natural",
    division: "Carpet", type: "Silk", subtype: "Bamboo Silk Rug", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 95, minOrder: 1, unit: "meter", grade: "B",
    colors: ["#f5f0e8", "#e8dcc8", "#d4c5a9", "#c9a86c"],
    imageUrl: IMG.persian,
    seller: "@beijing_bamboo", rating: 4.6, reviews: 134, inStock: true,
    description: "Bamboo viscose rug fabric with a high lustre resembling silk at a fraction of the cost. Woven on power looms with dense pile for a plush underfoot feel.",
  },
  {
    id: "r12",
    name: "Jute Natural Fibre Carpet",
    division: "Carpet", type: "Cotton", subtype: "Natural Fibre", origin: "Bangladesh", originFlag: "🇧🇩",
    pricePerMeter: 14, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#c8a882", "#a07c2e", "#8b7355", "#6b5a4a"],
    imageUrl: IMG.carpet,
    seller: "@dhaka_jute", rating: 4.4, reviews: 267, inStock: true,
    description: "Hand-woven jute carpet in a herringbone flatweave. Fully biodegradable and sustainably sourced — the eco-friendly flooring choice for natural interior schemes.",
  },
  {
    id: "r13",
    name: "Seagrass Woven Matting",
    division: "Carpet", type: "Synthetic", subtype: "Natural Matting", origin: "China", originFlag: "🇨🇳",
    pricePerMeter: 16, minOrder: 5, unit: "meter", grade: "B",
    colors: ["#7a6e5e", "#8b7d6b", "#a07c2e", "#c8a882"],
    imageUrl: IMG.carpet,
    seller: "@nanjing_seagrass", rating: 4.3, reviews: 312, inStock: true,
    description: "Tightly woven seagrass matting with a distinctive chequered texture. Naturally water-resistant and anti-static. Popular for coastal and Scandi-inspired interior schemes.",
  },
];

const SELLERS: Seller[] = [
  {
    id: "s1", username: "@cairo_weaver", displayName: "Cairo Weaver Co.",
    country: "Egypt", countryFlag: "🇪🇬",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 4.9, totalSales: 1240, totalListings: 28,
    specialties: ["Cotton", "Cultural"], verified: true, memberSince: "2022",
    responseTime: "< 1h",
  },
  {
    id: "s2", username: "@varanasi_silk", displayName: "Varanasi Silk House",
    country: "India", countryFlag: "🇮🇳",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 4.8, totalSales: 876, totalListings: 42,
    specialties: ["Silk", "Luxury"], verified: true, memberSince: "2021",
    responseTime: "< 2h",
  },
  {
    id: "s3", username: "@brussels_linen", displayName: "Brussels Linen Studio",
    country: "Belgium", countryFlag: "🇧🇪",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 4.7, totalSales: 623, totalListings: 15,
    specialties: ["Linen", "Luxury"], verified: true, memberSince: "2023",
    responseTime: "< 3h",
  },
  {
    id: "s4", username: "@marrakech_craft", displayName: "Marrakech Craft",
    country: "Morocco", countryFlag: "🇲🇦",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 5.0, totalSales: 389, totalListings: 11,
    specialties: ["Cultural"], verified: false, memberSince: "2023",
    responseTime: "< 4h",
  },
  {
    id: "s5", username: "@accra_kente", displayName: "Accra Kente Masters",
    country: "Ghana", countryFlag: "🇬🇭",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 5.0, totalSales: 512, totalListings: 8,
    specialties: ["Cultural"], verified: true, memberSince: "2023",
    responseTime: "< 2h",
  },
  {
    id: "s6", username: "@jogja_batik", displayName: "Jogja Batik Studio",
    country: "Indonesia", countryFlag: "🇮🇩",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 5.0, totalSales: 734, totalListings: 22,
    specialties: ["Cultural"], verified: true, memberSince: "2022",
    responseTime: "< 1h",
  },
  {
    id: "s7", username: "@milan_velvet", displayName: "Milan Velvet Atelier",
    country: "Italy", countryFlag: "🇮🇹",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 5.0, totalSales: 298, totalListings: 14,
    specialties: ["Luxury"], verified: true, memberSince: "2023",
    responseTime: "< 3h",
  },
  {
    id: "s8", username: "@samarkand_ikat", displayName: "Samarkand Ikat House",
    country: "Uzbekistan", countryFlag: "🇺🇿",
    avatar: "/placeholder.svg?height=56&width=56",
    rating: 4.9, totalSales: 187, totalListings: 9,
    specialties: ["Cultural", "Silk"], verified: true, memberSince: "2024",
    responseTime: "< 4h",
  },
];

const DIVISIONS = [
  { id: "all",        label: "All Divisions", labelAr: "الكل",          bgColor: "#1a1040" },
  { id: "Clothing",   label: "Clothing",      labelAr: "ملابس",         bgColor: "#8b5679" },
  { id: "Curtain",    label: "Curtains",      labelAr: "ستائر",         bgColor: "#5b8fa8" },
  { id: "Upholstery", label: "Upholstery",    labelAr: "أثاث منجد",    bgColor: "#6b3a2a" },
  { id: "Carpet",     label: "Carpet & Rugs", labelAr: "سجاد",          bgColor: "#7a4f2c" },
] as const;

const CATEGORIES = [
  { id: "all",       label: "All Types",  labelAr: "الكل",     bgColor: "#1a1040", icon: "◈" },
  { id: "Cotton",    label: "Cotton",     labelAr: "قطن",      bgColor: "#4e8a63", icon: "☁" },
  { id: "Silk",      label: "Silk",       labelAr: "حرير",     bgColor: "#8b5679", icon: "✦" },
  { id: "Linen",     label: "Linen",      labelAr: "كتان",     bgColor: "#a07c2e", icon: "▣" },
  { id: "Wool",      label: "Wool",       labelAr: "صوف",      bgColor: "#7a4f2c", icon: "◉" },
  { id: "Synthetic", label: "Synthetic",  labelAr: "صناعي",    bgColor: "#3d6296", icon: "◆" },
  { id: "Luxury",    label: "Luxury",     labelAr: "فاخر",     bgColor: "#7a3b8c", icon: "♦" },
  { id: "Cultural",  label: "Cultural",   labelAr: "تراثي",    bgColor: "#c4622d", icon: "⬟" },
  { id: "Leather",   label: "Leather",    labelAr: "جلد",      bgColor: "#6b3a2a", icon: "◼" },
  { id: "Sheer",     label: "Sheer",      labelAr: "شفاف",     bgColor: "#5b8fa8", icon: "◻" },
  { id: "Blackout",  label: "Blackout",   labelAr: "معتم",     bgColor: "#2c3e50", icon: "■" },
  { id: "Outdoor",   label: "Outdoor",    labelAr: "خارجي",    bgColor: "#2e7d52", icon: "◆" },
  { id: "Velvet",    label: "Velvet",     labelAr: "مخمل",     bgColor: "#7a3b8c", icon: "◉" },
] as const;

const COUNTRIES_FILTER = [
  "All Countries",
  // Africa
  "Egypt", "Ghana", "Kenya", "Mali", "Morocco", "Nigeria", "South Africa",
  // Americas
  "Guatemala", "Mexico", "Peru", "USA",
  // Asia-Pacific
  "Afghanistan", "Bangladesh", "China", "India", "Indonesia", "Iran", "Japan",
  "Malaysia", "Philippines", "South Korea", "Taiwan", "Uzbekistan",
  // Europe
  "Austria", "Belgium", "France", "Germany", "Ireland", "Italy",
  "Spain", "Sweden", "Switzerland", "UK",
  // Middle East & Oceania
  "New Zealand", "Oman", "Palestine", "Syria", "Turkey",
];

const PRICE_RANGES = [
  { id: "all",   label: "Any Price",   labelAr: "أي سعر" },
  { id: "0-15",  label: "Under π15",  labelAr: "أقل من π15" },
  { id: "15-30", label: "π15 – π30",  labelAr: "π15 – π30" },
  { id: "30-50", label: "π30 – π50",  labelAr: "π30 – π50" },
  { id: "50+",   label: "π50+",       labelAr: "π50+" },
];

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({
  isRTL,
  onTabChange,
  onBuy,
}: {
  isRTL: boolean;
  onTabChange: (tab: TabId) => void;
  onBuy: (f: Fabric) => void;
}) {
  const { userData } = usePiAuth();
  const username = userData?.username ?? "Pioneer";
  const featured = FABRICS.filter((f) => f.grade === "A" && f.inStock).slice(0, 4);
  const newArrivals = FABRICS.filter((f) => f.inStock).slice(6, 10);

  return (
    <div className="flex flex-col pb-6 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden fabric-hero"
        style={{ minHeight: 260 }}
        role="banner"
      >
        {/* Vertical warp threads */}
        {[8, 22, 36, 50, 64, 78, 91].map((left, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: `${left}%`,
              width: i % 2 === 0 ? 8 : 3,
              background: i % 2 === 0
                ? "linear-gradient(to bottom, rgba(196,98,45,0) 0%, rgba(196,98,45,0.18) 40%, rgba(196,98,45,0) 100%)"
                : "linear-gradient(to bottom, rgba(245,240,232,0) 0%, rgba(245,240,232,0.055) 50%, rgba(245,240,232,0) 100%)",
              opacity: i % 2 === 0 ? 1 : 0.7,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Horizontal weft lines */}
        {[30, 55, 78].map((top, i) => (
          <div
            key={i}
            className="absolute inset-x-0 pointer-events-none"
            style={{
              top: `${top}%`,
              height: 1,
              background: "linear-gradient(to right, transparent 0%, rgba(245,240,232,0.06) 30%, rgba(245,240,232,0.06) 70%, transparent 100%)",
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative px-5 pt-8 pb-10">
          {/* Greeting line */}
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4"
            style={{
              color: "rgba(245,240,232,0.42)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {isRTL ? `مرحباً، @${username}` : `Welcome, @${username}`}
          </p>

          <h2
            className="text-[30px] font-bold leading-tight text-balance mb-3"
            style={{
              color: "#f5f0e8",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
              maxWidth: 300,
            }}
          >
            {isRTL ? "سوق الأقمشة العالمي" : "The Global Fabric Marketplace"}
          </h2>

          <p
            className="text-[13px] leading-relaxed mb-6"
            style={{
              color: "rgba(245,240,232,0.58)",
              fontFamily: "var(--font-inter), sans-serif",
              maxWidth: 280,
            }}
          >
            {isRTL
              ? "اشترِ وبع أفخر الأقمشة من 50+ دولة. ادفع بـ Pi."
              : "Buy & sell premium fabrics from 50+ countries. Pay with Pi."}
          </p>

          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => onTabChange("browse")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: "#c4622d",
                color: "#f5f0e8",
                fontFamily: "var(--font-inter), sans-serif",
                boxShadow: "0 4px 18px rgba(196,98,45,0.5)",
              }}
            >
              {isRTL ? "تصفح الأقمشة" : "Browse Fabrics"}
              <ArrowRight
                className="w-4 h-4"
                style={{ transform: isRTL ? "rotate(180deg)" : "none" }}
              />
            </button>
            <button
              onClick={() => onTabChange("sell")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: "rgba(245,240,232,0.09)",
                color: "#f5f0e8",
                border: "1px solid rgba(245,240,232,0.2)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {isRTL ? "ابدأ البيع" : "Start Selling"}
            </button>
          </div>
        </div>

        {/* Pi badge — positioned to not overlap RTL title */}
        <div
          className="absolute top-5"
          style={{ right: isRTL ? "auto" : 16, left: isRTL ? 16 : "auto" }}
          aria-hidden="true"
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center pi-glow"
            style={{
              backgroundColor: "rgba(196,98,45,0.22)",
              border: "1.5px solid rgba(196,98,45,0.42)",
            }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: "#e07840", fontFamily: "var(--font-inter), sans-serif" }}
            >
              π
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────────────────── */}
      <div
        className="flex mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ border: "1px solid #ddd4c0" }}
        aria-label="Marketplace stats"
      >
        {[
          { label: isRTL ? "بائع نشط" : "Sellers",   value: "2,400+" },
          { label: isRTL ? "قماش"      : "Fabrics",   value: "80k+" },
          { label: isRTL ? "دولة"      : "Countries", value: "60+" },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className="flex-1 text-center py-3"
            style={{
              borderRight: i < 2 ? "1px solid #ddd4c0" : "none",
              backgroundColor: "#fdfaf5",
            }}
          >
            <p
              className="text-[15px] font-bold leading-none mb-0.5"
              style={{ color: "#c4622d", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
            >
              {value}
            </p>
            <p
              className="text-[10px]"
              style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Division grid ───────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <h3
          className="text-base font-bold mb-3"
          style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
        >
          {isRTL ? "تصفح حسب القسم" : "Browse by Division"}
        </h3>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {DIVISIONS.filter((d) => d.id !== "all").map((div) => {
            const iconMap: Record<string, string> = {
              Clothing: "✦", Curtain: "◻", Upholstery: "◼", Carpet: "◉",
            };
            return (
              <button
                key={div.id}
                onClick={() => onTabChange("browse")}
                className="rounded-2xl flex items-center gap-3 px-4 py-3.5 transition-all active:scale-95"
                style={{ backgroundColor: "#fdfaf5", border: "1.5px solid #ddd4c0" }}
                aria-label={`Browse ${div.label}`}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                  style={{ backgroundColor: `${div.bgColor}18`, color: div.bgColor }}
                  aria-hidden="true"
                >
                  {iconMap[div.id] ?? "◈"}
                </span>
                <div className="text-left">
                  <p
                    className="text-[13px] font-bold leading-none mb-0.5"
                    style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                  >
                    {isRTL ? div.labelAr : div.label}
                  </p>
                  <p className="text-[10px]" style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}>
                    {isRTL ? "تصفح" : "Browse all"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <h3
          className="text-base font-bold mb-3"
          style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
        >
          {isRTL ? "تصفح حسب النوع" : "Browse by Material"}
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORIES.filter((c) => c.id !== "all").slice(0, 9).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onTabChange("browse")}
              className="rounded-2xl flex flex-col items-center justify-center gap-1.5 py-4 transition-all active:scale-95"
              style={{
                backgroundColor: "#fdfaf5",
                border: "1.5px solid #ddd4c0",
              }}
              aria-label={`Browse ${cat.label} fabrics`}
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${cat.bgColor}18`, color: cat.bgColor }}
                aria-hidden="true"
              >
                {cat.icon}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: "#1a1040", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {isRTL ? cat.labelAr : cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Pi Pay Banner ───────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "#fdfaf5",
            border: "1.5px solid #ddd4c0",
          }}
        >
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-2"
            style={{
              color: "#9c8f7e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {isRTL ? "الوصول الكامل للسوق" : "Full Marketplace Access"}
          </p>
          <p
            className="text-sm font-medium mb-3 leading-snug"
            style={{
              color: "#1a1040",
              fontFamily: "var(--font-serif), 'Playfair Display', serif",
            }}
          >
            {isRTL
              ? "احصل على وصول مميز إلى Global Weavers — سوق الأقمشة العالمي."
              : "Unlock premium access to Global Weavers — the global fabric marketplace."}
          </p>
          <PiPayButton variant="banner" isRTL={isRTL} />
        </div>
      </div>

      {/* ── Featured Fabrics ────────────────────────────────────────── */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#c4622d" }} aria-hidden="true" />
            <h3
              className="text-base font-bold"
              style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
            >
              {isRTL ? "الأقمشة المميزة" : "Featured Fabrics"}
            </h3>
          </div>
          <button
            onClick={() => onTabChange("browse")}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "عرض الكل" : "See all"}
            <ArrowRight className="w-3 h-3" style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
          </button>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {featured.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} onBuy={onBuy} compact isRTL={isRTL} />
          ))}
        </div>
      </div>

      {/* ── Heritage Spotlight ──────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1040 0%, #2e1860 55%, #3d1840 100%)" }}
        >
          {/* Heritage stripe overlay */}
          <div
            className="absolute inset-0 pointer-events-none heritage-stripe opacity-60"
            aria-hidden="true"
          />
          <div className="relative">
            <span
              className="inline-block text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3"
              style={{
                backgroundColor: "rgba(196,98,45,0.28)",
                color: "#e07840",
                border: "1px solid rgba(196,98,45,0.4)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {isRTL ? "مجموعة ثقافية وفاخرة" : "Cultural & Luxury Collection"}
            </span>
            <h3
              className="text-xl font-bold mb-2 text-balance"
              style={{ color: "#f5f0e8", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
            >
              {isRTL ? "منسوجات تقليدية وفاخرة من 50+ دولة" : "Cultural & Luxury Textiles from 50+ Nations"}
            </h3>
            <p
              className="text-xs leading-relaxed mb-4 opacity-60"
              style={{ color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL
                ? "اكتشف أقمشة كنتي وباتيك وإيكات ودمشق وفيلفت إيطالي — حرف يدوية من 50+ حضارة."
                : "Kente, Batik, Ikat, Damask, Italian Velvet & more — hand-crafted from 50+ world cultures."}
            </p>
            <button
              onClick={() => onTabChange("browse")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{ backgroundColor: "#c4622d", color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL ? "استكشف التراث" : "Explore Heritage"}
              <ArrowRight className="w-3.5 h-3.5" style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── New Arrivals ─────────────────────────────────────────────── */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3
            className="text-base font-bold"
            style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
          >
            {isRTL ? "وصل حديثاً" : "New Arrivals"}
          </h3>
          <button
            onClick={() => onTabChange("browse")}
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "عرض الكل" : "See all"}
            <ArrowRight className="w-3 h-3" style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
          </button>
        </div>
        <div className="flex flex-col gap-0">
          {newArrivals.map((fabric, idx) => (
            <div
              key={fabric.id}
              className="flex items-center gap-3 px-4 py-3 transition-all active:bg-amber-50"
              style={{ borderTop: idx > 0 ? "1px solid #ede8de" : "none" }}
            >
              <img
                src={fabric.imageUrl}
                alt={fabric.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate mb-0.5"
                  style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                >
                  {fabric.name}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {fabric.originFlag} {fabric.origin} · {isRTL ? "حد أدنى" : "Min"} {fabric.minOrder}m
                </p>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span
                  className="text-base font-bold"
                  style={{ color: "#c4622d", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                >
                  π {fabric.pricePerMeter}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  /m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Sellers ─────────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" style={{ color: "#c4622d" }} aria-hidden="true" />
          <h3
            className="text-base font-bold"
            style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
          >
            {isRTL ? "أفضل البائعين" : "Top Sellers"}
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {SELLERS.slice(0, 3).map((seller) => (
            <SellerCard key={seller.id} seller={seller} isRTL={isRTL} />
          ))}
        </div>
      </div>

      {/* ── Trust badges ────────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #1a1040 0%, #2d1a60 100%)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 pi-glow"
            style={{ backgroundColor: "rgba(196,98,45,0.25)", border: "1.5px solid rgba(196,98,45,0.45)" }}
            aria-hidden="true"
          >
            <Globe className="w-6 h-6" style={{ color: "#c4622d" }} />
          </div>
          <div>
            <p
              className="text-sm font-bold mb-0.5"
              style={{ color: "#f5f0e8", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
            >
              {isRTL ? "ادفع بـ Pi Network" : "Pay with Pi Network"}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(245,240,232,0.55)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL
                ? "معاملات آمنة وسريعة على البلوكشين"
                : "Secure, fast blockchain transactions globally"}
            </p>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" style={{ color: "#4ade80" }} />
              <span className="text-[10px]" style={{ color: "rgba(245,240,232,0.5)", fontFamily: "var(--font-inter), sans-serif" }}>
                {isRTL ? "ضمان" : "Escrow"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" style={{ color: "#c9973a" }} />
              <span className="text-[10px]" style={{ color: "rgba(245,240,232,0.5)", fontFamily: "var(--font-inter), sans-serif" }}>
                {isRTL ? "شحن" : "Tracked"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Browse Tab ───────────────────────────────────────────────────────────────

function BrowseTab({
  isRTL,
  onBuy,
  initialDivision = "all",
}: {
  isRTL: boolean;
  onBuy: (f: Fabric) => void;
  initialDivision?: string;
}) {
  const [search,           setSearch]           = useState("");
  const [activeDivision,   setActiveDivision]   = useState<string>(initialDivision);
  const [activeCategory,   setActiveCategory]   = useState<string>("all");
  const [activeCountry,    setActiveCountry]    = useState("All Countries");
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [activeGrade,      setActiveGrade]      = useState<"all" | "A" | "B" | "C">("all");
  const [showFilters,      setShowFilters]      = useState(false);

  const filtered = useMemo(() => {
    return FABRICS.filter((f) => {
      if (activeDivision !== "all") {
        const div = f.division ?? "Clothing";
        if (div !== activeDivision) return false;
      }
      if (activeCategory !== "all" && f.type !== activeCategory) return false;
      if (activeCountry  !== "All Countries" && f.origin !== activeCountry) return false;
      if (activeGrade    !== "all" && f.grade !== activeGrade) return false;
      if (activePriceRange !== "all") {
        if (activePriceRange === "50+") {
          if (f.pricePerMeter < 50) return false;
        } else {
          const [min, max] = activePriceRange.split("-").map(Number);
          if (f.pricePerMeter < min || f.pricePerMeter > max) return false;
        }
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q) ||
          (f.subtype ?? "").toLowerCase().includes(q) ||
          (f.division ?? "").toLowerCase().includes(q) ||
          f.origin.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeDivision, activeCategory, activeCountry, activePriceRange, activeGrade, search]);

  const activeFilterCount = [
    activeDivision   !== "all",
    activeCategory   !== "all",
    activeCountry    !== "All Countries",
    activePriceRange !== "all",
    activeGrade      !== "all",
  ].filter(Boolean).length;

  const clearAll = useCallback(() => {
    setActiveDivision("all");
    setActiveCategory("all");
    setActiveCountry("All Countries");
    setActivePriceRange("all");
    setActiveGrade("all");
    setShowFilters(false);
  }, []);

  return (
    <div className="flex flex-col pb-6" dir={isRTL ? "rtl" : "ltr"}>

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl"
          style={{ backgroundColor: "#fdfaf5", border: "1.5px solid #ddd4c0" }}
          role="search"
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#9c8f7e" }} aria-hidden="true" />
          <input
            type="search"
            placeholder={isRTL ? "ابحث عن الأقمشة، البلد، النوع..." : "Search fabrics, origin, type..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#1a1040", fontFamily: "var(--font-inter), sans-serif" }}
            aria-label={isRTL ? "بحث" : "Search fabrics"}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label={isRTL ? "مسح البحث" : "Clear search"}>
              <X className="w-4 h-4" style={{ color: "#9c8f7e" }} />
            </button>
          )}
        </div>
      </div>

      {/* Division pills */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
        {DIVISIONS.map((div) => (
          <button
            key={div.id}
            onClick={() => setActiveDivision(div.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: activeDivision === div.id ? div.bgColor : "#ede8de",
              color:           activeDivision === div.id ? "#f5f0e8" : "#7a6e5e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            aria-pressed={activeDivision === div.id}
          >
            {isRTL ? div.labelAr : div.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: activeCategory === cat.id ? "#1a1040" : "#ede8de",
              color:           activeCategory === cat.id ? "#f5f0e8" : "#7a6e5e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            aria-pressed={activeCategory === cat.id}
          >
            {isRTL ? cat.labelAr : cat.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 flex-shrink-0"
          style={{
            backgroundColor: (showFilters || activeFilterCount > 0) ? "#1a1040" : "#ede8de",
            color:           (showFilters || activeFilterCount > 0) ? "#f5f0e8" : "#7a6e5e",
            border:          (showFilters || activeFilterCount > 0) ? "none" : "1.5px solid #ddd4c0",
            fontFamily: "var(--font-inter), sans-serif",
          }}
          aria-expanded={showFilters}
          aria-label={isRTL ? "فلترة" : "Open filters"}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          {isRTL ? "فلترة" : "Filters"}
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: "#c4622d", color: "#f5f0e8" }}
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {(["all", "A", "B", "C"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGrade(g)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: activeGrade === g ? "#c4622d" : "#ede8de",
              color:           activeGrade === g ? "#f5f0e8" : "#7a6e5e",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            aria-pressed={activeGrade === g}
          >
            {g === "all" ? (isRTL ? "كل الدرجات" : "All Grades") : `${isRTL ? "درجة" : "Grade"} ${g}`}
          </button>
        ))}
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div
          className="mx-4 mb-3 p-4 rounded-2xl flex flex-col gap-4 animate-fade-in"
          style={{ backgroundColor: "#fdfaf5", border: "1px solid #ddd4c0" }}
        >
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL ? "البلد" : "Country of Origin"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {COUNTRIES_FILTER.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: activeCountry === c ? "#1a1040" : "#ede8de",
                    color:           activeCountry === c ? "#f5f0e8" : "#7a6e5e",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  aria-pressed={activeCountry === c}
                >
                  {c === "All Countries" ? (isRTL ? "كل الدول" : c) : c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {isRTL ? "نطاق السعر" : "Price Range"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {PRICE_RANGES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePriceRange(p.id)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: activePriceRange === p.id ? "#c4622d" : "#ede8de",
                    color:           activePriceRange === p.id ? "#f5f0e8" : "#7a6e5e",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  aria-pressed={activePriceRange === p.id}
                >
                  {isRTL ? p.labelAr : p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearAll}
            className="self-start text-xs font-semibold"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "مسح جميع الفلاتر" : "Clear all filters"}
          </button>
        </div>
      )}

      {/* Results row */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <p
          className="text-xs"
          style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {filtered.length} {isRTL ? "نتيجة" : "results"}
        </p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" style={{ color: "#f59e0b" }} aria-hidden="true" />
          <span
            className="text-xs"
            style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "الأعلى تقييماً" : "Top rated"}
          </span>
          <ChevronDown className="w-3 h-3" style={{ color: "#9c8f7e" }} aria-hidden="true" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
          <Search className="w-10 h-10" style={{ color: "#9c8f7e" }} aria-hidden="true" />
          <p
            className="text-base font-semibold"
            style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
          >
            {isRTL ? "لم يتم العثور على أقمشة" : "No fabrics found"}
          </p>
          <p
            className="text-sm text-center"
            style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "جرب تعديل الفلاتر أو كلمة البحث" : "Try adjusting your filters or search term"}
          </p>
          <button
            onClick={clearAll}
            className="text-sm font-semibold mt-1"
            style={{ color: "#c4622d", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {isRTL ? "مسح الفلاتر" : "Clear filters"}
          </button>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3">
          {filtered.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} onBuy={onBuy} isRTL={isRTL} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab,        setActiveTab]        = useState<TabId>("home");
  const [isRTL,            setIsRTL]            = useState(false);
  const [orderCount,       setOrderCount]       = useState(0);
  const [buyModalFabric,   setBuyModalFabric]   = useState<Fabric | null>(null);
  const [buyQty,           setBuyQty]           = useState(1);
  const [buySuccess,       setBuySuccess]       = useState(false);
  const [pendingDivision,  setPendingDivision]  = useState<string>("all");

  const handleCategorySelect = useCallback((divisionOrMaterial: string) => {
    // Division IDs: Clothing, Curtain, Upholstery, Carpet
    // Material IDs: Silk, Cotton, Wool, Linen, Synthetic
    setPendingDivision(divisionOrMaterial);
    setActiveTab("browse");
  }, []);

  const handleBuy = useCallback((fabric: Fabric) => {
    setBuyModalFabric(fabric);
    setBuyQty(fabric.minOrder);
    setBuySuccess(false);
  }, []);

  const handleConfirmBuy = useCallback(() => {
    if (!buyModalFabric) return;
    const total = parseFloat((buyModalFabric.pricePerMeter * buyQty).toFixed(2));

    const onSuccess = () => {
      setBuySuccess(true);
      setOrderCount((c) => c + 1);
      setTimeout(() => {
        setBuyModalFabric(null);
        setBuySuccess(false);
        setActiveTab("orders");
      }, 2800);
    };

    if (typeof window !== "undefined" && typeof window.pay === "function") {
      window.pay({
        amount: total,
        memo: `Global Weavers: ${buyModalFabric.name} x${buyQty}m`,
        metadata: { fabricId: buyModalFabric.id, quantity: buyQty },
        onComplete: onSuccess,
        onError: () => setBuySuccess(false),
      });
    } else {
      // Preview fallback
      onSuccess();
    }
  }, [buyModalFabric, buyQty]);

  const minQty    = buyModalFabric?.minOrder ?? 1;
  const totalCost = buyModalFabric
    ? (buyModalFabric.pricePerMeter * buyQty).toFixed(2)
    : "0.00";

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        minHeight: "100dvh",
        backgroundColor: "#f5f0e8",
        maxWidth: 480,
        margin: "0 auto",
        overflow: "hidden",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header
        isRTL={isRTL}
        onToggleRTL={() => setIsRTL((v) => !v)}
        notifCount={orderCount > 0 ? orderCount : 2}
        onCategorySelect={handleCategorySelect}
      />

      <main
        className="flex-1"
        style={{
          paddingBottom: 76,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          minHeight: 0,
        }}
        aria-label={isRTL ? "المحتوى الرئيسي" : "Main content"}
      >
        {activeTab === "home"   && <HomeTab   isRTL={isRTL} onTabChange={setActiveTab} onBuy={handleBuy} />}
        {activeTab === "browse" && <BrowseTab isRTL={isRTL} onBuy={handleBuy} initialDivision={pendingDivision} />}
        {activeTab === "sell"   && <SellForm  isRTL={isRTL} />}
        {activeTab === "orders" && <Orders    isRTL={isRTL} />}
        {activeTab === "wallet" && <Wallet    isRTL={isRTL} />}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRTL={isRTL}
        orderBadge={orderCount}
      />

      {/* Language FAB */}
      <button
        onClick={() => setIsRTL((v) => !v)}
        className="fixed z-50 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-90"
        style={{
          bottom: 88,
          right:  isRTL ? "auto" : 16,
          left:   isRTL ? 16     : "auto",
          backgroundColor: "#fdfaf5",
          border: "1.5px solid #ddd4c0",
          color: "#1a1040",
          fontFamily: "var(--font-inter), sans-serif",
          boxShadow: "0 4px 16px rgba(26,16,64,0.14)",
        }}
        aria-label={isRTL ? "Switch to English" : "التبديل للعربية"}
      >
        {isRTL ? "EN" : "AR"}
      </button>

      {/* Buy Modal */}
      <Modal
        isOpen={!!buyModalFabric}
        onClose={() => { setBuyModalFabric(null); setBuySuccess(false); }}
        title={buySuccess ? undefined : (isRTL ? "تأكيد الشراء" : "Confirm Purchase")}
        isRTL={isRTL}
      >
        {buyModalFabric && (
          <div className="px-5 py-4" dir={isRTL ? "rtl" : "ltr"}>
            {buySuccess ? (
              /* Success screen */
              <div className="flex flex-col items-center py-10 gap-4 text-center animate-fade-in">
                <div
                  className="w-18 h-18 rounded-full flex items-center justify-center"
                  style={{
                    width: 72, height: 72,
                    backgroundColor: "rgba(21,128,61,0.1)",
                    border: "2px solid rgba(21,128,61,0.2)",
                  }}
                  aria-hidden="true"
                >
                  <CheckCircle2 className="w-9 h-9" style={{ color: "#15803d" }} />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                  >
                    {isRTL ? "تم الطلب بنجاح!" : "Order Placed!"}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {isRTL
                      ? `تمت معالجة دفعة π ${totalCost} بنجاح عبر Pi Network. سيتم إشعارك بتحديثات الشحن.`
                      : `π ${totalCost} payment processed via Pi Network. You'll be notified when shipped.`}
                  </p>
                </div>
                <button
                  onClick={() => { setBuyModalFabric(null); setBuySuccess(false); setActiveTab("orders"); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ backgroundColor: "#1a1040", color: "#f5f0e8", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {isRTL ? "عرض طلباتي" : "View My Orders"}
                </button>
              </div>
            ) : (
              <>
                {/* Fabric summary */}
                <div
                  className="flex gap-3 p-3 rounded-2xl mb-4"
                  style={{ backgroundColor: "#ede8de" }}
                >
                  <img
                    src={buyModalFabric.imageUrl}
                    alt={buyModalFabric.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-sm mb-1 line-clamp-2"
                      style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                    >
                      {buyModalFabric.name}
                    </h4>
                    <p
                      className="text-xs mb-1"
                      style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {buyModalFabric.originFlag} {buyModalFabric.origin} · Grade {buyModalFabric.grade}
                    </p>
                    <p
                      className="text-base font-bold"
                      style={{ color: "#c4622d", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                    >
                      π {buyModalFabric.pricePerMeter}/m
                    </p>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="mb-4">
                  <label
                    className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {isRTL ? `الكمية (الحد الأدنى ${minQty}م)` : `Quantity (min. ${minQty}m)`}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBuyQty((q) => Math.max(minQty, q - 1))}
                      disabled={buyQty <= minQty}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{
                        backgroundColor: buyQty <= minQty ? "#ede8de" : "#fdfaf5",
                        border: "1.5px solid #ddd4c0",
                      }}
                      aria-label={isRTL ? "تقليل الكمية" : "Decrease quantity"}
                    >
                      <Minus
                        className="w-4 h-4"
                        style={{ color: buyQty <= minQty ? "#c8bfb0" : "#1a1040" }}
                      />
                    </button>
                    <div className="flex-1 text-center">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#1a1040", fontFamily: "var(--font-serif), 'Playfair Display', serif" }}
                      >
                        {buyQty}
                      </span>
                      <span
                        className="text-sm ml-1"
                        style={{ color: "#9c8f7e", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {isRTL ? "م" : "m"}
                      </span>
                    </div>
                    <button
                      onClick={() => setBuyQty((q) => q + 1)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{ backgroundColor: "#1a1040" }}
                      aria-label={isRTL ? "زيادة الكمية" : "Increase quantity"}
                    >
                      <Plus className="w-4 h-4" style={{ color: "#f5f0e8" }} />
                    </button>
                  </div>
                </div>

                {/* Order summary */}
                <div
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{ border: "1px solid #ddd4c0" }}
                >
                  {[
                    {
                      label: isRTL ? `السعر (π ${buyModalFabric.pricePerMeter}/م × ${buyQty}م)` : `Price (π ${buyModalFabric.pricePerMeter}/m × ${buyQty}m)`,
                      value: `π ${totalCost}`,
                      highlight: false,
                    },
                    {
                      label: isRTL ? "رسوم المنصة" : "Platform fee",
                      value: "π 0.00",
                      highlight: false,
                    },
                    {
                      label: isRTL ? "الإجمالي" : "Total",
                      value: `π ${totalCost}`,
                      highlight: true,
                    },
                  ].map(({ label, value, highlight }, i, arr) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        borderBottom: i < arr.length - 1 ? "1px solid #ddd4c0" : "none",
                        backgroundColor: highlight ? "rgba(196,98,45,0.05)" : "#fdfaf5",
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{
                          color: highlight ? "#1a1040" : "#9c8f7e",
                          fontWeight: highlight ? 600 : 400,
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="font-bold"
                        style={{
                          color: highlight ? "#c4622d" : "#1a1040",
                          fontFamily: highlight ? "var(--font-serif), 'Playfair Display', serif" : "var(--font-inter), sans-serif",
                          fontSize: highlight ? "16px" : "14px",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pi escrow notice */}
                <div
                  className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: "rgba(21,128,61,0.08)", border: "1px solid rgba(21,128,61,0.15)" }}
                >
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#15803d" }} aria-hidden="true" />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#15803d", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {isRTL
                      ? "Pi محفوظ في الضمان — يُرسل للبائع فقط عند تأكيد التسليم"
                      : "Pi held in escrow — released to seller only upon delivery confirmation"}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleConfirmBuy}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    backgroundColor: "#c4622d",
                    color: "#f5f0e8",
                    fontFamily: "var(--font-inter), sans-serif",
                    boxShadow: "0 4px 18px rgba(196,98,45,0.42)",
                  }}
                >
                  <span className="text-base font-bold">π</span>
                  {isRTL ? `الدفع بـ Pi — π ${totalCost}` : `Pay with Pi — π ${totalCost}`}
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
