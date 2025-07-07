import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { FiPlus, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi'

const Historique = () => {
  const { user } = useAuthStore()
  const { demandes, isLoading, fetchDemandesUtilisateur } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatutDemande | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date')
  
  useEffect(() => {
    if (user) {
      fetchDemandesUtilisateur(user.id)
    }
  }, [user, fetchDemandesUtilisateur])
  
  const filteredDemandes = demandes
    .filter(demande => {
      const matchesSearch = demande.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           demande.typeConge.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      } else {
        return a.statut.localeCompare(b.statut)
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des demandes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consultez toutes vos demandes de congé
          </p>
        </div>
        <Link to="/demande" className="btn-primary">
          <FiPlus className="mr-2 h-4 w-4" />
          Nouvelle demande
        </Link>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="label">
              Rechercher
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                className="input pl-10"
                placeholder="Motif, type de congé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="label">
              Statut
            </label>
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                id="status"
                className="input pl-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatutDemande | 'all')}
              >
                <option value="all">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="approuvée">Approuvée</option>
                <option value="refusée">Refusée</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="sort" className="label">
              Trier par
            </label>
            <select
              id="sort"
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
            >
              <option value="date">Date de création</option>
              <option value="status">Statut</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {filteredDemandes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDemandes.map((demande) => (
            <CongeCard key={demande.id} demande={demande} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || statusFilter !== 'all' ? 'Aucun résultat' : 'Aucune demande'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Vous n\'avez pas encore fait de demande de congé.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Link to="/demande" className="btn-primary">
                <FiPlus className="mr-2 h-4 w-4" />
                Créer une demande
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Historique
