import React, { useState, useEffect, useRef } from 'react';
import {
  CloudSun,
  Search,
  X,
  LocateFixed,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';

export default function Navbar({
  onSelectLocation,
  onUseCurrentLocation,
  geoLoading,
  unit,
  onToggleUnit,
  theme,
  onToggleTheme,
  glassCard,
  subText,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            trimmed
          )}&count=6&language=en&format=json`
        );
        const data = await res.json();
        setResults(data.results || []);
        setDropdownOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query]);

  const handleChooseCity = (item) => {
    onSelectLocation({
      id: String(item.id),
      name: item.name,
      region: item.admin1 || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    });
    setQuery('');
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight">AetherCast</span>
            <span className="ml-1.5 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-400 font-semibold">
              Pro
            </span>
          </div>
        </div>

        {/* Autocomplete Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all ${
              theme === 'light'
                ? 'bg-white/85 border-slate-200 focus-within:border-sky-500'
                : 'bg-slate-900/65 border-white/15 focus-within:border-sky-400/70'
            }`}
          >
            <Search className={`w-4 h-4 shrink-0 ${subText}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setDropdownOpen(true)}
              placeholder="Search city, region, or country..."
              className="w-full bg-transparent text-sm outline-none placeholder:opacity-60"
            />
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
            ) : (
              query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setDropdownOpen(false);
                  }}
                  aria-label="Clear search"
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            )}
          </div>

          {dropdownOpen && (
            <div
              className={`absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden border shadow-2xl z-50 ${
                theme === 'light'
                  ? 'bg-white/95 border-slate-200 text-slate-900'
                  : 'bg-slate-900/95 border-white/15 text-slate-100 backdrop-blur-2xl'
              }`}
            >
              {results.length === 0 ? (
                <div className={`px-4 py-3 text-sm ${subText}`}>
                  No matching cities found.
                </div>
              ) : (
                <ul>
                  {results.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleChooseCity(item)}
                        className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-sky-500/15 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className={`text-xs ${subText}`}>
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono ${subText}`}>
                          {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onUseCurrentLocation}
            disabled={geoLoading}
            title="Use Current GPS Location"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${glassCard} hover:border-sky-400/50`}
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <LocateFixed className="w-4 h-4 text-sky-400" />
            )}
            <span className="hidden md:inline">Current Location</span>
          </button>

          <button
            onClick={onToggleUnit}
            title="Toggle °C / °F"
            className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${glassCard} hover:border-sky-400/50`}
          >
            °{unit}
          </button>

          <button
            onClick={onToggleTheme}
            title="Switch Surface Contrast"
            className={`p-2 rounded-xl transition-all cursor-pointer ${glassCard} hover:border-sky-400/50`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}