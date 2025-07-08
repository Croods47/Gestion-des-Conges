import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DemandeConge from './pages/DemandeConge'
import HistoriqueConges from './pages/HistoriqueConges'
import Administration from './pages/Administration'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/demande" element={
            <ProtectedRoute>
              <DemandeConge />
            </ProtectedRoute>
          } />
          
          <Route path="/historique" element={
            <ProtectedRoute>
              <HistoriqueConges />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <Administration />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
