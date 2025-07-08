export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'employe' | 'manager' | 'admin'
  departement: string
}

export interface DemandeConge {
  id: string
  employeId: string
  employeNom: string
  employePrenom: string
  utilisateurNom: string
  utilisateurPrenom: string
  dateDebut: string
  dateFin: string
  nbJours: number
  motif: string
  typeConge: TypeConge
  statut: StatutDemande
  dateCreation: string
  commentaire?: string
  approuvePar?: string
  dateApprobation?: string
}

export type TypeConge = 'conges_payes' | 'rtt' | 'maladie' | 'maternite' | 'paternite' | 'formation' | 'autre'

export type StatutDemande = 'en_attente' | 'approuve' | 'refuse'

export interface SoldeConges {
  congesPayes: number
  rtt: number
  anciennete: number
}

export interface Employe {
  id: string
  nom: string
  prenom: string
  email: string
  departement: string
  dateEmbauche: string
  soldeConges: SoldeConges
}
