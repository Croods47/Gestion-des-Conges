import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { toast } from 'react-toastify'
import { FiUsers, FiClock, FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi'

const Administration = () => {
  const { user } = useAuthStore()
  const { demandes, isLoading, fetchToutesDemandes, changerStatutDemande } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatutDemande | 'all'>('all')
  
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchToutesDemandes()
    }
  }, [user, fetchToutesDemandes])
  
  const handleStatusChange = async (id: number, statut: StatutDemande, commentaire?: string) => {
    try {
      await changerStatutDemande(id, statut, commentaire)
      toast.success(`Demande ${statut === 'approuvée' ? 'approuvée' : 'refusée'}`)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }
  
  const filteredDemandes = demandes
    .filter(demande => {
      const matchesSearch = 
        demande.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.utilisateurPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.motif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.typeConge.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Priorité aux demandes en attente
      if (a.statut === 'en attente' && b.statut !== 'en attente') return -1
      if (b.statut === 'en attente' && a.statut !== 'en attente') return 1
      return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    })
  
  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'en attente').length,
    approuvees: demandes.filter(d => d.statut === 'approuvée').length,
    refusees: demandes.filter(d => d.statut === 'refusée').length
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="card text-center py-12">
        <FiX className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès refusé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    )
  }
  
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
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les demandes de congé de votre équipe
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total demandes
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.total}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  En attente
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.enAttente}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Approuvées
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.approuvees}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Refusées
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.refusees}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="Nom, prénom, motif..."
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
        </div>
      </div>
      
      {/* Demandes */}
      {filteredDemandes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDemandes.map((demande) => (
            <CongeCard
              key={demande.id}
              demande={demande}
              onStatusChange={handleStatusChange}
              isAdmin={true}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || statusFilter !== 'all' ? 'Aucun résultat' : 'Aucune demande'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucune demande de congé n\'a été soumise pour le moment.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Administration
