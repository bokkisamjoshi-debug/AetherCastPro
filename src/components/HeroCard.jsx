import React from 'react';
import {
  MapPin,
  Clock,
  Star,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Thermometer,
  Droplets,
} from 'lucide-react';
import { WeatherIcon, getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, getCityClock } from '../utils/formatters';

export default function HeroCard({
  location,
  weatherData,
  unit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  glassCard,
  subText,
}) {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const currentInfo = getWeatherInfo(current.weather_code);
  const todayHigh = daily.temperature_2m_max?.[0];
  const todayLow = daily.temperature_2m_min?.[0];
  const todayRainChance = daily.precipitation_probability_max?.[0];

  return (
    <section className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden ${glassCard}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Location & Primary Temp */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-sky-400 shrink-0" />
              {location.name}
            </h1>
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from Saved Cities' : 'Save City'}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'text-amber-400 fill-amber-400' : subText
                }`}
              />
            </button>
            <button
              onClick={onRefresh}
              title="Refresh Forecast"
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${subText}`} />
            </button>
          </div>

          <p className={`text-sm mt-1 ${subText}`}>
            {[location.region, location.country].filter(Boolean).join(', ')}
            <span className="mx-2 opacity-40">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {getCityClock(weatherData.timezone)}
            </span>
          </p>

          <div className="mt-6 flex items-center gap-5">
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter">
              {formatTemp(current.temperature_2m, unit)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <WeatherIcon
                  code={current.weather_code}
                  isDay={current.is_day}
                  className="w-6 h-6"
                />
                <span>{currentInfo.label}</span>
              </div>
              <div className={`flex items-center gap-3 text-sm ${subText}`}>
                <span className="inline-flex items-center gap-1 font-medium text-amber-400">
                  <ArrowUp className="w-3.5 h-3.5" />
                  H: {formatTemp(todayHigh, unit)}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-sky-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                  L: {formatTemp(todayLow, unit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Atmospheric Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[230px]">
          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1.5 ${subText}`}>
              <Thermometer className="w-4 h-4 text-rose-400" />
              Feels Like
            </span>
            <span className="text-sm font-bold">
              {formatTemp(current.apparent_temperature, unit)}
            </span>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1.5 ${subText}`}>
              <Droplets className="w-4 h-4 text-sky-400" />
              Rain Chance
            </span>
            <span className="text-sm font-bold">{todayRainChance ?? 0}%</span>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between col-span-2 sm:col-span-1">
            <span className={`text-xs ${subText}`}>Coordinates</span>
            <span className="text-xs font-mono font-semibold">
              {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}