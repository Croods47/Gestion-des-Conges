import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Calendar, 
  Clock, 
  Settings, 
  LogOut, 
  User,
  Home
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Gestion Congés
              </h1>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Tableau de bord
              </Link>
              
              <Link
                to="/demande"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Link>
              
              <Link
                to="/historique"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <Clock className="w-4 h-4 mr-2" />
                Historique
              </Link>
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Administration
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {user.prenom} {user.nom}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
