import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { FiSearch, FiFilter } from 'react-icons/fi'

const Historique = () => {
  const { user } = useAuthStore()
  const { demandes, isLoading, fetchDemandesUtilisateur } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatutDemande | 'tous'>('tous')
  
  useEffect(() => {
    if (user) {
      fetchDemandesUtilisateur(user.id)
    }
  }, [user, fetchDemandesUtilisateur])
  
  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = searchTerm === '' || 
      demande.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.typeConge.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'tous' || demande.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des congés</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez toutes vos demandes de congés passées et actuelles.
        </p>
      </div>
      
      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Rechercher
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher par motif ou type..."
              />
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Filtrer par statut
            </label>
            <div className="mt-1 relative">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatutDemande | 'tous')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="approuve">Approuvée</option>
                <option value="refuse">Refusée</option>
              </select>
              <FiFilter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des demandes */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {filteredDemandes.length} demande{filteredDemandes.length > 1 ? 's' : ''} trouvée{filteredDemandes.length > 1 ? 's' : ''}
          </p>
        </div>
        
        {filteredDemandes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDemandes.map((demande) => (
              <CongeCard key={demande.id} demande={demande} />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center py-8">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune demande ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Historique
