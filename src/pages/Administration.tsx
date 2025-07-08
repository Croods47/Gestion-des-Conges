import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { CheckCircle, XCircle, AlertCircle, MessageSquare, Users } from 'lucide-react'

export default function Administration() {
  const { user } = useAuthStore()
  const { demandes, modifierStatutDemande, getToutesLesDemandes } = useCongesStore()
  const [commentaires, setCommentaires] = useState<Record<string, string>>({})

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Accès non autorisé</h1>
            <p className="mt-2 text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const toutesLesDemandes = getToutesLesDemandes()
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())

  const demandesEnAttente = toutesLesDemandes.filter(d => d.statut === 'en_attente')
  const demandesTraitees = toutesLesDemandes.filter(d => d.statut !== 'en_attente')

  const handleApprouver = (demandeId: string) => {
    const commentaire = commentaires[demandeId] || ''
    modifierStatutDemande(demandeId, 'approuve', commentaire, `${user.prenom} ${user.nom}`)
    setCommentaires(prev => ({ ...prev, [demandeId]: '' }))
  }

  const handleRefuser = (demandeId: string) => {
    const commentaire = commentaires[demandeId] || ''
    modifierStatutDemande(demandeId, 'refuse', commentaire, `${user.prenom} ${user.nom}`)
    setCommentaires(prev => ({ ...prev, [demandeId]: '' }))
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
            Administration des congés
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les demandes de congés de votre équipe.
          </p>
        </div>

        {/* Statistiques */}
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
                      {demandesEnAttente.length}
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
                      {toutesLesDemandes.filter(d => d.statut === 'approuve').length}
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
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total demandes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {toutesLesDemandes.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demandes en attente */}
        {demandesEnAttente.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Demandes en attente de traitement
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {demandesEnAttente.map((demande) => (
                  <li key={demande.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getStatutIcon(demande.statut)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-gray-900">
                              {demande.employePrenom} {demande.employeNom}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getTypeCongeText(demande.typeConge)}
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
                                <strong>Motif :</strong> {demande.motif}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Demandé le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 text-gray-400 mt-1" />
                              <div className="flex-1">
                                <textarea
                                  placeholder="Commentaire (optionnel)..."
                                  value={commentaires[demande.id] || ''}
                                  onChange={(e) => setCommentaires(prev => ({ ...prev, [demande.id]: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApprouver(demande.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleRefuser(demande.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Refuser
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Demandes traitées */}
        {demandesTraitees.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Demandes traitées
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {demandesTraitees.map((demande) => (
                  <li key={demande.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatutIcon(demande.statut)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-gray-900">
                              {demande.employePrenom} {demande.employeNom}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getTypeCongeText(demande.typeConge)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              demande.statut === 'approuve' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
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
                                <strong>Motif :</strong> {demande.motif}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <p className="text-xs text-gray-500">
                          {demande.statut === 'approuve' ? 'Approuvé' : 'Refusé'} par {demande.approuvePar}
                        </p>
                        {demande.dateApprobation && (
                          <p className="text-xs text-gray-500">
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
          </div>
        )}

        {toutesLesDemandes.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
            <p className="mt-1 text-sm text-gray-500">
              Il n'y a actuellement aucune demande de congé à traiter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
