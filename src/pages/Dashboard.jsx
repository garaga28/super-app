import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import UserProfileWidget from '../components/UserProfileWidget'
import WeatherWidget from '../components/WeatherWidget'
import NewsWidget from '../components/NewsWidget'
import TimerWidget from '../components/TimerWidget'
import NotesWidget from '../components/NotesWidget'
import './Dashboard.css'

const Dashboard = () => {
  const user = useStore((s) => s.user)
  const navigate = useNavigate()

  return (
    <div className="dash-page gradient-bg">
      {/* Top Nav */}
      <header className="dash-nav">
        <div className="dash-nav-brand">
          <span>⚡</span>
          <span>Super App</span>
        </div>
        <nav className="dash-nav-links">
          <button className="dash-nav-btn active" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="dash-nav-btn" onClick={() => navigate('/movies')}>🎬 Movies</button>
        </nav>
        <div className="dash-nav-user">
          <div className="dash-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <span>{user?.username}</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dash-main">
        <div className="dash-grid">
          {/* Profile */}
          <div className="dash-cell dash-cell-profile">
            <UserProfileWidget />
          </div>
          {/* Weather */}
          <div className="dash-cell dash-cell-weather">
            <WeatherWidget />
          </div>
          {/* News */}
          <div className="dash-cell dash-cell-news">
            <NewsWidget />
          </div>
          {/* Timer */}
          <div className="dash-cell dash-cell-timer">
            <TimerWidget />
          </div>
          {/* Notes */}
          <div className="dash-cell dash-cell-notes">
            <NotesWidget />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
