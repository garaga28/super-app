import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import './NotesWidget.css'

const NotesWidget = () => {
  const { notes, setNotes } = useStore()
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setNotes(e.target.value)
    setSaved(false)
  }

  const handleSave = () => {
    setNotes(notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    if (window.confirm('Clear all notes?')) {
      setNotes('')
      setSaved(false)
    }
  }

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
  const charCount = notes.length

  return (
    <div className="widget notes-widget">
      <div className="widget-header">
        <span className="widget-title">📝 Notes</span>
        <div className="notes-header-actions">
          <span className="notes-stats">{wordCount}w · {charCount}c</span>
          {saved && <span className="notes-saved">✓ Saved</span>}
          <button className="btn btn-secondary notes-btn" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary notes-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
      <div className="widget-body notes-body">
        <textarea
          className="notes-textarea"
          placeholder="Jot down your thoughts, tasks, or ideas...

Notes are saved automatically to your browser."
          value={notes}
          onChange={handleChange}
          spellCheck
        />
        <div className="notes-footer">
          <span className="notes-persist-info">💾 Auto-saved to browser storage</span>
          <span className="notes-shortcut">Press Save or edit to update</span>
        </div>
      </div>
    </div>
  )
}

export default NotesWidget
