import { DemandeConge } from '../stores/congesStore'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'

interface CongeCardProps {
  demande: DemandeConge
}

export default function CongeCard({ demande }: CongeCardProps) {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return 'bg-green-100 text-green-800'
      case 'refuse':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return 'Approuvée'
      case 'refuse':
        return 'Refusée'
      default:
        return 'En attente'
    }
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(demande.statut)}`}>
            {getStatusText(demande.statut)}
          </span>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600">{demande.motif}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="h-4 w-4 mr-1" />
            <span>{demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <FiUser className="h-4 w-4 mr-1" />
            <span>Créée le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</span>
          </div>
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
    </div>
  )
}
