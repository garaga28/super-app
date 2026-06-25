import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import './Categories.css'

const GENRES = [
  { id: 'Action',   emoji: '💥', desc: 'High-octane thrills' },
  { id: 'Comedy',   emoji: '😂', desc: 'Laugh out loud' },
  { id: 'Drama',    emoji: '🎭', desc: 'Emotional stories' },
  { id: 'Music',    emoji: '🎵', desc: 'Musical journeys' },
  { id: 'Sports',   emoji: '⚽', desc: 'Athletic triumphs' },
  { id: 'Thriller', emoji: '🔪', desc: 'Edge-of-seat tension' },
  { id: 'Fantasy',  emoji: '🧙', desc: 'Magical worlds' },
  { id: 'Romance',  emoji: '💕', desc: 'Love stories' },
]

const Categories = () => {
  const { categories, toggleCategory, user } = useStore()
  const navigate = useNavigate()
  const MIN = 3
  const canContinue = categories.length >= MIN

  return (
    <div className="cat-page gradient-bg">
      <div className="cat-container">
        <div className="cat-header">
          <span className="badge badge-accent">Step 2 of 3</span>
          <h1>Pick your interests</h1>
          <p>
            Select at least <strong>{MIN} categories</strong> you enjoy.
            We'll use these to personalise your dashboard.
          </p>
        </div>

        <div className="cat-counter-row">
          <span className="cat-counter">
            {categories.length} selected
            {categories.length < MIN && (
              <span className="cat-counter-hint"> — need {MIN - categories.length} more</span>
            )}
          </span>
          {canContinue && (
            <span className="cat-ready-badge">✓ Ready to continue</span>
          )}
        </div>

        <div className="cat-grid">
          {GENRES.map(({ id, emoji, desc }) => {
            const selected = categories.includes(id)
            return (
              <button
                key={id}
                className={`cat-card ${selected ? 'selected' : ''}`}
                onClick={() => toggleCategory(id)}
                type="button"
                aria-pressed={selected}
              >
                <div className="cat-card-check">{selected ? '✓' : ''}</div>
                <div className="cat-card-emoji">{emoji}</div>
                <div className="cat-card-label">{id}</div>
                <div className="cat-card-desc">{desc}</div>
              </button>
            )
          })}
        </div>

        <div className="cat-chips">
          {categories.map((c) => (
            <span key={c} className="badge badge-accent cat-chip">
              {GENRES.find((g) => g.id === c)?.emoji} {c}
              <button className="cat-chip-remove" onClick={() => toggleCategory(c)}>×</button>
            </span>
          ))}
        </div>

        <div className="cat-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back</button>
          <button
            className="btn btn-primary btn-lg"
            disabled={!canContinue}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Categories
