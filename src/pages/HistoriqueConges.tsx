import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCongesStore, StatutDemande } from '../stores/congesStore'
import CongeCard from '../components/CongeCard'
import { FiFilter, FiSearch } from 'react-icons/fi'

const HistoriqueConges = () => {
  const { user } = useAuthStore()
  const { demandes, isLoading, fetchDemandesUtilisateur } = useCongesStore()
  const [filtreStatut, setFiltreStatut] = useState<StatutDemande | 'tous'>('tous')
  const [recherche, setRecherche] = useState('')
  
  useEffect(() => {
    if (user) {
      fetchDemandesUtilisateur(user.id)
    }
  }, [user, fetchDemandesUtilisateur])
  
  const demandesFiltrees = demandes.filter(demande => {
    const matchStatut = filtreStatut === 'tous' || demande.statut === filtreStatut
    const matchRecherche = recherche === '' || 
      demande.typeConge.toLowerCase().includes(recherche.toLowerCase()) ||
      (demande.motif && demande.motif.toLowerCase().includes(recherche.toLowerCase()))
    
    return matchStatut && matchRecherche
  })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des congés</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez toutes vos demandes de congés passées et en cours.
        </p>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="recherche" className="label">
              Rechercher
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="recherche"
                className="input pl-10"
                placeholder="Type de congé, motif..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="statut" className="label">
              Filtrer par statut
            </label>
            <div className="mt-1 relative">
              <select
                id="statut"
                className="input pl-10"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutDemande | 'tous')}
              >
                <option value="tous">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="approuvée">Approuvée</option>
                <option value="refusée">Refusée</option>
              </select>
              <FiFilter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} trouvée{demandesFiltrees.length > 1 ? 's' : ''}
          </p>
        </div>
        
        {demandesFiltrees.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demandesFiltrees.map((demande) => (
              <CongeCard key={demande.id} demande={demande} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <FiFilter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune demande ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoriqueConges
