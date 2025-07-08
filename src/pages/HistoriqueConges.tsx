import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { CheckCircle, XCircle, AlertCircle, Plus, Calendar } from 'lucide-react'

export default function HistoriqueConges() {
  const { user } = useAuthStore()
  const { demandes, getDemandesParEmploye } = useCongesStore()

  if (!user) return null

  const mesDemandesTriees = getDemandesParEmploye(user.id)
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())

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

  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return 'bg-green-100 text-green-800'
      case 'refuse':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Historique de mes congés
            </h1>
            <p className="mt-2 text-gray-600">
              Consultez toutes vos demandes de congés passées et actuelles.
            </p>
          </div>
          <Link
            to="/demande"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Link>
        </div>

        {mesDemandesTriees.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore fait de demande de congé.
            </p>
            <div className="mt-6">
              <Link
                to="/demande"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Faire une demande
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mesDemandesTriees.map((demande) => (
                <li key={demande.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatutIcon(demande.statut)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getTypeCongeText(demande.typeConge)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadgeClass(demande.statut)}`}>
                            {getStatutText(demande.statut)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            Du {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} au{' '}
                            {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                            <span className="ml-2 text-gray-500">
                              ({demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''})
                            </span>
                          </p>
                          {demande.motif && (
                            <p className="text-sm text-gray-500 mt-1">
                              {demande.motif}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-xs text-gray-500">
                        Demandé le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                      </p>
                      {demande.approuvePar && demande.dateApprobation && (
                        <p className="text-xs text-gray-500">
                          {demande.statut === 'approuve' ? 'Approuvé' : 'Refusé'} par {demande.approuvePar}
                          <br />
                          le {new Date(demande.dateApprobation).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {demande.commentaire && (
                        <div className="max-w-xs">
                          <p className="text-xs text-gray-600 italic">
                            "{demande.commentaire}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
