import axios from 'axios'

// ─── CLIENTS ───────────────────────────────────────────────
const weatherClient = axios.create({ baseURL: 'https://api.openweathermap.org/data/2.5' })
const newsClient = axios.create({ baseURL: 'https://newsapi.org/v2' })
const movieClient = axios.create({ baseURL: 'https://www.omdbapi.com' })

// ─── WEATHER ───────────────────────────────────────────────
export const fetchWeatherByCity = async (city, apiKey) => {
  const res = await weatherClient.get(
    `/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
  )
  return res.data
}

export const fetchWeatherByCoords = async (lat, lon, apiKey) => {
  const res = await weatherClient.get(
    `/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
  return res.data
}

// ─── NEWS ──────────────────────────────────────────────────
export const fetchTopHeadlines = async (apiKey) => {
  const res = await newsClient.get(
    `/top-headlines?language=en&pageSize=15&apiKey=${apiKey}`
  )
  return res.data.articles || []
}

// ─── MOVIES ────────────────────────────────────────────────
export const searchMoviesByQuery = async (query, apiKey) => {
  const res = await movieClient.get(
    `/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`
  )
  return res.data.Search || []
}

export const fetchMovieDetails = async (imdbID, apiKey) => {
  const res = await movieClient.get(
    `/?i=${imdbID}&plot=full&apikey=${apiKey}`
  )
  return res.data
}
