import { useState } from 'react'
import { useLeaveStore } from '../stores/leaveStore'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-toastify'
import { FiCheck, FiX, FiClock, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminPanel() {
  const { user } = useAuthStore()
  const { leaves, updateLeaveStatus } = useLeaveStore()
  const [selectedLeave, setSelectedLeave] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('pending')

  // Vérifier les permissions
  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <FiX className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès refusé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    )
  }

  // Filtrer les demandes selon le statut
  const filteredLeaves = leaves.filter(leave => {
    if (statusFilter === 'all') return true
    return leave.status === statusFilter
  })

  const handleStatusUpdate = async (leaveId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateLeaveStatus(leaveId, newStatus, comment)
      toast.success(`Demande ${newStatus === 'approved' ? 'approuvée' : 'refusée'} avec succès`)
      setSelectedLeave(null)
      setComment('')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
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

  // Statistiques
  const totalRequests = leaves.length
  const pendingRequests = leaves.filter(leave => leave.status === 'pending').length
  const approvedRequests = leaves.filter(leave => leave.status === 'approved').length
  const rejectedRequests = leaves.filter(leave => leave.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gérez les demandes de congés de votre équipe
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
            <div className="p-2 bg-red-100 rounded-lg">
              <FiX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Filtrer par statut :
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Refusées</option>
            <option value="all">Toutes</option>
          </select>
        </div>
      </div>

      {/* Liste des demandes */}
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
                          <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Employé ID: {leave.employeeId}
                          </h3>
                        </div>
                        <span className={getStatusBadge(leave.status)}>
                          {getStatusText(leave.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="capitalize">{leave.type}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Période</p>
                          <p>
                            Du {format(new Date(leave.startDate), 'dd MMM', { locale: fr })} au {format(new Date(leave.endDate), 'dd MMM yyyy', { locale: fr })}
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
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-600">Motif :</p>
                          <p className="text-sm text-gray-900">{leave.reason}</p>
                        </div>
                      )}
                      
                      {leave.managerComment && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-600">Commentaire :</p>
                          <p className="text-sm text-gray-900">{leave.managerComment}</p>
                        </div>
                      )}
                      
                      {/* Actions pour les demandes en attente */}
                      {leave.status === 'pending' && (
                        <div className="mt-4">
                          {selectedLeave === leave.id ? (
                            <div className="space-y-3">
                              <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                                  Commentaire (optionnel)
                                </label>
                                <textarea
                                  id="comment"
                                  rows={3}
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="Ajoutez un commentaire..."
                                />
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleStatusUpdate(leave.id, 'approved')}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <FiCheck className="mr-1 h-4 w-4" />
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FiX className="mr-1 h-4 w-4" />
                                  Refuser
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedLeave(null)
                                    setComment('')
                                  }}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedLeave(leave.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiMessageSquare className="mr-1 h-4 w-4" />
                              Traiter la demande
                            </button>
                          )}
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
              Aucune demande
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'pending' 
                ? 'Aucune demande en attente de traitement'
                : `Aucune demande avec le statut "${getStatusText(statusFilter)}"`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
