import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAuthStore } from './stores/authStore'
import Login from './pages/Login'
import Layout from './components/Layout'

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
    <Router>
      <Layout />
      <ToastContainer position="top-right" />
    </Router>
  )
}

export default App
