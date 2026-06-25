import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { searchMoviesByQuery, fetchMovieDetails } from '../services/apiServices'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'
import './Movies.css'

const MOVIE_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'demo'

// Genre → search keyword mapping
const GENRE_KEYWORDS = {
  Action: 'action hero',
  Comedy: 'comedy funny',
  Drama: 'drama emotional',
  Music: 'music concert',
  Sports: 'sports championship',
  Thriller: 'thriller suspense',
  Fantasy: 'fantasy magic',
  Romance: 'romance love'
}

// Demo movies per category
const DEMO_MOVIES = {
  Action: [
    { imdbID: 'tt0848228', Title: 'The Avengers', Year: '2012', Poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGM2NTFkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
    { imdbID: 'tt4154796', Title: 'Avengers: Endgame', Year: '2019', Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg' },
    { imdbID: 'tt0372784', Title: 'Batman Begins', Year: '2005', Poster: 'https://m.media-amazon.com/images/M/MV5BZmUwNGU2ZmItMmRiNC00MjhlLTg5YWUtODMyNzkxODYzMmZlXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg' },
  ],
  Comedy: [
    { imdbID: 'tt1517268', Title: 'Barbie', Year: '2023', Poster: 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg' },
    { imdbID: 'tt0120338', Title: 'Titanic', Year: '1997', Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NTY3MjU@._V1_SX300.jpg' },
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
    { imdbID: 'tt6710474', Title: 'Everything Everywhere All at Once', Year: '2022', Poster: 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLTkyNjYtYTU4Y2Y3NmQ5ZjFhXkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SX300.jpg' },
  ],
  Drama: [
    { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NiYyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg' },
    { imdbID: 'tt0108052', Title: "Schindler's List", Year: '1993', Poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTEyMDYtYjNhZS00NjA4LWI3MjMtZTg4YTVkYzZhZjU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg' },
    { imdbID: 'tt0137523', Title: 'Fight Club', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg' },
    { imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg' },
  ],
  Fantasy: [
    { imdbID: 'tt0120737', Title: 'The Lord of the Rings: The Fellowship of the Ring', Year: '2001', Poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg' },
    { imdbID: 'tt0167260', Title: 'The Lord of the Rings: The Return of the King', Year: '2003', Poster: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDJhZWMtOGQ4OC00ZTdkLTk4MmUtNjlkNmQ3YjI4Y2M4XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg' },
    { imdbID: 'tt0926084', Title: 'Harry Potter and the Deathly Hallows: Part 1', Year: '2010', Poster: 'https://m.media-amazon.com/images/M/MV5BMTQ2OTE1Mjk0N15BMl5BanBnXkFtZTcwODE3MDAwNA@@._V1_SX300.jpg' },
    { imdbID: 'tt0241527', Title: "Harry Potter and the Sorcerer's Stone", Year: '2001', Poster: 'https://m.media-amazon.com/images/M/MV5BNjQ3NWNlNmQtMTE5ZS00MDdmLTlkZjUtZTBlM2UxMGFiMTU3XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg' },
  ],
  Thriller: [
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg' },
    { imdbID: 'tt0167404', Title: 'The Sixth Sense', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BMWM4NTFhYjctNzUyNi00NGMwLTk3NTYtMDIyNTZmNzRlYzNiXkEyXkFqcGdeQXVyMTAwMzUyMzUy._V1_SX300.jpg' },
    { imdbID: 'tt0114369', Title: 'Se7en', Year: '1995', Poster: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMy00OTk4LTg3NWUtNjVhOTAzNTU5MDMzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg' },
    { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTUtZmQ4Zjg2ODhiNjI3XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg' },
  ],
  Romance: [
    { imdbID: 'tt0338013', Title: 'Eternal Sunshine of the Spotless Mind', Year: '2004', Poster: 'https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg' },
    { imdbID: 'tt0119698', Title: 'Princess Mononoke', Year: '1997', Poster: 'https://m.media-amazon.com/images/M/MV5BNGIzY2IzODQtNThmOC00ZjAxLWFkYzItNjZlY2E2MjYxNzFmXkEyXkFqcGdeQXVyODEzNjM5OTQ@._V1_SX300.jpg' },
    { imdbID: 'tt0109830', Title: 'Forrest Gump', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg' },
    { imdbID: 'tt0120586', Title: 'American History X', Year: '1998', Poster: 'https://m.media-amazon.com/images/M/MV5BZjY0NjEwMjItMWU3ZC00OGY1LThlMmItMmEwOTIwMDU5NmFiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
  ],
  Sports: [
    { imdbID: 'tt0093779', Title: 'The Princess Bride', Year: '1987', Poster: 'https://m.media-amazon.com/images/M/MV5BMGM4M2Q5N2MtNThkZS00NTc1LTk1NTItNWEyZjJjNDRmNDk5XkEyXkFqcGdeQXVyMjA0MDQ0Mzc@._V1_SX300.jpg' },
    { imdbID: 'tt0054215', Title: 'Psycho', Year: '1960', Poster: 'https://m.media-amazon.com/images/M/MV5BNTQwNDM1YzItNDAxZC00NWY2LTk0M2UtNDIwNWI5OGUyNWUxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg' },
    { imdbID: 'tt0405094', Title: 'The Lives of Others', Year: '2006', Poster: 'https://m.media-amazon.com/images/M/MV5BOWIxNjU2NTMtYzBiMi00MzQ2LTg3YjQtZGJmMDE2MjI2YmI0XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg' },
    { imdbID: 'tt0073486', Title: "One Flew Over the Cuckoo's Nest", Year: '1975', Poster: 'https://m.media-amazon.com/images/M/MV5BZjA0OWVhOTAtYWQxNi00YzNhLWI4ZjYtNjFjZTEyYjJlNDVlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg' },
  ],
  Music: [
    { imdbID: 'tt0367882', Title: 'Walk the Line', Year: '2005', Poster: 'https://m.media-amazon.com/images/M/MV5BMTk0ODk4MDkzMF5BMl5BanBnXkFtZTcwNjMxNTYzMw@@._V1_SX300.jpg' },
    { imdbID: 'tt4975722', Title: 'Moonlight', Year: '2016', Poster: 'https://m.media-amazon.com/images/M/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyODM2OTE@._V1_SX300.jpg' },
    { imdbID: 'tt6966692', Title: 'Green Book', Year: '2018', Poster: 'https://m.media-amazon.com/images/M/MV5BYzIzYmJlYTYtNGNiYy00N2EwLTk4ZjItMGYyZTJiOTVkM2RlXkEyXkFqcGdeQXVyODY1NDk1NjE@._V1_SX300.jpg' },
    { imdbID: 'tt3783958', Title: 'La La Land', Year: '2016', Poster: 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg' },
  ],
}

const Movies = () => {
  const categories = useStore((s) => s.categories)
  const user = useStore((s) => s.user)
  const navigate = useNavigate()

  const [moviesByGenre, setMoviesByGenre] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0] || '')

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      if (MOVIE_API_KEY === 'demo') {
        const result = {}
        categories.forEach((cat) => {
          result[cat] = DEMO_MOVIES[cat] || []
        })
        setMoviesByGenre(result)
      } else {
        const result = {}
        await Promise.all(
          categories.map(async (cat) => {
            try {
              const keyword = GENRE_KEYWORDS[cat] || cat
              const movies = await searchMoviesByQuery(keyword, MOVIE_API_KEY)
              result[cat] = movies
            } catch {
              result[cat] = []
            }
          })
        )
        setMoviesByGenre(result)
      }
      setLoading(false)
    }
    if (categories.length) loadMovies()
  }, [categories])

  const openModal = async (movie) => {
    setSelectedMovie(movie)
    setModalLoading(true)
    setModalData(null)
    try {
      if (MOVIE_API_KEY === 'demo') {
        setModalData({
          Title: movie.Title,
          Year: movie.Year,
          Rated: 'PG-13',
          Runtime: '148 min',
          Genre: activeCategory + ', Adventure',
          Director: 'Christopher Nolan',
          Actors: 'Various Actors',
          Plot: 'A compelling story that takes you on an epic journey through time, space, and human emotion. This critically acclaimed film showcases brilliant performances and stunning visuals.',
          imdbRating: '8.7',
          Poster: movie.Poster,
          Awards: 'Won 3 Academy Awards'
        })
      } else {
        const data = await fetchMovieDetails(movie.imdbID, MOVIE_API_KEY)
        setModalData(data)
      }
    } catch {
      setModalData(null)
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedMovie(null)
    setModalData(null)
  }

  return (
    <div className="movies-page gradient-bg">
      {/* Nav */}
      <header className="dash-nav">
        <div className="dash-nav-brand"><span>⚡</span><span>Super App</span></div>
        <nav className="dash-nav-links">
          <button className="dash-nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="dash-nav-btn active" onClick={() => navigate('/movies')}>🎬 Movies</button>
        </nav>
        <div className="dash-nav-user">
          <div className="dash-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <span>{user?.username}</span>
        </div>
      </header>

      <main className="movies-main">
        <div className="movies-header">
          <h1>Entertainment Discovery</h1>
          <p>Movies curated based on your selected interests</p>
        </div>

        {/* Category Tabs */}
        <div className="movies-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`movies-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {moviesByGenre[cat] && (
                <span className="movies-tab-count">{moviesByGenre[cat].length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="movies-loading">
            <div className="spinner" />
            <span>Loading movies...</span>
          </div>
        ) : (
          <div className="movies-section">
            <div className="movies-section-header">
              <h2>{activeCategory}</h2>
              <span className="movies-count">
                {moviesByGenre[activeCategory]?.length || 0} movies
              </span>
            </div>
            <div className="movies-grid">
              {(moviesByGenre[activeCategory] || []).map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} onClick={() => openModal(movie)} />
              ))}
            </div>
            {(!moviesByGenre[activeCategory] || moviesByGenre[activeCategory].length === 0) && (
              <div className="movies-empty">No movies found for {activeCategory}</div>
            )}
          </div>
        )}

        {MOVIE_API_KEY === 'demo' && (
          <div className="movies-demo-note">
            ℹ Demo mode — add VITE_OMDB_API_KEY in .env for live movie data
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          data={modalData}
          loading={modalLoading}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default Movies
