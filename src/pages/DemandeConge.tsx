import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, TypeConge } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { FiCalendar, FiClock, FiFileText } from 'react-icons/fi'
import { format, addDays, isWeekend } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DemandeConge() {
  const { user } = useAuthStore()
  const { creerDemande, getSoldeEmploye, calculerJoursOuvrables } = useCongesStore()
  
  const [formData, setFormData] = useState({
    type: 'conges_payes' as TypeConge,
    dateDebut: '',
    dateFin: '',
    motif: ''
  })
  
  const [loading, setLoading] = useState(false)
  const solde = user ? getSoldeEmploye(user.id) : null
  
  const typesConges = [
    { value: 'conges_payes', label: 'Congés payés', max: solde?.congesPayes || 0 },
    { value: 'rtt', label: 'RTT', max: solde?.rtt || 0 },
    { value: 'maladie', label: 'Congé maladie', max: solde?.maladie || 0 },
    { value: 'maternite', label: 'Congé maternité', max: 112 },
    { value: 'paternite', label: 'Congé paternité', max: 25 },
    { value: 'formation', label: 'Formation', max: solde?.formation || 0 }
  ]
  
  const nbJours = formData.dateDebut && formData.dateFin 
    ? calculerJoursOuvrables(new Date(formData.dateDebut), new Date(formData.dateFin))
    : 0
  
  const typeSelectionne = typesConges.find(t => t.value === formData.type)
  const soldeInsuffisant = typeSelectionne && nbJours > typeSelectionne.max
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    if (soldeInsuffisant) {
      toast.error('Solde insuffisant pour ce type de congé')
      return
    }
    
    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      toast.error('La date de fin doit être postérieure à la date de début')
      return
    }
    
    setLoading(true)
    
    try {
      creerDemande({
        employeId: user.id,
        employeNom: user.nom,
        employePrenom: user.prenom,
        type: formData.type,
        dateDebut: new Date(formData.dateDebut),
        dateFin: new Date(formData.dateFin),
        nbJours,
        motif: formData.motif
      })
      
      toast.success('Demande de congé créée avec succès!')
      
      // Reset form
      setFormData({
        type: 'conges_payes',
        dateDebut: '',
        dateFin: '',
        motif: ''
      })
    } catch (error) {
      toast.error('Erreur lors de la création de la demande')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Nouvelle demande de congé
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Remplissez le formulaire pour soumettre votre demande
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de congé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de congé
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TypeConge })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {typesConges.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.max} jours disponibles)
                </option>
              ))}
            </select>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-1" />
                Date de début
              </label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-1" />
                Date de fin
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                min={formData.dateDebut || format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Calcul automatique des jours */}
          {nbJours > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <FiClock className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Nombre de jours ouvrables : {nbJours}
                </span>
              </div>
              {soldeInsuffisant && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Solde insuffisant ({typeSelectionne?.max} jours disponibles)
                </p>
              )}
            </div>
          )}
          
          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline mr-1" />
              Motif (optionnel)
            </label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Précisez le motif de votre demande..."
            />
          </div>
          
          {/* Soldes actuels */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vos soldes actuels :</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Congés payés :</span>
                <span className="font-medium ml-1">{solde?.congesPayes || 0} jours</span>
              </div>
              <div>
                <span className="text-gray-600">RTT :</span>
                <span className="font-medium ml-1">{solde?.rtt || 0} jours</span>
              </div>
              <div>
                <span className="text-gray-600">Maladie :</span>
                <span className="font-medium ml-1">{solde?.maladie || 0} jours</span>
              </div>
              <div>
                <span className="text-gray-600">Formation :</span>
                <span className="font-medium ml-1">{solde?.formation || 0} jours</span>
              </div>
            </div>
          </div>
          
          {/* Boutons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setFormData({ type: 'conges_payes', dateDebut: '', dateFin: '', motif: '' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || soldeInsuffisant || !formData.dateDebut || !formData.dateFin}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
