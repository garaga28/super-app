import React, { useState, useEffect, useCallback } from 'react'
import { fetchWeatherByCity, fetchWeatherByCoords } from '../services/apiServices'
import './WeatherWidget.css'

// Replace with your key or use env variable
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo'

const WEATHER_ICONS = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
  Haze: '🌫️', Smoke: '💨', default: '🌡️'
}

const DEFAULT_CITIES = ['Hyderabad', 'Mumbai', 'Bengaluru']

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('Hyderabad')
  const [inputVal, setInputVal] = useState('')

  const loadWeather = useCallback(async (cityName) => {
    if (!cityName) return
    setLoading(true)
    setError(null)
    try {
      if (API_KEY === 'demo') {
        // Mock data for demo mode
        setWeather({
          name: cityName,
          main: { temp: 32, feels_like: 36, humidity: 65, pressure: 1008 },
          wind: { speed: 4.2 },
          weather: [{ main: 'Clear', description: 'clear sky' }]
        })
      } else {
        const data = await fetchWeatherByCity(cityName, API_KEY)
        setWeather(data)
      }
    } catch {
      setError('Could not fetch weather. Check city name or API key.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadByLocation = useCallback(() => {
    if (!navigator.geolocation) { loadWeather(city); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          if (API_KEY === 'demo') {
            setWeather({
              name: 'Your Location',
              main: { temp: 30, feels_like: 33, humidity: 70, pressure: 1010 },
              wind: { speed: 3.5 },
              weather: [{ main: 'Clouds', description: 'partly cloudy' }]
            })
          } else {
            const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, API_KEY)
            setWeather(data)
            setCity(data.name)
          }
        } catch { setError('Location weather failed.') }
        finally { setLoading(false) }
      },
      () => loadWeather(city)
    )
  }, [city, loadWeather])

  useEffect(() => { loadWeather(city) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) { setCity(inputVal.trim()); loadWeather(inputVal.trim()); setInputVal('') }
  }

  const icon = weather ? (WEATHER_ICONS[weather.weather[0].main] || WEATHER_ICONS.default) : '🌡️'

  return (
    <div className="widget weather-widget">
      <div className="widget-header">
        <span className="widget-title">🌤 Weather</span>
        <button className="btn btn-secondary weather-loc-btn" onClick={loadByLocation} title="Use my location">
          📍
        </button>
      </div>
      <div className="widget-body">
        {/* City search */}
        <form className="weather-search" onSubmit={handleSearch}>
          <input
            className="input-field weather-input"
            placeholder="Search city..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn btn-primary weather-search-btn">Go</button>
        </form>

        {/* Quick cities */}
        <div className="weather-quick-cities">
          {DEFAULT_CITIES.map((c) => (
            <button
              key={c}
              className={`weather-city-chip ${city === c ? 'active' : ''}`}
              onClick={() => { setCity(c); loadWeather(c) }}
            >{c}</button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="weather-loading">
            <div className="spinner" />
            <span>Fetching weather...</span>
          </div>
        )}
        {error && <div className="weather-error">⚠ {error}</div>}
        {weather && !loading && (
          <div className="weather-data">
            <div className="weather-main-row">
              <span className="weather-icon">{icon}</span>
              <div>
                <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
                <div className="weather-city-name">{weather.name}</div>
                <div className="weather-desc">{weather.weather[0].description}</div>
              </div>
            </div>
            <div className="weather-stats">
              <div className="weather-stat">
                <span className="weather-stat-label">Feels like</span>
                <span className="weather-stat-val">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="weather-stat">
                <span className="weather-stat-label">Humidity</span>
                <span className="weather-stat-val">{weather.main.humidity}%</span>
              </div>
              <div className="weather-stat">
                <span className="weather-stat-label">Pressure</span>
                <span className="weather-stat-val">{weather.main.pressure} hPa</span>
              </div>
              <div className="weather-stat">
                <span className="weather-stat-label">Wind</span>
                <span className="weather-stat-val">{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
        {API_KEY === 'demo' && (
          <div className="weather-demo-note">
            ℹ Demo mode — add VITE_WEATHER_API_KEY in .env for live data
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherWidget
