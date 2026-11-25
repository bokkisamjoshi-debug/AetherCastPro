import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { WeatherIcon } from '../utils/weatherCodes';
import { formatTemp, formatHourLabel } from '../utils/formatters';

export default function HourlyForecast({ weatherData, unit, glassCard, subText }) {
  const { current, hourly } = weatherData;
  const currentHourPrefix = current.time.slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));
  if (startIndex < 0) startIndex = 0;

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const i = startIndex + idx;
    return {
      time,
      temp: hourly.temperature_2m[i],
      code: hourly.weather_code[i],
      pop: hourly.precipitation_probability?.[i] ?? 0,
      isDay: hourly.is_day?.[i] ?? 1,
    };
  });

  return (
    <section className={`rounded-3xl p-5 sm:p-6 ${glassCard}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          24-Hour Trajectory
        </h2>
        <span className={`text-xs ${subText}`}>Local city time</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {next24Hours.map((slot, idx) => (
          <div
            key={slot.time}
            className={`min-w-[82px] rounded-2xl p-3 flex flex-col items-center justify-between gap-2.5 border transition-all ${
              idx === 0
                ? 'bg-sky-500/20 border-sky-400/50 shadow-lg shadow-sky-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-xs font-semibold">
              {idx === 0 ? 'Now' : formatHourLabel(slot.time)}
            </span>
            <WeatherIcon code={slot.code} isDay={slot.isDay} className="w-6 h-6" />
            <div className="h-4 flex items-center">
              {slot.pop > 10 ? (
                <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  {slot.pop}%
                </span>
              ) : (
                <span className="text-[11px] opacity-0">0%</span>
              )}
            </div>
            <span className="text-sm font-bold">{formatTemp(slot.temp, unit)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}