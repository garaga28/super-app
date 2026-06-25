import React, { useEffect } from 'react'
import './MovieModal.css'

const PLACEHOLDER = 'https://via.placeholder.com/300x450/111827/6366f1?text=No+Poster'

const StarRating = ({ rating }) => {
  const score = parseFloat(rating) || 0
  const stars = Math.round(score / 2)
  return (
    <div className="modal-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < stars ? 'star filled' : 'star'}>★</span>
      ))}
      <span className="modal-rating-num">{rating}/10</span>
    </div>
  )
}

const MovieModal = ({ movie, data, loading, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box movie-modal-box">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner" />
            <span>Loading movie details...</span>
          </div>
        ) : data ? (
          <div className="modal-content">
            {/* Left: Poster */}
            <div className="modal-poster-col">
              <img
                className="modal-poster"
                src={data.Poster && data.Poster !== 'N/A' ? data.Poster : PLACEHOLDER}
                alt={data.Title}
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
              {data.imdbRating && data.imdbRating !== 'N/A' && (
                <div className="modal-rating-box">
                  <span className="modal-rating-label">IMDb Rating</span>
                  <StarRating rating={data.imdbRating} />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="modal-info-col">
              <div className="modal-title">{data.Title}</div>

              <div className="modal-meta-chips">
                {data.Year && <span className="modal-chip">{data.Year}</span>}
                {data.Rated && data.Rated !== 'N/A' && <span className="modal-chip">{data.Rated}</span>}
                {data.Runtime && data.Runtime !== 'N/A' && <span className="modal-chip">{data.Runtime}</span>}
              </div>

              {data.Genre && data.Genre !== 'N/A' && (
                <div className="modal-field">
                  <span className="modal-field-label">Genre</span>
                  <div className="modal-genre-chips">
                    {data.Genre.split(',').map((g) => (
                      <span key={g} className="modal-genre-chip">{g.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.Plot && data.Plot !== 'N/A' && (
                <div className="modal-field">
                  <span className="modal-field-label">Plot</span>
                  <p className="modal-plot">{data.Plot}</p>
                </div>
              )}

              {data.Director && data.Director !== 'N/A' && (
                <div className="modal-field">
                  <span className="modal-field-label">Director</span>
                  <span className="modal-field-val">{data.Director}</span>
                </div>
              )}

              {data.Actors && data.Actors !== 'N/A' && (
                <div className="modal-field">
                  <span className="modal-field-label">Cast</span>
                  <span className="modal-field-val">{data.Actors}</span>
                </div>
              )}

              {data.Awards && data.Awards !== 'N/A' && (
                <div className="modal-awards">
                  🏆 {data.Awards}
                </div>
              )}

              <a
                href={`https://www.imdb.com/title/${movie.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary modal-imdb-btn"
              >
                View on IMDb →
              </a>
            </div>
          </div>
        ) : (
          <div className="modal-error">
            <p>Could not load movie details.</p>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieModal
