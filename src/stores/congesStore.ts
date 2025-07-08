import { create } from 'zustand'
import { DemandeConge, SoldeConges, StatutDemande, TypeConge } from '../types'

interface CongesState {
  demandes: DemandeConge[]
  solde: SoldeConges
  loading: boolean
  error: string | null

  // Actions
  ajouterDemande: (demande: Omit<DemandeConge, 'id' | 'statut' | 'dateCreation'>) => void
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
    dateApprobation: '2024-01-16T14:30:00Z',
    commentaire: 'Demande approuvée'
  },
  {
    id: '2',
    employeId: '2',
    employeNom: 'Martin',
    employePrenom: 'Marie',
    utilisateurNom: 'Martin',
    utilisateurPrenom: 'Marie',
    dateDebut: '2024-03-01',
    dateFin: '2024-03-01',
    nbJours: 1,
    motif: 'Rendez-vous médical',
    typeConge: 'rtt',
    statut: 'en_attente',
    dateCreation: '2024-02-20T09:15:00Z'
  },
  {
    id: '3',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    utilisateurNom: 'Dupont',
    utilisateurPrenom: 'Jean',
    dateDebut: '2024-04-10',
    dateFin: '2024-04-12',
    nbJours: 3,
    motif: 'Week-end prolongé',
    typeConge: 'conges_payes',
    statut: 'refuse',
    dateCreation: '2024-03-01T16:45:00Z',
    approuvePar: 'Pierre Durand',
    dateApprobation: '2024-03-02T11:20:00Z',
    commentaire: 'Période de forte activité, report souhaité'
  }
]

export const useCongesStore = create<CongesState>((set, get) => ({
  demandes: demandesDemo,
  solde: {
    congesPayes: 25,
    rtt: 8,
    anciennete: 3
  },
  loading: false,
  error: null,

  ajouterDemande: (nouvelleDemande) => {
    const demande: DemandeConge = {
      ...nouvelleDemande,
      id: Date.now().toString(),
      statut: 'en_attente',
      dateCreation: new Date().toISOString()
    }

    set(state => ({
      demandes: [...state.demandes, demande]
    }))
  },

  modifierStatutDemande: (id, statut, commentaire, approuvePar) => {
    set(state => ({
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
    // Simulation d'un appel API
    const soldes = {
      '1': { congesPayes: 22, rtt: 6, anciennete: 3 },
      '2': { congesPayes: 25, rtt: 8, anciennete: 5 },
      '3': { congesPayes: 30, rtt: 10, anciennete: 8 }
    }

    const solde = soldes[employeId as keyof typeof soldes] || { congesPayes: 25, rtt: 8, anciennete: 1 }
    
    set({ solde })
  }
}))
