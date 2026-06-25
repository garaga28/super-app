import React, { useState, useEffect, useRef } from 'react'
import './TimerWidget.css'

const pad = (n) => String(n).padStart(2, '0')

const TimerWidget = () => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  const totalSet = hours * 3600 + minutes * 60 + seconds

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setFinished(true)
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const handleStart = () => {
    if (remaining === null) {
      if (totalSet === 0) return
      setRemaining(totalSet)
    }
    setFinished(false)
    setRunning(true)
  }

  const handlePause = () => { setRunning(false) }

  const handleResume = () => { setFinished(false); setRunning(true) }

  const handleReset = () => {
    setRunning(false)
    setRemaining(null)
    setFinished(false)
    clearInterval(intervalRef.current)
  }

  const display = remaining !== null ? remaining : totalSet
  const h = Math.floor(display / 3600)
  const m = Math.floor((display % 3600) / 60)
  const s = display % 60

  const progress = remaining !== null && totalSet > 0
    ? ((totalSet - remaining) / totalSet) * 100
    : 0

  const isIdle = remaining === null
  const isPaused = !running && remaining !== null && !finished

  return (
    <div className={`widget timer-widget ${finished ? 'timer-finished' : ''}`}>
      <div className="widget-header">
        <span className="widget-title">⏱ Timer</span>
        {finished && <span className="timer-done-badge">⏰ Time's up!</span>}
      </div>
      <div className="widget-body timer-body">
        {/* Circular Progress */}
        <div className="timer-circle-wrap">
          <svg className="timer-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={finished ? 'var(--success)' : 'var(--accent)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="timer-display">
            <span className="timer-digits">{pad(h)}:{pad(m)}:{pad(s)}</span>
          </div>
        </div>

        {/* Set time inputs (only when idle) */}
        {isIdle && (
          <div className="timer-inputs">
            {[
              { label: 'HH', val: hours, set: setHours, max: 23 },
              { label: 'MM', val: minutes, set: setMinutes, max: 59 },
              { label: 'SS', val: seconds, set: setSeconds, max: 59 },
            ].map(({ label, val, set, max }) => (
              <div key={label} className="timer-input-group">
                <button className="timer-spin-btn" onClick={() => set((v) => Math.min(v + 1, max))}>▲</button>
                <span className="timer-input-val">{pad(val)}</span>
                <button className="timer-spin-btn" onClick={() => set((v) => Math.max(v - 1, 0))}>▼</button>
                <span className="timer-input-label">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preset buttons */}
        {isIdle && (
          <div className="timer-presets">
            {[[0,1,0,'1m'],[0,5,0,'5m'],[0,10,0,'10m'],[0,25,0,'25m'],[1,0,0,'1h']].map(([h,m,s,label]) => (
              <button key={label} className="timer-preset" onClick={() => { setHours(h); setMinutes(m); setSeconds(s) }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="timer-actions">
          {isIdle && (
            <button className="btn btn-primary" onClick={handleStart} disabled={totalSet === 0}>
              ▶ Start
            </button>
          )}
          {running && (
            <button className="btn btn-secondary" onClick={handlePause}>⏸ Pause</button>
          )}
          {isPaused && (
            <button className="btn btn-primary" onClick={handleResume}>▶ Resume</button>
          )}
          {finished && (
            <button className="btn btn-primary" onClick={handleReset}>🔄 Reset</button>
          )}
          {!isIdle && !finished && (
            <button className="btn btn-secondary" onClick={handleReset}>↺ Reset</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimerWidget
