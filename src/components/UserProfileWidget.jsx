import React from 'react'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import './UserProfileWidget.css'

const GENRE_EMOJIS = {
  Action: '💥', Comedy: '😂', Drama: '🎭', Music: '🎵',
  Sports: '⚽', Thriller: '🔪', Fantasy: '🧙', Romance: '💕'
}

const UserProfileWidget = () => {
  const user = useStore((s) => s.user)
  const categories = useStore((s) => s.categories)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="widget profile-widget">
      <div className="widget-header">
        <span className="widget-title">👤 Profile</span>
        <button className="btn btn-secondary profile-edit-btn" onClick={() => navigate('/categories')}>
          Edit
        </button>
      </div>
      <div className="widget-body">
        <div className="profile-avatar-row">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-username">@{user.username}</div>
          </div>
        </div>

        <div className="profile-info-list">
          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{user.email}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Mobile</span>
            <span className="profile-info-value">{user.mobile}</span>
          </div>
        </div>

        <div className="profile-categories-section">
          <div className="profile-categories-label">Interests</div>
          <div className="profile-categories">
            {categories.map((cat) => (
              <span key={cat} className="profile-cat-chip">
                {GENRE_EMOJIS[cat]} {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileWidget
