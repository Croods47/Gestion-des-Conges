import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { FiCalendar, FiFileText, FiSend } from 'react-icons/fi'
import { differenceInBusinessDays } from 'date-fns'

export default function DemandeConge() {
  const { user } = useAuthStore()
  const { ajouterDemande, solde, calculerJoursOuvrables } = useCongesStore()
  
  const [formData, setFormData] = useState({
    typeConge: 'Congés payés',
    dateDebut: '',
    dateFin: '',
    motif: ''
  })

  const typesConges = [
    'Congés payés',
    'RTT',
    'Congé maladie',
    'Congé maternité',
    'Congé paternité',
    'Congé sans solde'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dateDebut || !formData.dateFin || !formData.motif) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      toast.error('La date de fin doit être postérieure à la date de début')
      return
    }

    const nbJours = calculerJoursOuvrables(formData.dateDebut, formData.dateFin)
    
    if (formData.typeConge === 'Congés payés' && nbJours > solde.congesPayes) {
      toast.error('Solde de congés payés insuffisant')
      return
    }

    if (formData.typeConge === 'RTT' && nbJours > solde.rtt) {
      toast.error('Solde RTT insuffisant')
      return
    }

    ajouterDemande({
      utilisateurId: user!.id,
      utilisateurNom: user!.nom,
      utilisateurPrenom: user!.prenom,
      typeConge: formData.typeConge,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      nbJours,
      motif: formData.motif
    })

    toast.success('Demande de congé soumise avec succès')
    setFormData({
      typeConge: 'Congés payés',
      dateDebut: '',
      dateFin: '',
      motif: ''
    })
  }

  const nbJours = formData.dateDebut && formData.dateFin 
    ? calculerJoursOuvrables(formData.dateDebut, formData.dateFin)
    : 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Nouvelle demande de congé</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de congé
            </label>
            <select
              value={formData.typeConge}
              onChange={(e) => setFormData({ ...formData, typeConge: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typesConges.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline h-4 w-4 mr-1" />
                Date de début
              </label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline h-4 w-4 mr-1" />
                Date de fin
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {nbJours > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Durée :</strong> {nbJours} jour{nbJours > 1 ? 's' : ''} ouvrable{nbJours > 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline h-4 w-4 mr-1" />
              Motif
            </label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le motif de votre demande..."
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Solde actuel</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Congés payés :</span>
                <span className="ml-2 font-medium">{solde.congesPayes} jours</span>
              </div>
              <div>
                <span className="text-gray-600">RTT :</span>
                <span className="ml-2 font-medium">{solde.rtt} jours</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiSend className="h-4 w-4 mr-2" />
              Soumettre la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
