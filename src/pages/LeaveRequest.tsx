import { useState } from 'react'
import { useLeaveStore } from '../stores/leaveStore'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'react-toastify'
import { FiCalendar, FiClock, FiFileText } from 'react-icons/fi'
import { format, differenceInBusinessDays, addDays, isWeekend } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function LeaveRequest() {
  const { user } = useAuthStore()
  const { addLeave, leaves } = useLeaveStore()
  
  const [formData, setFormData] = useState({
    type: 'congés payés',
    startDate: '',
    endDate: '',
    reason: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculer les jours ouvrés entre deux dates
  const calculateBusinessDays = (start: string, end: string) => {
    if (!start || !end) return 0
    
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (startDate > endDate) return 0
    
    return differenceInBusinessDays(endDate, startDate) + 1
  }

  const duration = calculateBusinessDays(formData.startDate, formData.endDate)

  // Calculer les jours de congés déjà utilisés cette année
  const currentYear = new Date().getFullYear()
  const usedDays = leaves
    .filter(leave => 
      leave.employeeId === user?.id &&
      leave.status === 'approved' &&
      new Date(leave.startDate).getFullYear() === currentYear
    )
    .reduce((sum, leave) => sum + leave.duration, 0)

  const remainingDays = (user?.annualLeave || 25) - usedDays

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Utilisateur non connecté')
      return
    }

    // Validations
    if (duration <= 0) {
      toast.error('La date de fin doit être postérieure à la date de début')
      return
    }

    if (duration > remainingDays) {
      toast.error(`Vous ne pouvez pas demander plus de ${remainingDays} jours de congés`)
      return
    }

    const startDate = new Date(formData.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      toast.error('La date de début ne peut pas être dans le passé')
      return
    }

    // Vérifier les chevauchements avec d'autres demandes approuvées
    const hasOverlap = leaves.some(leave => {
      if (leave.employeeId !== user.id || leave.status !== 'approved') return false
      
      const existingStart = new Date(leave.startDate)
      const existingEnd = new Date(leave.endDate)
      const newStart = new Date(formData.startDate)
      const newEnd = new Date(formData.endDate)
      
      return (newStart <= existingEnd && newEnd >= existingStart)
    })

    if (hasOverlap) {
      toast.error('Ces dates chevauchent avec une demande déjà approuvée')
      return
    }

    setIsSubmitting(true)

    try {
      await addLeave({
        employeeId: user.id,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration,
        reason: formData.reason,
        status: 'pending'
      })

      toast.success('Demande de congé soumise avec succès')
      
      // Réinitialiser le formulaire
      setFormData({
        type: 'congés payés',
        startDate: '',
        endDate: '',
        reason: ''
      })
    } catch (error) {
      toast.error('Erreur lors de la soumission de la demande')
    } finally {
      setIsSubmitting(false)
    }
  }

  const leaveTypes = [
    'congés payés',
    'congé maladie',
    'congé maternité',
    'congé paternité',
    'congé sans solde',
    'RTT',
    'congé formation',
    'congé exceptionnel'
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle demande de congé</h1>
            <p className="mt-1 text-sm text-gray-600">
              Remplissez le formulaire ci-dessous pour soumettre votre demande
            </p>
          </div>

          {/* Informations sur le solde */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <FiClock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Solde de congés {new Date().getFullYear()}
                </p>
                <p className="text-sm text-blue-700">
                  {remainingDays} jour{remainingDays !== 1 ? 's' : ''} restant{remainingDays !== 1 ? 's' : ''} sur {user?.annualLeave || 25}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type de congé
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <FiCalendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                    className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <FiCalendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Affichage de la durée calculée */}
            {formData.startDate && formData.endDate && duration > 0 && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Durée :</strong> {duration} jour{duration > 1 ? 's' : ''} ouvré{duration > 1 ? 's' : ''}
                </p>
                {duration > remainingDays && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Cette demande dépasse votre solde de congés disponible
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Motif (optionnel)
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Précisez le motif de votre demande..."
                />
                <FiFileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setFormData({
                  type: 'congés payés',
                  startDate: '',
                  endDate: '',
                  reason: ''
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || duration > remainingDays || duration <= 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Soumission...' : 'Soumettre la demande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
