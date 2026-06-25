import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Register from '../pages/Register'
import Categories from '../pages/Categories'
import Dashboard from '../pages/Dashboard'
import Movies from '../pages/Movies'

const ProtectedRoute = ({ children, requireUser, requireCategories }) => {
  const user = useStore((s) => s.user)
  const categories = useStore((s) => s.categories)

  if (requireUser && !user) return <Navigate to="/" replace />
  if (requireCategories && categories.length < 3) return <Navigate to="/categories" replace />

  return children
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Register />} />
    <Route
      path="/categories"
      element={
        <ProtectedRoute requireUser>
          <Categories />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute requireUser requireCategories>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/movies"
      element={
        <ProtectedRoute requireUser requireCategories>
          <Movies />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
