import { create } from 'zustand'
import { addDays, differenceInBusinessDays, format, isWeekend } from 'date-fns'
import { fr } from 'date-fns/locale'

export type StatutDemande = 'en_attente' | 'approuvee' | 'refusee'
export type TypeConge = 'conges_payes' | 'rtt' | 'maladie' | 'maternite' | 'paternite' | 'formation'

export interface DemandeConge {
  id: string
  employeId: string
  employeNom: string
  employePrenom: string
  type: TypeConge
  dateDebut: Date
  dateFin: Date
  nbJours: number
  motif: string
  statut: StatutDemande
  dateCreation: Date
  commentaireManager?: string
  approuvePar?: string
  dateApprobation?: Date
}

export interface SoldeConges {
  employeId: string
  congesPayes: number
  rtt: number
  maladie: number
  formation: number
}

interface CongesState {
  demandes: DemandeConge[]
  soldes: SoldeConges[]
  loading: boolean
  
  // Actions
  creerDemande: (demande: Omit<DemandeConge, 'id' | 'dateCreation' | 'statut'>) => void
  changerStatutDemande: (id: string, statut: StatutDemande, commentaire?: string, approuvePar?: string) => void
  fetchDemandesEmploye: (employeId: string) => DemandeConge[]
  fetchToutesDemandes: () => DemandeConge[]
  getSoldeEmploye: (employeId: string) => SoldeConges | undefined
  calculerJoursOuvrables: (dateDebut: Date, dateFin: Date) => number
}

// Données de démonstration
const demoSoldes: SoldeConges[] = [
  { employeId: '1', congesPayes: 25, rtt: 10, maladie: 30, formation: 5 },
  { employeId: '2', congesPayes: 25, rtt: 10, maladie: 30, formation: 5 },
  { employeId: '3', congesPayes: 25, rtt: 10, maladie: 30, formation: 5 }
]

const demoDemandes: DemandeConge[] = [
  {
    id: '1',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    type: 'conges_payes',
    dateDebut: new Date('2024-02-15'),
    dateFin: new Date('2024-02-19'),
    nbJours: 5,
    motif: 'Vacances en famille',
    statut: 'approuvee',
    dateCreation: new Date('2024-01-15'),
    commentaireManager: 'Demande approuvée',
    approuvePar: 'Marie Martin',
    dateApprobation: new Date('2024-01-16')
  },
  {
    id: '2',
    employeId: '2',
    employeNom: 'Martin',
    employePrenom: 'Marie',
    type: 'rtt',
    dateDebut: new Date('2024-03-01'),
    dateFin: new Date('2024-03-01'),
    nbJours: 1,
    motif: 'Rendez-vous médical',
    statut: 'en_attente',
    dateCreation: new Date('2024-02-20')
  },
  {
    id: '3',
    employeId: '1',
    employeNom: 'Dupont',
    employePrenom: 'Jean',
    type: 'conges_payes',
    dateDebut: new Date('2024-04-10'),
    dateFin: new Date('2024-04-12'),
    nbJours: 3,
    motif: 'Week-end prolongé',
    statut: 'refusee',
    dateCreation: new Date('2024-03-01'),
    commentaireManager: 'Période trop chargée',
    approuvePar: 'Marie Martin',
    dateApprobation: new Date('2024-03-02')
  }
]

export const useCongesStore = create<CongesState>((set, get) => ({
  demandes: demoDemandes,
  soldes: demoSoldes,
  loading: false,
  
  creerDemande: (nouvelleDemande) => {
    const demande: DemandeConge = {
      ...nouvelleDemande,
      id: Date.now().toString(),
      dateCreation: new Date(),
      statut: 'en_attente'
    }
    
    set(state => ({
      demandes: [...state.demandes, demande]
    }))
  },
  
  changerStatutDemande: (id, statut, commentaire, approuvePar) => {
    set(state => ({
      demandes: state.demandes.map(demande =>
        demande.id === id
          ? {
              ...demande,
              statut,
              commentaireManager: commentaire,
              approuvePar,
              dateApprobation: new Date()
            }
          : demande
      )
    }))
  },
  
  fetchDemandesEmploye: (employeId) => {
    return get().demandes.filter(demande => demande.employeId === employeId)
  },
  
  fetchToutesDemandes: () => {
    return get().demandes
  },
  
  getSoldeEmploye: (employeId) => {
    return get().soldes.find(solde => solde.employeId === employeId)
  },
  
  calculerJoursOuvrables: (dateDebut, dateFin) => {
    return differenceInBusinessDays(dateFin, dateDebut) + 1
  }
}))
