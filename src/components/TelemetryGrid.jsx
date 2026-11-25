import React from 'react';
import {
  Activity,
  Sun,
  Wind,
  Navigation,
  Sunrise,
  Sunset,
  Droplets,
  Eye,
  Gauge,
  Cloud,
} from 'lucide-react';
import {
  formatTemp,
  formatSpeed,
  formatPrecip,
  formatVisibility,
  getWindDirection,
  getAqiStatus,
  getUvStatus,
  formatTimeFromIso,
} from '../utils/formatters';

export default function TelemetryGrid({
  weatherData,
  aqiData,
  unit,
  glassCard,
  subText,
}) {
  const { current, hourly, daily } = weatherData;

  const currentHourPrefix = current.time.slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
  if (startIndex < 0) startIndex = 0;

  const currentVisibility = hourly.visibility?.[startIndex] ?? 10000;
  const currentDewPoint = hourly.dew_point_2m?.[startIndex];
  const todaySunrise = daily.sunrise?.[0];
  const todaySunset = daily.sunset?.[0];
  const todayUvMax = daily.uv_index_max?.[0] ?? 0;

  const usAqi = aqiData?.current?.us_aqi;
  const pm25 = aqiData?.current?.pm2_5;
  const pm10 = aqiData?.current?.pm10;
  const aqiMeta = getAqiStatus(usAqi);
  const uvMeta = getUvStatus(todayUvMax);

  // Solar arc progress calculation
  let sunProgress = 0.5;
  if (todaySunrise && todaySunset && current.time) {
    const parseMins = (iso) => {
      const [, t] = iso.split('T');
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const nowM = parseMins(current.time);
    const riseM = parseMins(todaySunrise);
    const setM = parseMins(todaySunset);
    if (setM > riseM) {
      sunProgress = Math.min(Math.max((nowM - riseM) / (setM - riseM), 0), 1);
    }
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 1. Air Quality Index */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
            <Activity className="w-4 h-4 text-emerald-400" />
            Air Quality (US AQI)
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${aqiMeta.bg} ${aqiMeta.color}`}>
            {aqiMeta.label}
          </span>
        </div>

        <div className="my-3 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold">{usAqi ?? '--'}</span>
          <div className={`text-xs space-x-2 ${subText}`}>
            <span>PM2.5: {pm25 != null ? `${pm25.toFixed(1)}` : '--'}</span>
            <span>•</span>
            <span>PM10: {pm10 != null ? `${pm10.toFixed(1)}` : '--'}</span>
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${subText}`}>{aqiMeta.advice}</p>
      </div>

      {/* 2. UV Index */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
            <Sun className="w-4 h-4 text-amber-400" />
            Peak UV Index
          </span>
          <span className={`text-xs font-bold ${uvMeta.color}`}>{uvMeta.label}</span>
        </div>

        <div className="my-3">
          <div className="text-3xl font-extrabold mb-2">{todayUvMax.toFixed(1)}</div>
          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-purple-500 relative">
            <div
              className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow absolute -top-[3px] -translate-x-1/2"
              style={{ left: `${Math.min((todayUvMax / 12) * 100, 100)}%` }}
            />
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${subText}`}>{uvMeta.advice}</p>
      </div>

      {/* 3. Wind & Compass */}
      <div className={`rounded-3xl p-5 flex items-center justify-between gap-4 ${glassCard}`}>
        <div className="space-y-1.5">
          <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
            <Wind className="w-4 h-4 text-sky-400" />
            Wind & Gusts
          </span>
          <div className="text-2xl font-extrabold">
            {formatSpeed(current.wind_speed_10m, unit)}
          </div>
          <div className={`text-xs ${subText}`}>
            Direction: <strong className="text-sky-400">{getWindDirection(current.wind_direction_10m)}</strong> ({current.wind_direction_10m}°)
          </div>
          <div className={`text-xs ${subText}`}>
            Gusts up to {formatSpeed(current.wind_gusts_10m, unit)}
          </div>
        </div>

        <div className="w-20 h-20 rounded-full border border-white/15 bg-white/5 relative flex items-center justify-center shrink-0">
          <span className="absolute top-1 text-[9px] font-bold opacity-60">N</span>
          <span className="absolute bottom-1 text-[9px] font-bold opacity-60">S</span>
          <span className="absolute left-1.5 text-[9px] font-bold opacity-60">W</span>
          <span className="absolute right-1.5 text-[9px] font-bold opacity-60">E</span>
          <div
            className="transition-transform duration-500"
            style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
          >
            <Navigation className="w-6 h-6 text-sky-400 fill-sky-400/30" />
          </div>
        </div>
      </div>

      {/* 4. Sunrise & Sunset Arc */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
          <Sunrise className="w-4 h-4 text-amber-400" />
          Solar Trajectory
        </span>

        <div className="my-2 flex flex-col items-center">
          <svg viewBox="0 0 200 75" className="w-full max-w-[210px] overflow-visible">
            <path
              d="M 15 65 A 85 85 0 0 1 185 65"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            {(() => {
              const angle = Math.PI * (1 - sunProgress);
              const cx = 100 + 85 * Math.cos(angle);
              const cy = 65 - 85 * Math.sin(angle);
              return (
                <g>
                  <circle cx={cx} cy={cy} r="9" fill="rgba(251,191,36,0.28)" />
                  <circle cx={cx} cy={cy} r="5" fill="#fbbf24" />
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span className={subText}>Rise:</span>
            <span className="font-bold">{formatTimeFromIso(todaySunrise)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span className={subText}>Set:</span>
            <span className="font-bold">{formatTimeFromIso(todaySunset)}</span>
          </div>
        </div>
      </div>

      {/* 5. Humidity & Dew Point */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
          <Droplets className="w-4 h-4 text-sky-400" />
          Humidity
        </span>
        <div className="text-3xl font-extrabold my-2">{current.relative_humidity_2m}%</div>
        <p className={`text-xs ${subText}`}>
          Dew point is {formatTemp(currentDewPoint, unit)} right now.
        </p>
      </div>

      {/* 6. Visibility */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
          <Eye className="w-4 h-4 text-indigo-400" />
          Visibility
        </span>
        <div className="text-3xl font-extrabold my-2">
          {formatVisibility(currentVisibility, unit)}
        </div>
        <p className={`text-xs ${subText}`}>
          {currentVisibility >= 10000
            ? 'Clear sightlines across the horizon.'
            : 'Reduced visibility due to atmospheric haze or moisture.'}
        </p>
      </div>

      {/* 7. Barometric Pressure */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
          <Gauge className="w-4 h-4 text-teal-400" />
          Pressure (MSL)
        </span>
        <div className="text-3xl font-extrabold my-2">
          {Math.round(current.pressure_msl)} <span className="text-sm font-semibold">hPa</span>
        </div>
        <p className={`text-xs ${subText}`}>
          {current.pressure_msl >= 1013
            ? 'High-pressure stability favoring settled weather.'
            : 'Low-pressure system encouraging cloud buildup.'}
        </p>
      </div>

      {/* 8. Cloud Cover & Precipitation */}
      <div className={`rounded-3xl p-5 flex flex-col justify-between ${glassCard}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${subText}`}>
          <Cloud className="w-4 h-4 text-slate-300" />
          Cloud & Precipitation
        </span>
        <div className="text-3xl font-extrabold my-2">{current.cloud_cover}%</div>
        <p className={`text-xs ${subText}`}>
          24h total precipitation: {formatPrecip(daily.precipitation_sum?.[0] ?? 0, unit)}
        </p>
      </div>
    </section>
  );
}