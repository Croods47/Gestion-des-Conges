import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { TypeConge } from '../types'

export default function LeaveRequest() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { ajouterDemande, solde } = useCongesStore()
  
  const [formData, setFormData] = useState({
    typeConge: 'conges_payes' as TypeConge,
    dateDebut: '',
    dateFin: '',
    motif: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateBusinessDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    let count = 0
    const current = new Date(start)
    
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    
    return count
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      const nbJours = calculateBusinessDays(formData.dateDebut, formData.dateFin)
      
      ajouterDemande({
        employeId: user.id,
        employeNom: user.nom,
        employePrenom: user.prenom,
        utilisateurNom: user.nom,
        utilisateurPrenom: user.prenom,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        nbJours,
        motif: formData.motif,
        typeConge: formData.typeConge
      })

      // Redirection vers l'historique
      navigate('/historique')
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nbJoursCalcules = formData.dateDebut && formData.dateFin 
    ? calculateBusinessDays(formData.dateDebut, formData.dateFin)
    : 0

  const typeCongeOptions = [
    { value: 'conges_payes', label: 'Congés payés', solde: solde.congesPayes },
    { value: 'rtt', label: 'RTT', solde: solde.rtt },
    { value: 'maladie', label: 'Congé maladie', solde: null },
    { value: 'maternite', label: 'Congé maternité', solde: null },
    { value: 'paternite', label: 'Congé paternité', solde: null },
    { value: 'formation', label: 'Formation', solde: null }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Leave Request</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de congé */}
            <div>
              <label htmlFor="typeConge" className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                id="typeConge"
                value={formData.typeConge}
                onChange={(e) => setFormData({ ...formData, typeConge: e.target.value as TypeConge })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {typeCongeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.solde !== null && `(${option.solde} days available)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="dateDebut"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="dateFin"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  min={formData.dateDebut}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Calcul automatique des jours */}
            {nbJoursCalcules > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Calculated Duration:</strong> {nbJoursCalcules} business day{nbJoursCalcules > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Motif */}
            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                id="motif"
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Briefly describe the reason for your request..."
              />
            </div>

            {/* Boutons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/historique')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.dateDebut || !formData.dateFin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
