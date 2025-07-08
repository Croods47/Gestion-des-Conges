import { create } from 'zustand'
import { DemandeConge, SoldeConges, TypeConge, StatutDemande } from '../types'

interface CongesState {
  demandes: DemandeConge[]
  solde: SoldeConges
  loading: boolean
  error: string | null

  // Actions
  ajouterDemande: (demande: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => void
  modifierStatutDemande: (id: string, statut: StatutDemande, commentaire?: string, approuvePar?: string) => void
  getDemandesParEmploye: (employeId: string) => DemandeConge[]
  getToutesLesDemandes: () => DemandeConge[]
  fetchSoldeConges: (employeId: string) => void
}

// Données de démonstration
const demandesDemo: DemandeConge[] = [
  {
    id: '1',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    utilisateurNom: 'Dupont',
    utilisateurPrenom: 'Jean',
    dateDebut: '2024-02-15',
    dateFin: '2024-02-19',
    nbJours: 5,
    motif: 'Vacances en famille',
    typeConge: 'conges_payes',
    statut: 'approuve',
    dateCreation: '2024-01-15T10:00:00Z',
    approuvePar: 'Marie Martin',
    dateApprobation: '2024-01-16T14:30:00Z'
  },
  {
    id: '2',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    utilisateurNom: 'Dupont',
    utilisateurPrenom: 'Jean',
    dateDebut: '2024-03-10',
    dateFin: '2024-03-12',
    nbJours: 3,
    motif: 'Rendez-vous médical',
    typeConge: 'maladie',
    statut: 'en_attente',
    dateCreation: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    employeId: '2',
    employeNom: 'Martin',
    employePrenom: 'Marie',
    utilisateurNom: 'Martin',
    utilisateurPrenom: 'Marie',
    dateDebut: '2024-04-01',
    dateFin: '2024-04-05',
    nbJours: 5,
    motif: 'Congés de Pâques',
    typeConge: 'conges_payes',
    statut: 'en_attente',
    dateCreation: '2024-01-25T16:45:00Z'
  }
]

const soldeDemo: Record<string, SoldeConges> = {
  '1': { congesPayes: 20, rtt: 8, anciennete: 2 },
  '2': { congesPayes: 25, rtt: 10, anciennete: 5 },
  '3': { congesPayes: 30, rtt: 12, anciennete: 8 }
}

export const useCongesStore = create<CongesState>((set, get) => ({
  demandes: demandesDemo,
  solde: { congesPayes: 0, rtt: 0, anciennete: 0 },
  loading: false,
  error: null,

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
              dateApprobation: new Date().toISOString()
            }
          : demande
      )
    }))
  },

  getDemandesParEmploye: (employeId) => {
    return get().demandes.filter(demande => demande.employeId === employeId)
  },

  getToutesLesDemandes: () => {
    return get().demandes
  },

  fetchSoldeConges: (employeId) => {
    const solde = soldeDemo[employeId] || { congesPayes: 25, rtt: 10, anciennete: 1 }
    set({ solde })
  }
}))
