import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page non trouvée</h2>
          <p className="mt-2 text-lg text-gray-600">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
          <Link
            to="/"
            className="btn-primary justify-center"
          >
            <FiHome className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary justify-center"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
