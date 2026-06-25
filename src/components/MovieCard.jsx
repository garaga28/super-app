import React, { useState } from 'react'
import './MovieCard.css'

const PLACEHOLDER = 'https://via.placeholder.com/200x300/111827/6366f1?text=No+Poster'

const MovieCard = ({ movie, onClick }) => {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="movie-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="movie-poster-wrap">
        <img
          className="movie-poster"
          src={imgErr || movie.Poster === 'N/A' ? PLACEHOLDER : movie.Poster}
          alt={movie.Title}
          onError={() => setImgErr(true)}
          loading="lazy"
        />
        <div className="movie-overlay">
          <span className="movie-view-btn">View Details</span>
        </div>
      </div>
      <div className="movie-info">
        <div className="movie-title">{movie.Title}</div>
        <div className="movie-year">{movie.Year}</div>
      </div>
    </div>
  )
}

export default MovieCard
