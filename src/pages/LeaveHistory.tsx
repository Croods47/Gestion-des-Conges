import { useState } from 'react'
import { useLeaveStore } from '../stores/leaveStore'
import { useAuthStore } from '../stores/authStore'
import { FiCalendar, FiClock, FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function LeaveHistory() {
  const { user } = useAuthStore()
  const { leaves } = useLeaveStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')

  // Filtrer les congés de l'utilisateur
  const userLeaves = leaves.filter(leave => leave.employeeId === user?.id)

  // Appliquer les filtres
  const filteredLeaves = userLeaves.filter(leave => {
    const matchesSearch = leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (leave.reason && leave.reason.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter
    const matchesType = typeFilter === 'all' || leave.type === typeFilter
    const matchesYear = yearFilter === 'all' || new Date(leave.startDate).getFullYear().toString() === yearFilter

    return matchesSearch && matchesStatus && matchesType && matchesYear
  })

  // Obtenir les années uniques
  const availableYears = [...new Set(userLeaves.map(leave => new Date(leave.startDate).getFullYear()))]
    .sort((a, b) => b - a)

  // Obtenir les types uniques
  const availableTypes = [...new Set(userLeaves.map(leave => leave.type))]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <FiX className="h-5 w-5 text-red-500" />
      default:
        return <FiClock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé'
      case 'rejected':
        return 'Refusé'
      default:
        return 'En attente'
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  // Statistiques
  const totalRequests = userLeaves.length
  const approvedRequests = userLeaves.filter(leave => leave.status === 'approved').length
  const pendingRequests = userLeaves.filter(leave => leave.status === 'pending').length
  const rejectedRequests = userLeaves.filter(leave => leave.status === 'rejected').length

  const totalDaysUsed = userLeaves
    .filter(leave => leave.status === 'approved')
    .reduce((sum, leave) => sum + leave.duration, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des congés</h1>
        <p className="mt-1 text-sm text-gray-600">
          Consultez toutes vos demandes de congés
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total demandes</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours pris</p>
              <p className="text-2xl font-bold text-gray-900">{totalDaysUsed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type, motif..."
              />
              <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tous les types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Année
            </label>
            <select
              id="year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Toutes les années</option>
              {availableYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des congés */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredLeaves.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredLeaves
              .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
              .map((leave) => (
                <li key={leave.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(leave.status)}
                          <h3 className="ml-2 text-lg font-medium text-gray-900">
                            {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                          </h3>
                        </div>
                        <span className={getStatusBadge(leave.status)}>
                          {getStatusText(leave.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">Période</p>
                          <p>
                            Du {format(new Date(leave.startDate), 'dd MMM yyyy', { locale: fr })} au {format(new Date(leave.endDate), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Durée</p>
                          <p>{leave.duration} jour{leave.duration > 1 ? 's' : ''}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Demandé le</p>
                          <p>
                            {format(new Date(leave.createdAt || leave.startDate), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      
                      {leave.reason && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">Motif :</p>
                          <p className="text-sm text-gray-900">{leave.reason}</p>
                        </div>
                      )}
                      
                      {leave.managerComment && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-600">Commentaire du manager :</p>
                          <p className="text-sm text-gray-900">{leave.managerComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || yearFilter !== 'all'
                ? 'Aucun résultat'
                : 'Aucune demande de congé'
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || yearFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vous n\'avez pas encore fait de demande de congé'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
