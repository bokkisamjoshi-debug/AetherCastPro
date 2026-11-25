import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getWeatherInfo } from './utils/weatherCodes';
import { useWeather } from './hooks/useWeather';
import WeatherCanvas from './components/WeatherCanvas';
import Navbar from './components/Navbar';
import FavoritesBar from './components/FavoritesBar';
import HeroCard from './components/HeroCard';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import TelemetryGrid from './components/TelemetryGrid';

export default function App() {
  const {
    unit,
    setUnit,
    theme,
    setTheme,
    favorites,
    location,
    setLocation,
    weatherData,
    aqiData,
    loading,
    geoLoading,
    error,
    fetchWeather,
    handleUseCurrentLocation,
    isFavorite,
    toggleFavorite,
  } = useWeather();

  const current = weatherData?.current;
  const currentInfo = current ? getWeatherInfo(current.weather_code) : { type: 'clear' };

  const getBackgroundGradient = () => {
    if (theme === 'light') {
      return 'from-sky-100 via-blue-50 to-indigo-100 text-slate-900';
    }
    if (!current || !current.is_day) {
      return 'from-slate-950 via-indigo-950 to-slate-900 text-slate-100';
    }
    switch (currentInfo.type) {
      case 'rain':
      case 'drizzle':
      case 'storm':
        return 'from-slate-900 via-slate-800 to-indigo-950 text-slate-100';
      case 'cloudy':
      case 'fog':
        return 'from-slate-800 via-slate-900 to-zinc-900 text-slate-100';
      case 'snow':
        return 'from-slate-800 via-sky-950 to-indigo-950 text-slate-100';
      default:
        return 'from-sky-950 via-blue-950 to-slate-950 text-slate-100';
    }
  };

  const glassCard =
    theme === 'light'
      ? 'bg-white/75 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-xl'
      : 'bg-white/[0.06] border border-white/[0.12] shadow-2xl shadow-black/25 backdrop-blur-xl';

  const subText = theme === 'light' ? 'text-slate-600' : 'text-slate-300/80';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-colors duration-700 relative overflow-x-hidden selection:bg-sky-500 selection:text-white`}
    >
      <WeatherCanvas
        weatherCode={current?.weather_code ?? 0}
        isDay={current?.is_day ?? 1}
        theme={theme}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onSelectLocation={setLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          geoLoading={geoLoading}
          unit={unit}
          onToggleUnit={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          glassCard={glassCard}
          subText={subText}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <FavoritesBar
            favorites={favorites}
            activeLocation={location}
            onSelect={setLocation}
            glassCard={glassCard}
            subText={subText}
          />

          {error && (
            <div className="rounded-2xl p-4 bg-rose-500/15 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => fetchWeather(location)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 text-xs font-semibold shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {loading && !weatherData ? (
            <div className="space-y-6 animate-pulse">
              <div className={`h-64 rounded-3xl ${glassCard}`} />
              <div className={`h-36 rounded-3xl ${glassCard}`} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`h-96 rounded-3xl ${glassCard}`} />
                <div className={`h-96 rounded-3xl lg:col-span-2 ${glassCard}`} />
              </div>
            </div>
          ) : (
            weatherData &&
            current && (
              <>
                <HeroCard
                  location={location}
                  weatherData={weatherData}
                  unit={unit}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onRefresh={() => fetchWeather(location)}
                  glassCard={glassCard}
                  subText={subText}
                />

                <HourlyForecast
                  weatherData={weatherData}
                  unit={unit}
                  glassCard={glassCard}
                  subText={subText}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5">
                    <WeeklyForecast
                      weatherData={weatherData}
                      unit={unit}
                      glassCard={glassCard}
                      subText={subText}
                    />
                  </div>

                  <div className="lg:col-span-7">
                    <TelemetryGrid
                      weatherData={weatherData}
                      aqiData={aqiData}
                      unit={unit}
                      glassCard={glassCard}
                      subText={subText}
                    />
                  </div>
                </div>
              </>
            )
          )}
        </main>

        <footer className={`py-6 text-center text-xs ${subText}`}>
          AetherCast Meteorological Telemetry • Powered by Open-Meteo Forecast &amp; Air Quality APIs
        </footer>
      </div>
    </div>
  );
}