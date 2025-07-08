import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { demandes, solde, fetchSoldeConges, getDemandesParEmploye, getToutesLesDemandes } = useCongesStore()

  useEffect(() => {
    if (user) {
      fetchSoldeConges(user.id)
    }
  }, [user, fetchSoldeConges])

  if (!user) return null

  const mesDemandesRecentes = user.role === 'admin' 
    ? getToutesLesDemandes().slice(0, 5)
    : getDemandesParEmploye(user.id).slice(0, 5)

  const stats = {
    enAttente: demandes.filter(d => d.statut === 'en_attente').length,
    approuvees: demandes.filter(d => d.statut === 'approuve').length,
    refusees: demandes.filter(d => d.statut === 'refuse').length
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'refuse':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatutText = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return 'Approuvé'
      case 'refuse':
        return 'Refusé'
      default:
        return 'En attente'
    }
  }

  const getTypeCongeText = (type: string) => {
    switch (type) {
      case 'conges_payes':
        return 'Congés payés'
      case 'rtt':
        return 'RTT'
      case 'maladie':
        return 'Maladie'
      case 'maternite':
        return 'Maternité'
      case 'paternite':
        return 'Paternité'
      case 'formation':
        return 'Formation'
      default:
        return 'Autre'
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {user.prenom} !
          </h1>
          <p className="mt-2 text-gray-600">
            Voici un aperçu de vos congés et demandes récentes.
          </p>
        </div>

        {/* Solde des congés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Congés payés restants
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {solde.congesPayes} jours
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      RTT restants
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {solde.rtt} jours
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ancienneté
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {solde.anciennete} {solde.anciennete > 1 ? 'ans' : 'an'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques des demandes (pour admin) */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Demandes en attente
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.enAttente}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Demandes approuvées
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.approuvees}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Demandes refusées
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.refusees}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demandes récentes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {user.role === 'admin' ? 'Demandes récentes (toutes)' : 'Mes demandes récentes'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Aperçu des dernières demandes de congés
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {mesDemandesRecentes.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                Aucune demande trouvée
              </li>
            ) : (
              mesDemandesRecentes.map((demande) => (
                <li key={demande.id} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatutIcon(demande.statut)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.role === 'admin' 
                            ? `${demande.employePrenom} ${demande.employeNom}`
                            : getTypeCongeText(demande.typeConge)
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          Du {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} au{' '}
                          {new Date(demande.dateFin).toLocaleDateString('fr-FR')} ({demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''})
                        </div>
                        {demande.motif && (
                          <div className="text-sm text-gray-400 mt-1">
                            {demande.motif}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        demande.statut === 'approuve' 
                          ? 'bg-green-100 text-green-800'
                          : demande.statut === 'refuse'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatutText(demande.statut)}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
