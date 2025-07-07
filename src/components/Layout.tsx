import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  FiHome, 
  FiCalendar, 
  FiClock, 
  FiInfo, 
  FiSettings, 
  FiLogOut,
  FiCreditCard
} from 'react-icons/fi'
import Dashboard from '../pages/Dashboard'
import LeaveRequest from '../pages/LeaveRequest'
import LeaveHistory from '../pages/LeaveHistory'
import LaborLaw from '../pages/LaborLaw'
import AdminPanel from '../pages/AdminPanel'
import Payments from '../pages/Payments'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: FiHome },
    { name: 'Demande de congé', href: '/demande', icon: FiCalendar },
    { name: 'Historique', href: '/historique', icon: FiClock },
    { name: 'Informations', href: '/infos', icon: FiInfo },
    { name: 'Paiements', href: '/payments', icon: FiCreditCard },
  ]

  if (user?.role === 'admin' || user?.role === 'manager') {
    navigation.push({ name: 'Administration', href: '/admin', icon: FiSettings })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Gestion Congés</h1>
        </div>
        
        <div className="flex flex-col justify-between h-full pb-4">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="px-4">
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.prenom?.[0]}{user?.nom?.[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-2 flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/demande" element={<LeaveRequest />} />
              <Route path="/historique" element={<LeaveHistory />} />
              <Route path="/infos" element={<LaborLaw />} />
              <Route path="/payments" element={<Payments />} />
              {(user?.role === 'manager' || user?.role === 'admin') && (
                <Route path="/admin" element={<AdminPanel />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
