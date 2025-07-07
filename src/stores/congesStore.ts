import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DemandeConge {
  id: string
  employeId: string
  employeNom: string
  employePrenom: string
  dateDebut: string
  dateFin: string
  nbJours: number
  motif: string
  statut: 'en_attente' | 'approuve' | 'refuse'
  dateCreation: string
  commentaire?: string
  approuvePar?: string
  dateApprobation?: string
}

export interface SoldeConges {
  congesPayes: number
  rtt: number
  anciennete: number
}

interface CongesState {
  demandes: DemandeConge[]
  solde: SoldeConges
  isLoading: boolean
  fetchDemandesUtilisateur: (userId: string) => void
  fetchSoldeConges: (userId: string) => void
  ajouterDemande: (demande: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => void
  approuverDemande: (id: string, commentaire?: string, approuvePar?: string) => void
  refuserDemande: (id: string, commentaire?: string, approuvePar?: string) => void
  getDemandesParEmploye: (employeId: string) => DemandeConge[]
  getToutesLesDemandes: () => DemandeConge[]
}

// Données de démonstration
const demoData: DemandeConge[] = [
  {
    id: '1',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    dateDebut: '2024-02-15',
    dateFin: '2024-02-20',
    nbJours: 4,
    motif: 'Vacances familiales',
    statut: 'approuve',
    dateCreation: '2024-01-15',
    commentaire: 'Demande approuvée',
    approuvePar: 'Marie Martin',
    dateApprobation: '2024-01-16'
  },
  {
    id: '2',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    dateDebut: '2024-03-10',
    dateFin: '2024-03-15',
    nbJours: 4,
    motif: 'Congés personnels',
    statut: 'en_attente',
    dateCreation: '2024-02-10'
  },
  {
    id: '3',
    employeId: '2',
    employeNom: 'Martin',
    employePrenom: 'Marie',
    dateDebut: '2024-04-01',
    dateFin: '2024-04-10',
    nbJours: 7,
    motif: 'Vacances de printemps',
    statut: 'en_attente',
    dateCreation: '2024-02-01'
  }
]

const demoSolde: SoldeConges = {
  congesPayes: 25,
  rtt: 8,
  anciennete: 5
}

export const useCongesStore = create<CongesState>()(
  persist(
    (set, get) => ({
      demandes: demoData,
      solde: demoSolde,
      isLoading: false,
      fetchDemandesUtilisateur: (userId: string) => {
        set({ isLoading: true })
        // Simulation d'un appel API
        setTimeout(() => {
          const userDemandes = demoData.filter(d => d.employeId === userId)
          set({ demandes: userDemandes, isLoading: false })
        }, 500)
      },
      fetchSoldeConges: (userId: string) => {
        set({ isLoading: true })
        // Simulation d'un appel API
        setTimeout(() => {
          set({ solde: demoSolde, isLoading: false })
        }, 300)
      },
      ajouterDemande: (nouvelleDemande) => {
        const demande: DemandeConge = {
          ...nouvelleDemande,
          id: Date.now().toString(),
          dateCreation: new Date().toISOString().split('T')[0],
          statut: 'en_attente'
        }
        set(state => ({
          demandes: [...state.demandes, demande]
        }))
      },
      approuverDemande: (id, commentaire, approuvePar) => {
        set(state => ({
          demandes: state.demandes.map(demande =>
            demande.id === id
              ? {
                  ...demande,
                  statut: 'approuve' as const,
                  commentaire,
                  approuvePar,
                  dateApprobation: new Date().toISOString().split('T')[0]
                }
              : demande
          )
        }))
      },
      refuserDemande: (id, commentaire, approuvePar) => {
        set(state => ({
          demandes: state.demandes.map(demande =>
            demande.id === id
              ? {
                  ...demande,
                  statut: 'refuse' as const,
                  commentaire,
                  approuvePar,
                  dateApprobation: new Date().toISOString().split('T')[0]
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
      }
    }),
    {
      name: 'conges-storage'
    }
  )
)
