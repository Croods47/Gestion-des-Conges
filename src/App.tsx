import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAuthStore } from './store/authStore'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import LeaveRequest from './components/LeaveRequest'
import LeaveHistory from './components/LeaveHistory'
import LaborLaw from './components/LaborLaw'
import AdminPanel from './components/AdminPanel'
import PaymentPage from './components/PaymentPage'
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Login />
        <ToastContainer position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/demande-conge" element={<LeaveRequest />} />
          <Route path="/historique" element={<LeaveHistory />} />
          <Route path="/droit-travail" element={<LaborLaw />} />
          <Route path="/paiement" element={<PaymentPage />} />
          {(user.role === 'manager' || user.role === 'admin') && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" />
    </div>
  )
}

export default App
