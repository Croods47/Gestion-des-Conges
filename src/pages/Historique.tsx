import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande, TypeConge } from '../stores/congesStore'
import { FiSearch, FiFilter, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Historique() {
  const { user } = useAuthStore()
  const { fetchDemandesEmploye, fetchToutesDemandes } = useCongesStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<StatutDemande | 'tous'>('tous')
  const [filterType, setFilterType] = useState<TypeConge | 'tous'>('tous')
  
  const isAdmin = user?.role === 'admin' || user?.role === 'manager'
  const demandes = isAdmin ? fetchToutesDemandes() : (user ? fetchDemandesEmploye(user.id) : [])
  
  // Filtrage des demandes
  const demandesFiltrees = demandes.filter(demande => {
    const matchSearch = searchTerm === '' || 
      demande.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.employePrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.motif.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatut = filterStatut === 'tous' || demande.statut === filterStatut
    const matchType = filterType === 'tous' || demande.type === filterType
    
    return matchSearch && matchStatut && matchType
  })
  
  const getStatutBadge = (statut: StatutDemande) => {
    switch (statut) {
      case 'approuvee':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Approuvée
          </span>
        )
      case 'refusee':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1 h-3 w-3" />
            Refusée
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1 h-3 w-3" />
            En attente
          </span>
        )
    }
  }
  
  const getTypeLabel = (type: TypeConge) => {
    const labels = {
      conges_payes: 'Congés payés',
      rtt: 'RTT',
      maladie: 'Congé maladie',
      maternite: 'Congé maternité',
      paternite: 'Congé paternité',
      formation: 'Formation'
    }
    return labels[type] || type
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Toutes les demandes' : 'Historique de mes demandes'}
        </h1>
        <p className="text-gray-600">
          {isAdmin 
            ? 'Consultez et gérez toutes les demandes de congés'
            : 'Consultez l\'historique de vos demandes de congés'
          }
        </p>
      </div>
      
      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={isAdmin ? "Rechercher par nom ou motif..." : "Rechercher par motif..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filtre par statut */}
          <div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as StatutDemande | 'tous')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="approuvee">Approuvées</option>
              <option value="refusee">Refusées</option>
            </select>
          </div>
          
          {/* Filtre par type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TypeConge | 'tous')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tous">Tous les types</option>
              <option value="conges_payes">Congés payés</option>
              <option value="rtt">RTT</option>
              <option value="maladie">Congé maladie</option>
              <option value="maternite">Congé maternité</option>
              <option value="paternite">Congé paternité</option>
              <option value="formation">Formation</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Liste des demandes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {demandesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatut !== 'tous' || filterType !== 'tous'
                ? 'Essayez de modifier vos filtres de recherche.'
                : 'Vous n\'avez pas encore fait de demande de congé.'
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {demandesFiltrees.map((demande) => (
              <li key={demande.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isAdmin && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {demande.employePrenom} {demande.employeNom}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            {getTypeLabel(demande.type)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      {getStatutBadge(demande.statut)}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 h-4 w-4" />
                        {format(new Date(demande.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(demande.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-4 w-4" />
                        Créée le {format(new Date(demande.dateCreation), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    
                    {demande.motif && (
                      <p className="mt-2 text-sm text-gray-600">
                        <strong>Motif :</strong> {demande.motif}
                      </p>
                    )}
                    
                    {demande.commentaireManager && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          <strong>Commentaire :</strong> {demande.commentaireManager}
                        </p>
                        {demande.approuvePar && demande.dateApprobation && (
                          <p className="text-xs text-gray-500 mt-1">
                            Par {demande.approuvePar} le {format(new Date(demande.dateApprobation), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Statistiques */}
      {demandesFiltrees.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {demandesFiltrees.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {demandesFiltrees.filter(d => d.statut === 'en_attente').length}
              </div>
              <div className="text-sm text-gray-500">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {demandesFiltrees.filter(d => d.statut === 'approuvee').length}
              </div>
              <div className="text-sm text-gray-500">Approuvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {demandesFiltrees.filter(d => d.statut === 'refusee').length}
              </div>
              <div className="text-sm text-gray-500">Refusées</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
