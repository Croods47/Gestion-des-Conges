import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { StatutDemande, TypeConge } from '../types'
import { 
  Calendar, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText
} from 'lucide-react'

export default function HistoriqueConges() {
  const { user } = useAuthStore()
  const { getDemandesParEmploye, getToutesLesDemandes } = useCongesStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatutDemande | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<TypeConge | 'all'>('all')

  if (!user) return null

  const demandes = user.role === 'admin' 
    ? getToutesLesDemandes()
    : getDemandesParEmploye(user.id)

  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = searchTerm === '' || 
      demande.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.employePrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.motif.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
    const matchesType = typeFilter === 'all' || demande.typeConge === typeFilter

    return matchesSearch && matchesStatus && matchesType
  }).sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())

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

  const getStatutText = (statut: StatutDemande) => {
    switch (statut) {
      case 'approuve':
        return 'Approuvé'
      case 'refuse':
        return 'Refusé'
      default:
        return 'En attente'
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

  const getTypeCongeLabel = (type: TypeConge) => {
    const labels: Record<TypeConge, string> = {
      'conges_payes': 'Congés payés',
      'rtt': 'RTT',
      'maladie': 'Maladie',
      'maternite': 'Maternité',
      'paternite': 'Paternité',
      'formation': 'Formation'
    }
    return labels[type]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.role === 'admin' ? 'Toutes les demandes' : 'Mes demandes de congé'}
              </h1>
              <p className="text-gray-600">
                {user.role === 'admin' 
                  ? 'Gérez toutes les demandes de congé de l\'équipe'
                  : 'Consultez l\'historique de vos demandes de congé'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtres :</span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={user.role === 'admin' ? "Rechercher par nom ou motif..." : "Rechercher par motif..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatutDemande | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="approuve">Approuvé</option>
                <option value="refuse">Refusé</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeConge | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="conges_payes">Congés payés</option>
                <option value="rtt">RTT</option>
                <option value="maladie">Maladie</option>
                <option value="maternite">Maternité</option>
                <option value="paternite">Paternité</option>
                <option value="formation">Formation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-lg shadow">
          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche.'
                  : 'Vous n\'avez pas encore fait de demande de congé.'
                }
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
                  <div key={demande.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {user.role === 'admin' && (
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {demande.employePrenom} {demande.employeNom}
                                </p>
                              </div>
                            )}
                            <span className="text-sm font-medium text-blue-600">
                              {getTypeCongeLabel(demande.typeConge)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {getStatutIcon(demande.statut)}
                            <span className={getStatutBadge(demande.statut)}>
                              {getStatutText(demande.statut)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
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

                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Motif :</span>
                          <p className="text-sm text-gray-600 mt-1">{demande.motif}</p>
                        </div>

                        {demande.commentaire && (
                          <div className="bg-gray-50 rounded-md p-3">
                            <span className="text-sm font-medium text-gray-700">Commentaire :</span>
                            <p className="text-sm text-gray-600 mt-1">{demande.commentaire}</p>
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
