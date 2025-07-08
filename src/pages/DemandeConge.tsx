import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { TypeConge } from '../types'
import { Calendar, FileText, Send } from 'lucide-react'

export default function DemandeConge() {
  const { user } = useAuthStore()
  const { ajouterDemande } = useCongesStore()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    typeConge: 'conges_payes' as TypeConge,
    motif: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const typesConge = [
    { value: 'conges_payes', label: 'Congés payés' },
    { value: 'rtt', label: 'RTT' },
    { value: 'maladie', label: 'Maladie' },
    { value: 'maternite', label: 'Maternité' },
    { value: 'paternite', label: 'Paternité' },
    { value: 'formation', label: 'Formation' },
    { value: 'autre', label: 'Autre' }
  ]

  const calculateDays = (debut: string, fin: string): number => {
    if (!debut || !fin) return 0
    const start = new Date(debut)
    const end = new Date(fin)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise'
    }

    if (!formData.dateFin) {
      newErrors.dateFin = 'La date de fin est requise'
    }

    if (formData.dateDebut && formData.dateFin) {
      const debut = new Date(formData.dateDebut)
      const fin = new Date(formData.dateFin)
      
      if (debut > fin) {
        newErrors.dateFin = 'La date de fin doit être après la date de début'
      }

      if (debut < new Date()) {
        newErrors.dateDebut = 'La date de début ne peut pas être dans le passé'
      }
    }

    if (!formData.motif.trim()) {
      newErrors.motif = 'Le motif est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    const nbJours = calculateDays(formData.dateDebut, formData.dateFin)

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

    navigate('/historique')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const nbJours = calculateDays(formData.dateDebut, formData.dateFin)

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Nouvelle demande de congé
          </h1>
          <p className="mt-2 text-gray-600">
            Remplissez le formulaire ci-dessous pour soumettre votre demande.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700">
                  Date de début *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateDebut"
                    value={formData.dateDebut}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.dateDebut ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dateDebut && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700">
                  Date de fin *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateFin"
                    value={formData.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.dateFin ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dateFin && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="typeConge" className="block text-sm font-medium text-gray-700">
                Type de congé *
              </label>
              <select
                id="typeConge"
                value={formData.typeConge}
                onChange={(e) => handleInputChange('typeConge', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {typesConge.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
                Motif *
              </label>
              <div className="mt-1 relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="motif"
                  rows={4}
                  value={formData.motif}
                  onChange={(e) => handleInputChange('motif', e.target.value)}
                  placeholder="Décrivez le motif de votre demande..."
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.motif ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.motif && (
                <p className="mt-1 text-sm text-red-600">{errors.motif}</p>
              )}
            </div>

            {nbJours > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Durée de la demande
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Nombre de jours demandés : <strong>{nbJours} jour{nbJours > 1 ? 's' : ''}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/historique')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Soumettre la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
