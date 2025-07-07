import { create } from 'zustand'
import { DemandeConge, SoldeConges } from '../types'

interface CongesState {
  demandes: DemandeConge[]
  solde: SoldeConges
  isLoading: boolean
  ajouterDemande: (demande: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => void
  modifierStatutDemande: (id: string, statut: 'approuve' | 'refuse', commentaire?: string, approuvePar?: string) => void
  fetchToutesLesDemandes: () => void
}

const demandesInitiales: DemandeConge[] = [
  {
    id: '1',
    utilisateurId: '1',
    utilisateurNom: 'Martin',
    utilisateurPrenom: 'Jean',
    utilisateurDepartement: 'Développement',
    typeConge: 'conges_payes',
    dateDebut: '2024-02-15',
    dateFin: '2024-02-19',
    nbJours: 5,
    motif: 'Vacances en famille',
    statut: 'en_attente',
    dateCreation: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    utilisateurId: '2',
    utilisateurNom: 'Dubois',
    utilisateurPrenom: 'Sophie',
    utilisateurDepartement: 'Marketing',
    typeConge: 'rtt',
    dateDebut: '2024-02-20',
    dateFin: '2024-02-20',
    nbJours: 1,
    motif: 'Rendez-vous médical',
    statut: 'approuve',
    dateCreation: '2024-01-20T14:30:00Z',
    dateTraitement: '2024-01-21T09:00:00Z',
    approuvePar: 'Admin Système'
  }
]

const soldeInitial: SoldeConges = {
  congesPayes: 25,
  rtt: 12,
  congesMaladie: 30,
  congesMaternite: 112,
  congesPaternite: 25,
  anciennete: 3
}

export const useCongesStore = create<CongesState>((set, get) => ({
  demandes: demandesInitiales,
  solde: soldeInitial,
  isLoading: false,

  ajouterDemande: (nouvelleDemande) => {
    const demande: DemandeConge = {
      ...nouvelleDemande,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
      statut: 'en_attente'
    }
    
    set((state) => ({
      demandes: [...state.demandes, demande]
    }))
  },

  modifierStatutDemande: (id, statut, commentaire, approuvePar) => {
    set((state) => ({
      demandes: state.demandes.map(demande =>
        demande.id === id
          ? {
              ...demande,
              statut,
              commentaire,
              approuvePar,
              dateTraitement: new Date().toISOString()
            }
          : demande
      )
    }))
  },

  fetchToutesLesDemandes: () => {
    // Simulation d'un appel API
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  }
}))
