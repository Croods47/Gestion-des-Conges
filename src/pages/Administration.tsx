import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { StatutDemande } from '../types'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Calendar,
  Filter
} from 'lucide-react'

export default function Administration() {
  const { user } = useAuthStore()
  const { getToutesLesDemandes, modifierStatutDemande } = useCongesStore()
  
  const [selectedDemande, setSelectedDemande] = useState<string | null>(null)
  const [commentaire, setCommentaire] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatutDemande | 'all'>('all')

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Accès refusé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    )
  }

  const demandes = getToutesLesDemandes()
  const filteredDemandes = demandes.filter(demande => 
    statusFilter === 'all' || demande.statut === statusFilter
  ).sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())

  const handleStatusChange = (demandeId: string, nouveauStatut: StatutDemande) => {
    modifierStatutDemande(
      demandeId, 
      nouveauStatut, 
      commentaire || undefined, 
      `${user.prenom} ${user.nom}`
    )
    setSelectedDemande(null)
    setCommentaire('')
  }

  const getStatutIcon = (statut: StatutDemande) => {
    switch (statut) {
      case 'approuve':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'refuse':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatutBadge = (statut: StatutDemande) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (statut) {
      case 'approuve':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'refuse':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  const getTypeCongeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'conges_payes': 'Congés payés',
      'rtt': 'RTT',
      'maladie': 'Maladie',
      'maternite': 'Maternité',
      'paternite': 'Paternité',
      'formation': 'Formation'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'en_attente').length,
    approuvees: demandes.filter(d => d.statut === 'approuve').length,
    refusees: demandes.filter(d => d.statut === 'refuse').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Gérez les demandes de congé de votre équipe</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total demandes</p>
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

        {/* Filtre */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtrer par statut :</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatutDemande | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="approuve">Approuvé</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-lg shadow">
          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune demande ne correspond aux critères sélectionnés.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredDemandes.length} demande{filteredDemandes.length > 1 ? 's' : ''}
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredDemandes.map((demande) => (
                  <div key={demande.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                {demande.employePrenom} {demande.employeNom}
                              </p>
                              <p className="text-sm text-blue-600">
                                {getTypeCongeLabel(demande.typeConge)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatutIcon(demande.statut)}
                            <span className={getStatutBadge(demande.statut)}>
                              {demande.statut === 'approuve' ? 'Approuvé' : 
                               demande.statut === 'refuse' ? 'Refusé' : 'En attente'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Période :</span>
                            <br />
                            {formatDate(demande.dateDebut)} → {formatDate(demande.dateFin)}
                          </div>
                          <div>
                            <span className="font-medium">Durée :</span>
                            <br />
                            {demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}
                          </div>
                          <div>
                            <span className="font-medium">Demandé le :</span>
                            <br />
                            {formatDate(demande.dateCreation)}
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700">Motif :</span>
                          <p className="text-sm text-gray-600 mt-1">{demande.motif}</p>
                        </div>

                        {demande.commentaire && (
                          <div className="bg-gray-50 rounded-md p-3 mb-4">
                            <span className="text-sm font-medium text-gray-700">Commentaire :</span>
                            <p className="text-sm text-gray-600 mt-1">{demande.commentaire}</p>
                          </div>
                        )}

                        {demande.statut === 'en_attente' && (
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => setSelectedDemande(selectedDemande === demande.id ? null : demande.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {selectedDemande === demande.id ? 'Annuler' : 'Traiter'}
                            </button>
                          </div>
                        )}

                        {selectedDemande === demande.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Commentaire (optionnel)
                              </label>
                              <textarea
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Ajoutez un commentaire..."
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleStatusChange(demande.id, 'approuve')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approuver
                              </button>
                              
                              <button
                                onClick={() => handleStatusChange(demande.id, 'refuse')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Refuser
                              </button>
                            </div>
                          </div>
                        )}

                        {demande.approuvePar && demande.dateApprobation && (
                          <div className="mt-3 text-xs text-gray-500">
                            {demande.statut === 'approuve' ? 'Approuvé' : 'Refusé'} par {demande.approuvePar} le {formatDate(demande.dateApprobation)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
