import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
} from 'lucide-react';

export const WMO_CODES = {
  0: { label: 'Clear Sky', type: 'clear' },
  1: { label: 'Mainly Clear', type: 'clear' },
  2: { label: 'Partly Cloudy', type: 'partly-cloudy' },
  3: { label: 'Overcast', type: 'cloudy' },
  45: { label: 'Fog', type: 'fog' },
  48: { label: 'Depositing Rime Fog', type: 'fog' },
  51: { label: 'Light Drizzle', type: 'drizzle' },
  53: { label: 'Moderate Drizzle', type: 'drizzle' },
  55: { label: 'Dense Drizzle', type: 'drizzle' },
  56: { label: 'Light Freezing Drizzle', type: 'drizzle' },
  57: { label: 'Dense Freezing Drizzle', type: 'drizzle' },
  61: { label: 'Slight Rain', type: 'rain' },
  63: { label: 'Moderate Rain', type: 'rain' },
  65: { label: 'Heavy Rain', type: 'rain' },
  66: { label: 'Light Freezing Rain', type: 'rain' },
  67: { label: 'Heavy Freezing Rain', type: 'rain' },
  71: { label: 'Slight Snow Fall', type: 'snow' },
  73: { label: 'Moderate Snow Fall', type: 'snow' },
  75: { label: 'Heavy Snow Fall', type: 'snow' },
  77: { label: 'Snow Grains', type: 'snow' },
  80: { label: 'Slight Rain Showers', type: 'rain' },
  81: { label: 'Moderate Rain Showers', type: 'rain' },
  82: { label: 'Violent Rain Showers', type: 'rain' },
  85: { label: 'Slight Snow Showers', type: 'snow' },
  86: { label: 'Heavy Snow Showers', type: 'snow' },
  95: { label: 'Thunderstorm', type: 'storm' },
  96: { label: 'Thunderstorm & Slight Hail', type: 'storm' },
  99: { label: 'Thunderstorm & Heavy Hail', type: 'storm' },
};

export function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: 'Unknown', type: 'clear' };
}

export function WeatherIcon({ code, isDay = 1, className = 'w-6 h-6' }) {
  const { type } = getWeatherInfo(code);

  switch (type) {
    case 'clear':
      return isDay ? (
        <Sun className={`${className} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]`} />
      ) : (
        <Moon className={`${className} text-indigo-200 drop-shadow-[0_0_8px_rgba(199,210,254,0.5)]`} />
      );
    case 'partly-cloudy':
      return isDay ? (
        <CloudSun className={`${className} text-amber-300`} />
      ) : (
        <CloudMoon className={`${className} text-slate-300`} />
      );
    case 'cloudy':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-sky-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'snow':
      return <Snowflake className={`${className} text-cyan-200`} />;
    case 'storm':
      return <CloudLightning className={`${className} text-purple-400`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}