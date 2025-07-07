import { useState, useMemo } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { FiSearch, FiCalendar } from 'react-icons/fi'

export default function LeaveHistory() {
  const { user } = useAuthStore()
  const { demandes } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const userDemandes = demandes.filter(d => d.utilisateurId === user?.id)

  const filteredDemandes = useMemo(() => {
    return userDemandes.filter(demande => {
      const matchesSearch = demande.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           demande.typeConge.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
      const matchesType = typeFilter === 'all' || demande.typeConge === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
  }, [userDemandes, searchTerm, statusFilter, typeFilter])

  const pendingRequests = userDemandes.filter(d => d.statut === 'en_attente')
  const approvedRequests = userDemandes.filter(d => d.statut === 'approuve')

  const stats = [
    { label: 'Total des demandes', value: userDemandes.length, color: 'text-blue-600' },
    { label: 'En attente', value: pendingRequests.length, color: 'text-yellow-600' },
    { label: 'Approuvées', value: approvedRequests.length, color: 'text-green-600' },
  ]

  const typesConges = [...new Set(userDemandes.map(d => d.typeConge))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des congés</h1>
        <p className="text-gray-600">Consultez toutes vos demandes de congés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FiCalendar className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline h-4 w-4 mr-1" />
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par motif ou type..."
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de congé
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              {typesConges.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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
