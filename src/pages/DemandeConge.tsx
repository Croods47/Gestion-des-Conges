import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, TypeConge } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { differenceInBusinessDays, parseISO, format, isWeekend } from 'date-fns'
import { FiCalendar, FiClock, FiFileText, FiSend } from 'react-icons/fi'

const DemandeConge = () => {
  const { user } = useAuthStore()
  const { creerDemande, isLoading, solde, fetchSoldeConges } = useCongesStore()
  
  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    typeConge: 'conges_payes' as TypeConge,
    motif: ''
  })
  
  const [nbJours, setNbJours] = useState(0)
  
  useEffect(() => {
    if (user) {
      fetchSoldeConges(user.id)
    }
  }, [user, fetchSoldeConges])
  
  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      const debut = parseISO(formData.dateDebut)
      const fin = parseISO(formData.dateFin)
      const jours = differenceInBusinessDays(fin, debut) + 1
      setNbJours(Math.max(0, jours))
    } else {
      setNbJours(0)
    }
  }, [formData.dateDebut, formData.dateFin])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    if (nbJours <= 0) {
      toast.error('Veuillez sélectionner des dates valides')
      return
    }
    
    if (formData.typeConge === 'conges_payes' && nbJours > solde.congesPayes) {
      toast.error('Solde de congés payés insuffisant')
      return
    }
    
    if (formData.typeConge === 'rtt' && nbJours > solde.rtt) {
      toast.error('Solde RTT insuffisant')
      return
    }
    
    try {
      creerDemande({
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
      
      toast.success('Demande de congé créée avec succès')
      setFormData({
        dateDebut: '',
        dateFin: '',
        typeConge: 'conges_payes',
        motif: ''
      })
    } catch (error) {
      toast.error('Erreur lors de la création de la demande')
    }
  }
  
  const getTypeCongeLabel = (type: TypeConge) => {
    const labels = {
      conges_payes: 'Congés payés',
      rtt: 'RTT',
      maladie: 'Congé maladie',
      maternite: 'Congé maternité',
      paternite: 'Congé paternité',
      formation: 'Formation'
    }
    return labels[type]
  }
  
  const getSoldeDisponible = (type: TypeConge) => {
    switch (type) {
      case 'conges_payes':
        return solde.congesPayes
      case 'rtt':
        return solde.rtt
      default:
        return 0
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Nouvelle demande de congé
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Remplissez le formulaire ci-dessous pour soumettre votre demande.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="dateDebut"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    id="dateFin"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="typeConge" className="block text-sm font-medium text-gray-700">
                Type de congé
              </label>
              <select
                id="typeConge"
                value={formData.typeConge}
                onChange={(e) => setFormData({ ...formData, typeConge: e.target.value as TypeConge })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="conges_payes">Congés payés</option>
                <option value="rtt">RTT</option>
                <option value="maladie">Congé maladie</option>
                <option value="maternite">Congé maternité</option>
                <option value="paternite">Congé paternité</option>
                <option value="formation">Formation</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
                Motif
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="motif"
                  rows={3}
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Décrivez brièvement le motif de votre demande..."
                  required
                />
                <FiFileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Résumé */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé de la demande</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium">{getTypeCongeLabel(formData.typeConge)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Durée:</span>
                  <span className="ml-2 font-medium">{nbJours} jour{nbJours > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-gray-500">Solde disponible:</span>
                  <span className="ml-2 font-medium">{getSoldeDisponible(formData.typeConge)} jours</span>
                </div>
                <div>
                  <span className="text-gray-500">Solde après:</span>
                  <span className={`ml-2 font-medium ${getSoldeDisponible(formData.typeConge) - nbJours < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {getSoldeDisponible(formData.typeConge) - nbJours} jours
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || nbJours <= 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <FiClock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FiSend className="h-4 w-4 mr-2" />
                )}
                Soumettre la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DemandeConge
