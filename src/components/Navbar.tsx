import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

type NavbarProps = {
  onMenuClick: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuthStore()
  
  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="ml-2 text-xl font-bold text-primary-700">MesConges</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <span className="hidden md:block mr-4 text-sm font-medium text-gray-700">
                  {user.prenom} {user.nom}
                </span>
                
                <div className="relative">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=0D8ABC&color=fff`}
                      alt={`${user.prenom} ${user.nom}`}
                    />
                    
                    <button
                      onClick={logout}
                      className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
