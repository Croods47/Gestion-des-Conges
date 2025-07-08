import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { 
    getDemandesParEmploye, 
    getToutesLesDemandes, 
    solde, 
    fetchSoldeConges 
  } = useCongesStore()

  useEffect(() => {
    if (user) {
      fetchSoldeConges(user.id)
    }
  }, [user, fetchSoldeConges])

  if (!user) return null

  const demandes = user.role === 'admin' 
    ? getToutesLesDemandes()
    : getDemandesParEmploye(user.id)

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'en_attente').length,
    approuvees: demandes.filter(d => d.statut === 'approuve').length,
    refusees: demandes.filter(d => d.statut === 'refuse').length
  }

  const recentDemandes = demandes
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5)

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'refuse':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatutBadge = (statut: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    switch (statut) {
      case 'approuve':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'refuse':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user.prenom} {user.nom}
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos congés et demandes
          </p>
        </div>

        {/* Solde de congés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Congés payés</p>
                <p className="text-2xl font-semibold text-gray-900">{solde.congesPayes} jours</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">RTT</p>
                <p className="text-2xl font-semibold text-gray-900">{solde.rtt} jours</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ancienneté</p>
                <p className="text-2xl font-semibold text-gray-900">{solde.anciennete} ans</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques des demandes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user.role === 'admin' ? 'Total demandes' : 'Mes demandes'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.enAttente}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approuvees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.refusees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link
                to="/demande"
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-700 font-medium">Nouvelle demande de congé</span>
              </Link>
              
              <Link
                to="/historique"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-700 font-medium">Consulter l'historique</span>
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                >
                  <Users className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">Administration</span>
                </Link>
              )}
            </div>
          </div>

          {/* Demandes récentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {user.role === 'admin' ? 'Demandes récentes' : 'Mes demandes récentes'}
            </h3>
            
            {recentDemandes.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune demande récente</p>
            ) : (
              <div className="space-y-3">
                {recentDemandes.map((demande) => (
                  <div key={demande.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      {user.role === 'admin' && (
                        <p className="text-sm font-medium text-gray-900">
                          {demande.employePrenom} {demande.employeNom}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {formatDate(demande.dateDebut)} - {formatDate(demande.dateFin)}
                      </p>
                      <p className="text-xs text-gray-500">{demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatutIcon(demande.statut)}
                      <span className={getStatutBadge(demande.statut)}>
                        {demande.statut === 'approuve' ? 'Approuvé' : 
                         demande.statut === 'refuse' ? 'Refusé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
