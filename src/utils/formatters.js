export function formatTemp(celsius, unit) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return '--';
  const val = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(val)}°`;
}

export function rawTemp(celsius, unit) {
  if (celsius === null || celsius === undefined) return 0;
  return unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatSpeed(kmh, unit) {
  if (kmh === null || kmh === undefined) return '--';
  if (unit === 'F') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecip(mm, unit) {
  if (mm === null || mm === undefined) return '--';
  if (unit === 'F') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatVisibility(meters, unit) {
  if (meters === null || meters === undefined) return '--';
  if (unit === 'F') {
    return `${(meters / 1609.34).toFixed(1)} mi`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function getWindDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(((deg % 360) / 22.5)) % 16;
  return dirs[idx];
}

export function getAqiStatus(aqi) {
  if (aqi == null) return { label: 'Unavailable', color: 'text-slate-400', bg: 'bg-slate-500/20', advice: 'No air quality readings available.' };
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/20', advice: 'Air quality is clean and poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/20', advice: 'Acceptable air quality; sensitive groups should limit prolonged exertion.' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'text-orange-400', bg: 'bg-orange-500/20', advice: 'Sensitive individuals may experience respiratory discomfort.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-rose-400', bg: 'bg-rose-500/20', advice: 'Everyone may begin to experience adverse health effects outdoors.' };
  return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/20', advice: 'Health alert: avoid prolonged outdoor physical activity.' };
}

export function getUvStatus(uv) {
  if (uv == null) return { label: 'Low', color: 'text-emerald-400', advice: 'Minimal sun protection needed.' };
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400', advice: 'Safe to be outside without special protection.' };
  if (uv < 6) return { label: 'Moderate', color: 'text-amber-400', advice: 'Wear SPF 30+ sunscreen and sunglasses near midday.' };
  if (uv < 8) return { label: 'High', color: 'text-orange-400', advice: 'Seek shade between 10 AM and 4 PM; apply sunscreen.' };
  if (uv < 11) return { label: 'Very High', color: 'text-rose-400', advice: 'Extra protection essential; unprotected skin burns quickly.' };
  return { label: 'Extreme', color: 'text-purple-400', advice: 'Avoid direct sun exposure during peak afternoon hours.' };
}

export function formatHourLabel(isoString) {
  const timePart = isoString.split('T')[1];
  if (!timePart) return '';
  const hour = parseInt(timePart.split(':')[0], 10);
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
}

export function formatTimeFromIso(isoString) {
  const timePart = isoString?.split('T')[1];
  if (!timePart) return '--:--';
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}

export function formatDayName(dateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

export function getCityClock(timezone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}