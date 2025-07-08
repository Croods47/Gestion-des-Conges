import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { toast } from 'react-toastify'
import { FiUsers, FiClock, FiCheck, FiX, FiFilter } from 'react-icons/fi'

const AdminPanel = () => {
  const { user } = useAuthStore()
  const { demandes, isLoading, fetchToutesDemandes, changerStatutDemande } = useCongesStore()
  const [filtreStatut, setFiltreStatut] = useState<StatutDemande | 'tous'>('en_attente')
  
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchToutesDemandes()
    }
  }, [user, fetchToutesDemandes])
  
  const handleStatusChange = async (id: string, statut: StatutDemande, commentaire?: string) => {
    try {
      await changerStatutDemande(id, statut, commentaire)
      toast.success(`Demande ${statut === 'approuve' ? 'approuvée' : 'refusée'} avec succès`)
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="card text-center py-8">
        <FiX className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès non autorisé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    )
  }
  
  const demandesFiltrees = demandes.filter(demande => 
    filtreStatut === 'tous' || demande.statut === filtreStatut
  )
  
  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'en_attente').length,
    approuvees: demandes.filter(d => d.statut === 'approuve').length,
    refusees: demandes.filter(d => d.statut === 'refuse').length
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
        <h1 className="text-2xl font-bold text-gray-900">Administration des congés</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les demandes de congés de tous les employés.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
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
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
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
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
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
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
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
      </div>
      
      {/* Filter */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="max-w-xs">
          <label htmlFor="statut-filter" className="block text-sm font-medium text-gray-700">
            Filtrer par statut
          </label>
          <div className="mt-1 relative">
            <select
              id="statut-filter"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value as StatutDemande | 'tous')}
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
      
      {/* Demandes */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} 
            {filtreStatut !== 'tous' && ` ${filtreStatut === 'en_attente' ? 'en attente' : filtreStatut === 'approuve' ? 'approuvées' : 'refusées'}`}
          </p>
        </div>
        
        {demandesFiltrees.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demandesFiltrees.map((demande) => (
              <CongeCard 
                key={demande.id} 
                demande={demande} 
                onStatusChange={handleStatusChange}
                isAdmin={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center py-8">
            <FiFilter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune demande ne correspond au filtre sélectionné.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
