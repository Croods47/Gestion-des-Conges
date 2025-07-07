import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiUser, 
  FiCalendar,
  FiMessageSquare,
  FiFilter
} from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Administration() {
  const { user } = useAuthStore()
  const { fetchToutesDemandes, changerStatutDemande } = useCongesStore()
  
  const [filterStatut, setFilterStatut] = useState<StatutDemande | 'tous'>('en_attente')
  const [commentaires, setCommentaires] = useState<{ [key: string]: string }>({})
  
  // Vérification des droits d'accès
  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <div className="text-center py-12">
        <FiXCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Accès non autorisé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
      </div>
    )
  }
  
  const toutesLesDemandes = fetchToutesDemandes()
  const demandesFiltrees = filterStatut === 'tous' 
    ? toutesLesDemandes 
    : toutesLesDemandes.filter(d => d.statut === filterStatut)
  
  const handleApprouver = (id: string) => {
    const commentaire = commentaires[id] || 'Demande approuvée'
    changerStatutDemande(id, 'approuvee', commentaire, `${user?.prenom} ${user?.nom}`)
    toast.success('Demande approuvée avec succès')
    setCommentaires({ ...commentaires, [id]: '' })
  }
  
  const handleRefuser = (id: string) => {
    const commentaire = commentaires[id] || 'Demande refusée'
    if (!commentaire.trim()) {
      toast.error('Veuillez ajouter un commentaire pour justifier le refus')
      return
    }
    changerStatutDemande(id, 'refusee', commentaire, `${user?.prenom} ${user?.nom}`)
    toast.success('Demande refusée')
    setCommentaires({ ...commentaires, [id]: '' })
  }
  
  const updateCommentaire = (id: string, value: string) => {
    setCommentaires({ ...commentaires, [id]: value })
  }
  
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
  
  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      conges_payes: 'Congés payés',
      rtt: 'RTT',
      maladie: 'Congé maladie',
      maternite: 'Congé maternité',
      paternite: 'Congé paternité',
      formation: 'Formation'
    }
    return labels[type] || type
  }
  
  const stats = {
    total: toutesLesDemandes.length,
    enAttente: toutesLesDemandes.filter(d => d.statut === 'en_attente').length,
    approuvees: toutesLesDemandes.filter(d => d.statut === 'approuvee').length,
    refusees: toutesLesDemandes.filter(d => d.statut === 'refusee').length
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration des congés</h1>
        <p className="text-gray-600">
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approuvees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiXCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.refusees}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtre */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <FiFilter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value as StatutDemande | 'tous')}
            className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="tous">Toutes les demandes</option>
            <option value="en_attente">En attente</option>
            <option value="approuvee">Approuvées</option>
            <option value="refusee">Refusées</option>
          </select>
        </div>
      </div>
      
      {/* Liste des demandes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {demandesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune demande ne correspond aux critères sélectionnés.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {demandesFiltrees.map((demande) => (
              <li key={demande.id} className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {demande.employePrenom} {demande.employeNom}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          {getTypeLabel(demande.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}
                        </span>
                      </div>
                      {getStatutBadge(demande.statut)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
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
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Motif :</strong> {demande.motif}
                      </p>
                    )}
                    
                    {demande.commentaireManager && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-md">
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
                    
                    {demande.statut === 'en_attente' && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiMessageSquare className="inline mr-1" />
                            Commentaire
                          </label>
                          <textarea
                            value={commentaires[demande.id] || ''}
                            onChange={(e) => updateCommentaire(demande.id, e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ajoutez un commentaire (obligatoire pour un refus)..."
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApprouver(demande.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FiCheckCircle className="mr-1 h-4 w-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleRefuser(demande.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiXCircle className="mr-1 h-4 w-4" />
                            Refuser
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
