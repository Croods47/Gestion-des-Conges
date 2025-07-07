import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, TypeConge } from '../stores/congesStore'
import { toast } from 'react-toastify'
import { differenceInBusinessDays, parseISO, format, addDays, isWeekend } from 'date-fns'
import { fr } from 'date-fns/locale'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FiCalendar, FiClock, FiFileText, FiSend } from 'react-icons/fi'

const DemandeConge = () => {
  const { user } = useAuthStore()
  const { creerDemande, isLoading, solde, fetchSoldeConges } = useCongesStore()
  const navigate = useNavigate()
  
  const [typeConge, setTypeConge] = useState<TypeConge>('congés payés')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [motif, setMotif] = useState('')
  const [showCalendar, setShowCalendar] = useState<'debut' | 'fin' | null>(null)
  const [nbJours, setNbJours] = useState(0)
  
  useEffect(() => {
    if (user) {
      fetchSoldeConges(user.id)
    }
  }, [user, fetchSoldeConges])
  
  useEffect(() => {
    if (dateDebut && dateFin) {
      const debut = parseISO(dateDebut)
      const fin = parseISO(dateFin)
      
      if (fin >= debut) {
        const jours = differenceInBusinessDays(fin, debut) + 1
        setNbJours(jours)
      } else {
        setNbJours(0)
      }
    } else {
      setNbJours(0)
    }
  }, [dateDebut, dateFin])
  
  const typesConge: { value: TypeConge; label: string; description: string }[] = [
    { 
      value: 'congés payés', 
      label: 'Congés payés', 
      description: `Solde disponible: ${solde.congesPayes} jours` 
    },
    { 
      value: 'RTT', 
      label: 'RTT', 
      description: `Solde disponible: ${solde.rtt} jours` 
    },
    { 
      value: 'congé sans solde', 
      label: 'Congé sans solde', 
      description: 'Non décompté du solde' 
    },
    { 
      value: 'congé maladie', 
      label: 'Congé maladie', 
      description: 'Certificat médical requis' 
    },
    { 
      value: 'congé exceptionnel', 
      label: 'Congé exceptionnel', 
      description: 'Événements familiaux' 
    }
  ]
  
  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    
    if (showCalendar === 'debut') {
      setDateDebut(dateStr)
      // Auto-set end date if not set
      if (!dateFin) {
        setDateFin(dateStr)
      }
    } else if (showCalendar === 'fin') {
      setDateFin(dateStr)
    }
    
    setShowCalendar(null)
  }
  
  const isDateDisabled = ({ date }: { date: Date }) => {
    // Disable weekends for paid leave and RTT
    if ((typeConge === 'congés payés' || typeConge === 'RTT') && isWeekend(date)) {
      return true
    }
    
    // Disable past dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    // Validations
    if (!dateDebut || !dateFin) {
      toast.error('Veuillez sélectionner les dates de début et de fin')
      return
    }
    
    if (parseISO(dateFin) < parseISO(dateDebut)) {
      toast.error('La date de fin doit être postérieure à la date de début')
      return
    }
    
    if (nbJours <= 0) {
      toast.error('La durée du congé doit être d\'au moins 1 jour')
      return
    }
    
    // Check available balance
    if (typeConge === 'congés payés' && nbJours > solde.congesPayes) {
      toast.error(`Solde insuffisant. Vous avez ${solde.congesPayes} jours de congés payés disponibles`)
      return
    }
    
    if (typeConge === 'RTT' && nbJours > solde.rtt) {
      toast.error(`Solde insuffisant. Vous avez ${solde.rtt} jours de RTT disponibles`)
      return
    }
    
    try {
      await creerDemande({
        utilisateurId: user.id,
        utilisateurNom: user.nom,
        utilisateurPrenom: user.prenom,
        typeConge,
        dateDebut,
        dateFin,
        nbJours,
        motif: motif.trim() || undefined
      })
      
      toast.success('Demande de congé créée avec succès')
      navigate('/historique')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la création de la demande')
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle demande de congé</h1>
        <p className="mt-1 text-sm text-gray-500">
          Remplissez le formulaire pour soumettre votre demande de congé.
        </p>
      </div>
      
      {/* Solde actuel */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Votre solde de congés</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">Congés payés</p>
            <p className="text-2xl font-bold text-blue-900">{solde.congesPayes} jours</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">RTT</p>
            <p className="text-2xl font-bold text-blue-900">{solde.rtt} jours</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Type de congé */}
        <div>
          <label className="label">Type de congé</label>
          <div className="mt-2 space-y-2">
            {typesConge.map((type) => (
              <label key={type.value} className="flex items-start">
                <input
                  type="radio"
                  name="typeConge"
                  value={type.value}
                  checked={typeConge === type.value}
                  onChange={(e) => setTypeConge(e.target.value as TypeConge)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dateDebut" className="label">
              Date de début
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                id="dateDebut"
                className="input pl-10"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
              <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="dateFin" className="label">
              Date de fin
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                id="dateFin"
                className="input pl-10"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                min={dateDebut || format(new Date(), 'yyyy-MM-dd')}
                required
              />
              <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Durée calculée */}
        {nbJours > 0 && (
          <div className="flex items-center p-3 bg-green-50 rounded-md">
            <FiClock className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">
              Durée: <strong>{nbJours} jour{nbJours > 1 ? 's' : ''} ouvrable{nbJours > 1 ? 's' : ''}</strong>
              {dateDebut && dateFin && (
                <span className="ml-2">
                  (du {format(parseISO(dateDebut), 'dd MMM yyyy', { locale: fr })} 
                  au {format(parseISO(dateFin), 'dd MMM yyyy', { locale: fr })})
                </span>
              )}
            </span>
          </div>
        )}
        
        {/* Motif */}
        <div>
          <label htmlFor="motif" className="label">
            Motif (optionnel)
          </label>
          <div className="mt-1 relative">
            <textarea
              id="motif"
              rows={3}
              className="input pl-10"
              placeholder="Décrivez brièvement le motif de votre demande..."
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            />
            <FiFileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Avertissements */}
        {typeConge === 'congé maladie' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>Important :</strong> Un certificat médical sera requis pour valider cette demande.
            </p>
          </div>
        )}
        
        {((typeConge === 'congés payés' && nbJours > solde.congesPayes) ||
          (typeConge === 'RTT' && nbJours > solde.rtt)) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Attention :</strong> Votre solde est insuffisant pour cette demande.
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/historique')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || nbJours <= 0}
            className="btn-primary"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
            ) : (
              <>
                <FiSend className="mr-2 h-4 w-4" />
                Soumettre la demande
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DemandeConge
