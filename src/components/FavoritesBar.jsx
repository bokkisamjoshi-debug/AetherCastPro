import React from 'react';
import { Star, MapPin } from 'lucide-react';

export default function FavoritesBar({
  favorites,
  activeLocation,
  onSelect,
  glassCard,
  subText,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <span className={`text-xs font-medium flex items-center gap-1 shrink-0 mr-1 ${subText}`}>
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        Saved:
      </span>
      {favorites.map((fav) => {
        const active =
          Math.abs(fav.latitude - activeLocation.latitude) < 0.05 &&
          Math.abs(fav.longitude - activeLocation.longitude) < 0.05;
        return (
          <button
            key={fav.id}
            onClick={() => onSelect(fav)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              active
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : `${glassCard} hover:border-sky-400/40`
            }`}
          >
            <MapPin className="w-3 h-3 opacity-80" />
            {fav.name}
          </button>
        );
      })}
    </div>
  );
}