import React, { useState } from 'react';
import { Store, ChefHat, Scissors, Sparkles, Palette, UtensilsCrossed, GraduationCap, BookOpen } from 'lucide-react';

const categoryFallbacks = {
  1: { icon: ChefHat, title: "Tiffin Services", gradient: "from-amber-800 to-orange-950", bg: "#7C2D12" },
  2: { icon: Scissors, title: "Tailoring & Boutique", gradient: "from-rose-900 to-pink-950", bg: "#881337" },
  3: { icon: Sparkles, title: "Beauty Services", gradient: "from-purple-900 to-indigo-950", bg: "#4C1D95" },
  4: { icon: Palette, title: "Handicrafts & Decor", gradient: "from-amber-900 to-stone-900", bg: "#78350F" },
  5: { icon: UtensilsCrossed, title: "Catering & Food", gradient: "from-emerald-900 to-teal-950", bg: "#064E3B" },
  6: { icon: GraduationCap, title: "Education & Tutoring", gradient: "from-blue-900 to-cyan-950", bg: "#1E3A8A" },
  7: { icon: Store, title: "Other Services", gradient: "from-stone-800 to-neutral-900", bg: "#262626" },
  learning: { icon: BookOpen, title: "Learning Guide", gradient: "from-amber-950 to-stone-900", bg: "#451A03" }
};

const defaultImageByCategoryId = {
  1: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  2: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
  3: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80",
  4: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
  5: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
  6: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  7: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
};

export const learningThumbnails = {
  1: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  2: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
  3: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
};

export const heroImages = {
  main: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
  tiffin: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80",
  boutique: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80",
  crafts: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80",
  beauty: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=500&q=80"
};

const MarketplaceImage = ({ 
  src, 
  alt, 
  categoryId, 
  className = "", 
  aspectRatio = "aspect-video",
  overlayText
}) => {
  const [hasError, setHasError] = useState(false);
  const effectiveSrc = src || defaultImageByCategoryId[categoryId];
  const config = categoryFallbacks[categoryId] || categoryFallbacks[7];
  const Icon = config.icon;

  if (hasError || !effectiveSrc) {
    return (
      <div 
        className={`relative ${aspectRatio} w-full overflow-hidden bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center p-6 text-white text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-2 border border-white/20 shadow-inner">
          <Icon className="w-6 h-6 text-amber-200" />
        </div>
        <span className="font-semibold text-xs tracking-wide text-amber-100">{overlayText || config.title}</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest mt-0.5">Aatmanirbhar Nari</span>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio} w-full overflow-hidden bg-neutral-100 ${className}`}>
      <img
        src={effectiveSrc}
        alt={alt || config.title}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

export default MarketplaceImage;
