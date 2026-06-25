import React, { useState, useEffect, useRef } from 'react'
import { fetchTopHeadlines } from '../services/apiServices'
import './NewsWidget.css'

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo'

const DEMO_ARTICLES = [
  { title: 'India set to become world\'s 3rd largest economy by 2027', description: 'Goldman Sachs report projects India\'s GDP growth trajectory placing it among the top economies globally within the next few years.', source: { name: 'Economic Times' }, urlToImage: null, url: '#' },
  { title: 'ISRO successfully launches next-generation satellite', description: 'The Indian Space Research Organisation has completed another successful mission, expanding the country\'s space capabilities.', source: { name: 'NDTV' }, urlToImage: null, url: '#' },
  { title: 'Tech hiring sees revival in Hyderabad and Bengaluru', description: 'Major IT companies report increased fresher hiring across Tier-1 cities, with Java and cloud roles in high demand for 2025.', source: { name: 'Times of India' }, urlToImage: null, url: '#' },
  { title: 'React 19 stable release brings major performance upgrades', description: 'The latest stable version introduces concurrent features and improved hydration, making web apps significantly faster.', source: { name: 'Dev.to' }, urlToImage: null, url: '#' },
  { title: 'AI-powered tools transforming software development workflows', description: 'Enterprises across sectors are adopting AI coding assistants, reshaping how developers approach daily tasks.', source: { name: 'TechCrunch' }, urlToImage: null, url: '#' },
  { title: 'Java remains top enterprise language for 2025', description: 'Stack Overflow survey confirms Java holds strong in enterprise backend development, with Spring Boot leading frameworks.', source: { name: 'InfoQ' }, urlToImage: null, url: '#' },
]

const NewsWidget = () => {
  const [articles, setArticles] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        if (NEWS_API_KEY === 'demo') {
          setArticles(DEMO_ARTICLES)
        } else {
          const data = await fetchTopHeadlines(NEWS_API_KEY)
          setArticles(data.filter((a) => a.title && a.title !== '[Removed]'))
        }
      } catch {
        setArticles(DEMO_ARTICLES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (articles.length === 0 || paused) return
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length)
    }, 2000)
    return () => clearInterval(intervalRef.current)
  }, [articles, paused])

  const goTo = (idx) => { setCurrent(idx); }
  const prev = () => setCurrent((c) => (c - 1 + articles.length) % articles.length)
  const next = () => setCurrent((c) => (c + 1) % articles.length)

  const article = articles[current]

  return (
    <div className="widget news-widget">
      <div className="widget-header">
        <span className="widget-title">📰 News Feed</span>
        <div className="news-controls">
          <button
            className={`news-pause-btn ${paused ? 'paused' : ''}`}
            onClick={() => setPaused((p) => !p)}
            title={paused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
          >
            {paused ? '▶' : '⏸'}
          </button>
          {NEWS_API_KEY === 'demo' && <span className="news-demo-tag">Demo</span>}
        </div>
      </div>

      <div className="widget-body news-body">
        {loading ? (
          <div className="news-loading"><div className="spinner" /><span>Loading headlines...</span></div>
        ) : article ? (
          <>
            <div className="news-card">
              {article.urlToImage && (
                <img
                  className="news-image"
                  src={article.urlToImage}
                  alt=""
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div className="news-source">{article.source?.name}</div>
              <h3 className="news-title">{article.title}</h3>
              {article.description && (
                <p className="news-desc">{article.description}</p>
              )}
              {article.url && article.url !== '#' && (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-read-more">
                  Read more →
                </a>
              )}
            </div>

            {/* Controls */}
            <div className="news-nav">
              <button className="news-nav-btn" onClick={prev}>‹</button>
              <div className="news-dots">
                {articles.slice(0, Math.min(articles.length, 8)).map((_, i) => (
                  <button
                    key={i}
                    className={`news-dot ${i === current ? 'active' : ''}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
              <button className="news-nav-btn" onClick={next}>›</button>
            </div>

            <div className="news-counter">
              {current + 1} / {articles.length}
            </div>
          </>
        ) : (
          <div className="news-empty">No articles available.</div>
        )}
      </div>
    </div>
  )
}

export default NewsWidget
