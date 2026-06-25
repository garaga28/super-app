import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import './Register.css'

const FIELDS = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Sathibabu Garaga' },
  { key: 'username', label: 'Username', type: 'text', placeholder: 'e.g. sathibabu_g' },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
  { key: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '10-digit number' },
]

const validate = (data) => {
  const errors = {}
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const mobileRx = /^\d{10}$/
  const usernameRx = /^[a-zA-Z0-9_]+$/

  if (!data.name.trim()) errors.name = 'Name is required.'
  else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) errors.name = 'Name must contain only letters.'

  if (!data.username.trim()) errors.username = 'Username is required.'
  else if (!usernameRx.test(data.username)) errors.username = 'Only letters, numbers, underscores allowed.'

  if (!emailRx.test(data.email)) errors.email = 'Enter a valid email address.'

  if (!mobileRx.test(data.mobile)) errors.mobile = 'Enter exactly 10 digits.'

  return errors
}

const Register = () => {
  const setUser = useStore((s) => s.setUser)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', username: '', email: '', mobile: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (touched[key]) {
      const newErrors = validate({ ...formData, [key]: value })
      setErrors((prev) => ({ ...prev, [key]: newErrors[key] }))
    }
  }

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const newErrors = validate(formData)
    setErrors((prev) => ({ ...prev, [key]: newErrors[key] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true]))
    setTouched(allTouched)
    const newErrors = validate(formData)
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setUser(formData)
      navigate('/categories')
    }
  }

  return (
    <div className="reg-page gradient-bg">
      <div className="reg-container">
        {/* Left Art Panel */}
        <div className="reg-art">
          <div className="reg-art-inner">
            <div className="reg-art-logo">
              <span className="reg-art-icon">⚡</span>
              <span className="reg-art-name">Super App</span>
            </div>
            <h1 className="reg-art-headline">Everything you need,<br />in one place.</h1>
            <p className="reg-art-sub">
              Weather. News. Movies. Notes. Timer.<br />
              Your personal command center.
            </p>
            <div className="reg-art-features">
              {['🌤 Live Weather', '📰 Rolling News', '🎬 Movie Discovery', '📝 Persistent Notes', '⏱ Countdown Timer'].map((f) => (
                <div key={f} className="reg-art-feature">{f}</div>
              ))}
            </div>
          </div>
          <div className="reg-art-glow" />
        </div>

        {/* Right Form Panel */}
        <div className="reg-form-panel">
          <div className="reg-form-header">
            <span className="badge badge-accent">Step 1 of 3</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="reg-form">
            {FIELDS.map(({ key, label, type, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="label" htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type={type}
                  className={`input-field ${errors[key] ? 'error' : ''}`}
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  autoComplete={key === 'email' ? 'email' : 'off'}
                />
                {errors[key] && <span className="error-text">⚠ {errors[key]}</span>}
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-lg reg-submit-btn">
              Continue to Categories →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
