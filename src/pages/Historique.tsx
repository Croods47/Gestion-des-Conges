import { useState, useMemo } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { FiSearch, FiCalendar } from 'react-icons/fi'

export default function Historique() {
  const { user } = useAuthStore()
  const { demandes } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const userDemandes = demandes.filter(d => d.utilisateurId === user?.id)

  const filteredDemandes = useMemo(() => {
    return userDemandes.filter(demande => {
      const matchesSearch = demande.motif.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [userDemandes, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des congés</h1>
        <p className="text-gray-600">Consultez toutes vos demandes de congés</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline h-4 w-4 mr-1" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par motif..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvées</option>
              <option value="refuse">Refusées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demandes */}
      <div className="space-y-4">
        {filteredDemandes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        ) : (
          filteredDemandes.map(demande => (
            <CongeCard key={demande.id} demande={demande} />
          ))
        )}
      </div>
    </div>
  )
}
