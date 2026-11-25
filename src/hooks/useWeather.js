import { useState, useEffect, useCallback } from 'react';

const DEFAULT_LOCATION = {
  id: '2643743',
  name: 'London',
  region: 'England',
  country: 'United Kingdom',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
};

const DEFAULT_FAVORITES = [
  DEFAULT_LOCATION,
  {
    id: '5128581',
    name: 'New York',
    region: 'New York',
    country: 'United States',
    latitude: 40.7143,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: '1850147',
    name: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: '1269843',
    name: 'Hyderabad',
    region: 'Telangana',
    country: 'India',
    latitude: 17.384,
    longitude: 78.4564,
    timezone: 'Asia/Kolkata',
  },
];

export function useWeather() {
  const [unit, setUnit] = useState(() => localStorage.getItem('aethercast_unit') || 'C');
  const [theme, setTheme] = useState(() => localStorage.getItem('aethercast_theme') || 'dark');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('aethercast_favorites'));
      return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  const [location, setLocation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('aethercast_last_location'));
      return saved && saved.latitude ? saved : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('aethercast_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('aethercast_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aethercast_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('aethercast_last_location', JSON.stringify(location));
  }, [location]);

  const fetchWeather = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code,precipitation_probability,is_day,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;

      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.latitude}&longitude=${loc.longitude}&current=us_aqi,pm10,pm2_5&timezone=auto`;

      const [forecastRes, aqiRes] = await Promise.all([fetch(forecastUrl), fetch(aqiUrl)]);

      if (!forecastRes.ok) {
        throw new Error('Unable to fetch meteorological data for this location.');
      }

      const forecastJson = await forecastRes.json();
      const aqiJson = aqiRes.ok ? await aqiRes.json() : null;

      setWeatherData(forecastJson);
      setAqiData(aqiJson);
    } catch (err) {
      setError(err.message || 'Network error while fetching weather.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(location);
  }, [location, fetchWeather]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const revData = revRes.ok ? await revRes.json() : {};
          setLocation({
            id: `${latitude.toFixed(3)}_${longitude.toFixed(3)}`,
            name: revData.city || revData.locality || 'My Location',
            region: revData.principalSubdivision || '',
            country: revData.countryName || '',
            latitude,
            longitude,
            timezone: 'auto',
          });
        } catch {
          setLocation({
            id: `${latitude.toFixed(3)}_${longitude.toFixed(3)}`,
            name: 'Current Location',
            region: '',
            country: '',
            latitude,
            longitude,
            timezone: 'auto',
          });
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
        setError('Location permission denied. Search for a city manually instead.');
      },
      { timeout: 10000 }
    );
  };

  const isFavorite = favorites.some(
    (fav) =>
      Math.abs(fav.latitude - location.latitude) < 0.05 &&
      Math.abs(fav.longitude - location.longitude) < 0.05
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (fav) =>
            !(
              Math.abs(fav.latitude - location.latitude) < 0.05 &&
              Math.abs(fav.longitude - location.longitude) < 0.05
            )
        )
      );
    } else {
      setFavorites((prev) => [location, ...prev.slice(0, 7)]);
    }
  };

  return {
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
  };
}