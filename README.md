# ⚡ Super App

A multi-feature React dashboard combining weather, news, movies, notes, and timers into one personalized experience.

## 🚀 Features

- **Registration** — Validated multi-field form (Name, Username, Email, Mobile)
- **Category Onboarding** — Pick ≥3 entertainment genres to personalize your experience
- **Dashboard** with 5 live widgets:
  - 👤 User Profile
  - 🌤 Weather (OpenWeatherMap, geolocation + city search)
  - 📰 News Feed (auto-rotates every 2 seconds)
  - ⏱ Countdown Timer (start / pause / resume / reset, presets)
  - 📝 Notes (localStorage-persisted)
- **Entertainment Discovery** — OMDB movies by genre with hover animations and detail modal
- **Protected Routes** — Users can't skip steps
- **Demo Mode** — All features work without API keys using mock data

## 🛠 Tech Stack

- React 18 + Vite
- React Router DOM v6
- Zustand (global state)
- Axios (HTTP)
- Pure CSS (no UI libraries)

## ⚙️ Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/super-app.git
cd super-app

# 2. Install dependencies
npm install

# 3. Configure API keys
cp .env.example .env
# Edit .env with your keys (app works in demo mode without them)

# 4. Run development server
npm run dev

# 5. Build for production
npm run build
```

## 🔑 API Keys

| Service | Provider | Get Key |
|---|---|---|
| Weather | OpenWeatherMap | https://openweathermap.org/api |
| News | NewsAPI | https://newsapi.org |
| Movies | OMDB | https://www.omdbapi.com/ |

All keys are optional — the app runs in **Demo Mode** with realistic mock data if keys are not provided.

## 📁 Project Structure

```
src/
├── components/
│   ├── UserProfileWidget.jsx
│   ├── WeatherWidget.jsx
│   ├── NewsWidget.jsx
│   ├── TimerWidget.jsx
│   ├── NotesWidget.jsx
│   ├── MovieCard.jsx
│   └── MovieModal.jsx
├── pages/
│   ├── Register.jsx
│   ├── Categories.jsx
│   ├── Dashboard.jsx
│   └── Movies.jsx
├── services/
│   └── apiServices.js
├── store/
│   └── useStore.js
└── routes/
    └── AppRoutes.jsx
```

## 🌐 Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard → Settings → Environment Variables.

## 📸 App Flow

```
/ (Register) → /categories (Pick ≥3 genres) → /dashboard (All widgets) → /movies (Entertainment)
```

Routes are protected — users are redirected if they skip steps.
