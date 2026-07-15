import React, { useEffect, useState } from 'react';
import { weatherAPI } from '../../api';
import { Thermometer, Droplets, Wind, Eye, Gauge, Navigation, Sun, Cloud, CloudRain, Zap, Sunrise, Sunset } from 'lucide-react';

const WEATHER_ICONS = {
  clear: '☀️', clouds: '☁️', rain: '🌧️', drizzle: '🌦️',
  thunderstorm: '⛈️', snow: '❄️', mist: '🌫️', fog: '🌫️',
  haze: '🌫️', smoke: '💨', dust: '🌪️', tornado: '🌪️',
};

const WIND_DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

function getWindDir(deg) {
  return WIND_DIRECTIONS[Math.round(deg / 22.5) % 16] || 'N';
}

function UVBar({ value, max = 11 }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = value <= 2 ? '#22C55E' : value <= 5 ? '#FBBF24' : value <= 7 ? '#F97316' : value <= 10 ? '#EF4444' : '#7C3AED';
  const label = value <= 2 ? 'Low' : value <= 5 ? 'Moderate' : value <= 7 ? 'High' : value <= 10 ? 'Very High' : 'Extreme';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>UV Index</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{value} — {label}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ background: `linear-gradient(90deg, #22C55E, #FBBF24, #EF4444, #7C3AED)`, width: `${pct}%`, height: '100%', borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

export default function WeatherWidget({ compact = false }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ lat, lng });
      try {
        const [wRes, fRes] = await Promise.all([
          weatherAPI.get(lat, lng),
          weatherAPI.getForecast(lat, lng).catch(() => ({ data: { forecast: [] } })),
        ]);
        setWeather(wRes.data.weather);
        setForecast(fRes.data.forecast?.slice(0, 5) || []);
      } catch (e) {
        setError('Weather unavailable');
      } finally { setLoading(false); }
    }, () => {
      // Fallback — Delhi
      const lat = 28.6139, lng = 77.2090;
      weatherAPI.get(lat, lng).then(r => setWeather(r.data.weather)).catch(() => setError('Location needed'));
      setLoading(false);
    });
  }, []);

  const icon = weather ? (WEATHER_ICONS[weather.main?.toLowerCase()] || '🌡️') : '🌍';
  const conditionColor = weather?.main?.toLowerCase() === 'clear' ? '#FBBF24' :
    weather?.main?.toLowerCase().includes('rain') ? '#60A5FA' :
    weather?.main?.toLowerCase().includes('thunder') ? '#A78BFA' : '#93C5FD';

  if (compact) {
    if (loading) return <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>⌛ Loading weather...</div>;
    if (error || !weather) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{icon} {weather.city} — {weather.temperature}°C, {weather.description}</span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}><Droplets size={12} style={{ display: 'inline' }} /> {weather.humidity}%</span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}><Wind size={12} style={{ display: 'inline' }} /> {weather.windSpeed} m/s</span>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,138,0.9))', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', color: 'white', fontFamily: 'Inter,sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ fontSize: '1.25rem' }}>🌦️</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'Outfit,sans-serif' }}>Live Weather</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Real-time conditions</div>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '0.3rem 0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'float 2s ease-in-out infinite' }}>🌍</div>
          <span>Detecting location...</span>
        </div>
      ) : error || !weather ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>⚠️ {error || 'Enable location for weather'}</div>
      ) : (
        <>
          {/* Main Weather */}
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: conditionColor }}>{weather.temperature}°C</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', textTransform: 'capitalize' }}>{weather.description}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.125rem' }}>
                  📍 {weather.city}
                  {weather.feelsLike && <span style={{ marginLeft: '0.5rem' }}>· Feels {weather.feelsLike}°C</span>}
                </div>
              </div>
              <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{icon}</div>
            </div>

            {/* Grid of metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              {[
                { icon: <Droplets size={14} />, label: 'Humidity', val: `${weather.humidity}%`, color: '#60A5FA' },
                { icon: <Wind size={14} />, label: 'Wind', val: `${weather.windSpeed} m/s ${weather.windDeg !== undefined ? getWindDir(weather.windDeg) : ''}`, color: '#34D399' },
                { icon: <Gauge size={14} />, label: 'Pressure', val: `${weather.pressure || '—'} hPa`, color: '#FBBF24' },
                { icon: <Eye size={14} />, label: 'Visibility', val: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : '—', color: '#A78BFA' },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{m.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* UV Index */}
            {weather.uvIndex !== undefined && (
              <div style={{ marginTop: '0.875rem' }}>
                <UVBar value={weather.uvIndex} />
              </div>
            )}

            {/* Disaster warning logic */}
            {(weather.windSpeed > 15 || weather.humidity > 90 || weather.description?.includes('thunder')) && (
              <div style={{ marginTop: '0.875rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.625rem 0.875rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#FCA5A5', fontWeight: 700 }}>⚠️ Adverse Conditions Detected</span>
                <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                  {weather.windSpeed > 15 && 'High wind speeds. '}
                  {weather.humidity > 90 && 'Extreme humidity. '}
                  {weather.description?.includes('thunder') && 'Thunderstorm risk. '}
                  Exercise caution.
                </div>
              </div>
            )}
          </div>

          {/* 5-Day Forecast */}
          {expanded && forecast.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5-Day Forecast</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {forecast.map((day, i) => (
                  <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.5rem 0.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{day.date ? new Date(day.date).toLocaleDateString('en', { weekday: 'short' }) : `Day ${i + 1}`}</div>
                    <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{WEATHER_ICONS[day.main?.toLowerCase()] || '🌡️'}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{day.maxTemp ?? day.temperature ?? '—'}°</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{day.minTemp ?? '—'}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
