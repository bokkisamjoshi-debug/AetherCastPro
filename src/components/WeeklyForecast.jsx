import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { WeatherIcon, getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, rawTemp, formatDayName } from '../utils/formatters';

export default function WeeklyForecast({ weatherData, unit, glassCard, subText }) {
  const { daily } = weatherData;

  const weekDays = daily.time.map((date, i) => ({
    date,
    code: daily.weather_code[i],
    min: daily.temperature_2m_min[i],
    max: daily.temperature_2m_max[i],
    pop: daily.precipitation_probability_max?.[i] ?? 0,
  }));

  const weekMin = Math.min(...weekDays.map((d) => rawTemp(d.min, unit)));
  const weekMax = Math.max(...weekDays.map((d) => rawTemp(d.max, unit)));
  const weekSpan = Math.max(weekMax - weekMin, 1);

  return (
    <section className={`rounded-3xl p-5 sm:p-6 ${glassCard}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-sky-400" />
        7-Day Outlook
      </h2>

      <div className="divide-y divide-white/10">
        {weekDays.map((day, idx) => {
          const lowVal = rawTemp(day.min, unit);
          const highVal = rawTemp(day.max, unit);
          const leftPct = ((lowVal - weekMin) / weekSpan) * 100;
          const widthPct = Math.max(((highVal - lowVal) / weekSpan) * 100, 6);

          return (
            <div
              key={day.date}
              className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
            >
              <div className="w-24 shrink-0">
                <div className="text-sm font-semibold">{formatDayName(day.date, idx)}</div>
                <div className={`text-[11px] truncate ${subText}`}>
                  {getWeatherInfo(day.code).label}
                </div>
              </div>

              <div className="flex items-center gap-2 w-20 shrink-0 justify-center">
                <WeatherIcon code={day.code} isDay={1} className="w-5 h-5" />
                {day.pop > 15 && (
                  <span className="text-[11px] font-semibold text-sky-400 flex items-center">
                    <Droplets className="w-3 h-3" />
                    {day.pop}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-1 max-w-[220px]">
                <span className={`text-xs font-medium w-8 text-right ${subText}`}>
                  {formatTemp(day.min, unit)}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold w-8">
                  {formatTemp(day.max, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}