import { DemandeConge, StatutDemande } from '../types'

interface CongeCardProps {
  demande: DemandeConge
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export default function CongeCard({ demande, onApprove, onReject, showActions = false }: CongeCardProps) {
  const getStatusColor = (status: StatutDemande) => {
    switch (status) {
      case 'approuve':
        return 'bg-green-100 text-green-800'
      case 'refuse':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: StatutDemande) => {
    switch (status) {
      case 'approuve':
        return 'Approuvé'
      case 'refuse':
        return 'Refusé'
      default:
        return 'En attente'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {demande.employePrenom} {demande.employeNom}
          </h3>
          <p className="text-sm text-gray-600">{demande.typeConge}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(demande.statut)}`}>
          {getStatusText(demande.statut)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Du:</span>
          <span className="text-sm font-medium">{demande.dateDebut}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Au:</span>
          <span className="text-sm font-medium">{demande.dateFin}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Durée:</span>
          <span className="text-sm font-medium">{demande.nbJours} jour(s)</span>
        </div>
      </div>

      {demande.motif && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Motif:</p>
          <p className="text-sm text-gray-900">{demande.motif}</p>
        </div>
      )}

      {demande.commentaire && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Commentaire:</p>
          <p className="text-sm text-gray-900">{demande.commentaire}</p>
        </div>
      )}

      {showActions && demande.statut === 'en_attente' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onApprove?.(demande.id)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Approuver
          </button>
          <button
            onClick={() => onReject?.(demande.id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Refuser
          </button>
        </div>
      )}
    </div>
  )
}
