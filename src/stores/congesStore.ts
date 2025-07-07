import { create } from 'zustand'
import { differenceInBusinessDays } from 'date-fns'

export type StatutDemande = 'en_attente' | 'approuve' | 'refuse'

export interface DemandeConge {
  id: string
  utilisateurId: string
  utilisateurNom: string
  utilisateurPrenom: string
  typeConge: string
  dateDebut: string
  dateFin: string
  nbJours: number
  motif: string
  statut: StatutDemande
  dateCreation: string
  commentaire?: string
  approuvePar?: string
}

export interface SoldeConges {
  congesPayes: number
  congesMaladie: number
  congesMaternite: number
  congesPaternite: number
  rtt: number
  anciennete: number
}

export interface CongesState {
  demandes: DemandeConge[]
  solde: SoldeConges
  isLoading: boolean
  error: string | null
  ajouterDemande: (demande: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => void
  modifierStatutDemande: (id: string, statut: StatutDemande, commentaire?: string, approuvePar?: string) => void
  fetchDemandesUtilisateur: (utilisateurId: string) => void
  fetchToutesLesDemandes: () => void
  calculerJoursOuvrables: (dateDebut: string, dateFin: string) => number
}

const demandesInitiales: DemandeConge[] = [
  {
    id: '1',
    utilisateurId: 'emp1',
    utilisateurNom: 'Martin',
    utilisateurPrenom: 'Jean',
    typeConge: 'Congés payés',
    dateDebut: '2024-02-15',
    dateFin: '2024-02-25',
    nbJours: 8,
    motif: 'Vacances en famille',
    statut: 'approuve',
    dateCreation: '2024-01-15',
    commentaire: 'Demande approuvée',
    approuvePar: 'Sophie Dubois'
  },
  {
    id: '2',
    utilisateurId: 'emp1',
    utilisateurNom: 'Martin',
    utilisateurPrenom: 'Jean',
    typeConge: 'Congé maladie',
    dateDebut: '2024-03-10',
    dateFin: '2024-03-12',
    nbJours: 3,
    motif: 'Grippe',
    statut: 'en_attente',
    dateCreation: '2024-03-09'
  }
]

export const useCongesStore = create<CongesState>((set, get) => ({
  demandes: demandesInitiales,
  solde: {
    congesPayes: 25,
    congesMaladie: 10,
    congesMaternite: 16,
    congesPaternite: 3,
    rtt: 8,
    anciennete: 2
  },
  isLoading: false,
  error: null,

  ajouterDemande: (nouvelleDemande) => {
    const demande: DemandeConge = {
      ...nouvelleDemande,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split('T')[0],
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
          ? { ...demande, statut, commentaire, approuvePar }
          : demande
      )
    }))
  },

  fetchDemandesUtilisateur: (utilisateurId) => {
    set({ isLoading: true })
    // Simulation d'un appel API
    setTimeout(() => {
      const demandesUtilisateur = get().demandes.filter(d => d.utilisateurId === utilisateurId)
      set({ demandes: demandesUtilisateur, isLoading: false })
    }, 500)
  },

  fetchToutesLesDemandes: () => {
    set({ isLoading: true })
    // Simulation d'un appel API
    setTimeout(() => {
      set({ demandes: demandesInitiales, isLoading: false })
    }, 500)
  },

  calculerJoursOuvrables: (dateDebut, dateFin) => {
    return differenceInBusinessDays(new Date(dateFin), new Date(dateDebut)) + 1
  }
}))
