import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiSearch,
  FiFilter
} from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AdminPanel() {
  const { user } = useAuthStore()
  const { demandes, fetchToutesLesDemandes, modifierStatutDemande } = useCongesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  useEffect(() => {
    fetchToutesLesDemandes()
  }, [fetchToutesLesDemandes])

  const handleStatusChange = async (id: string, statut: 'approuve' | 'refuse', commentaire?: string) => {
    try {
      modifierStatutDemande(id, statut, commentaire, `${user?.prenom} ${user?.nom}`)
      toast.success(`Demande ${statut === 'approuve' ? 'approuvée' : 'refusée'} avec succès`)
    } catch (error) {
      toast.error('Erreur lors de la modification du statut')
    }
  }

  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = 
      demande.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.utilisateurPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.motif.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || demande.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      name: 'Total des demandes',
      value: demandes.length,
      icon: FiCalendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      name: 'En attente',
      value: demandes.filter(d => d.statut === 'en_attente').length,
      icon: FiClock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      name: 'Approuvées',
      value: demandes.filter(d => d.statut === 'approuve').length,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'Refusées',
      value: demandes.filter(d => d.statut === 'refuse').length,
      icon: FiXCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    }
  ]

  const chartData = [
    { name: 'En attente', value: demandes.filter(d => d.statut === 'en_attente').length },
    { name: 'Approuvées', value: demandes.filter(d => d.statut === 'approuve').length },
    { name: 'Refusées', value: demandes.filter(d => d.statut === 'refuse').length }
  ]

  const COLORS = ['#fbbf24', '#10b981', '#ef4444']

  const monthlyData = [
    { month: 'Jan', demandes: 12 },
    { month: 'Fév', demandes: 19 },
    { month: 'Mar', demandes: 15 },
    { month: 'Avr', demandes: 22 },
    { month: 'Mai', demandes: 18 },
    { month: 'Jun', demandes: 25 }
  ]

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <FiXCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Accès non autorisé</h2>
        <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiUsers className="h-6 w-6 mr-2" />
          Panneau d'administration
        </h1>
        <p className="text-gray-600">Gérez les demandes de congés de votre équipe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des demandes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution mensuelle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demandes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
              placeholder="Nom, prénom ou motif..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline h-4 w-4 mr-1" />
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
              Département
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les départements</option>
              <option value="dev">Développement</option>
              <option value="rh">Ressources Humaines</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demandes */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">
          Demandes de congés ({filteredDemandes.length})
        </h2>
        
        {filteredDemandes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDemandes.map(demande => (
              <div key={demande.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {demande.utilisateurPrenom} {demande.utilisateurNom}
                      </h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        demande.statut === 'approuve' ? 'bg-green-100 text-green-800' :
                        demande.statut === 'refuse' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {demande.statut === 'approuve' ? 'Approuvée' :
                         demande.statut === 'refuse' ? 'Refusée' : 'En attente'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type :</span> {demande.typeConge}
                      </div>
                      <div>
                        <span className="font-medium">Période :</span> {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-medium">Durée :</span> {demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="font-medium text-sm text-gray-600">Motif :</span>
                      <p className="text-sm text-gray-800 mt-1">{demande.motif}</p>
                    </div>
                    
                    {demande.commentaire && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">{demande.commentaire}</p>
                        {demande.approuvePar && (
                          <p className="text-xs text-gray-500 mt-1">Par {demande.approuvePar}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {demande.statut === 'en_attente' && (
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(demande.id, 'approuve', 'Demande approuvée par l\'administration')}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm"
                      >
                        <FiCheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleStatusChange(demande.id, 'refuse', 'Demande refusée par l\'administration')}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-sm"
                      >
                        <FiXCircle className="h-4 w-4 mr-1" />
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
