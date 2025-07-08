import { create } from 'zustand'

export interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: 'employe' | 'manager' | 'admin'
  department: string
  leaveBalance: number
  soldeConges: number
  dateEmbauche: string
  startDate: string
}

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie@entreprise.fr',
    role: 'employe',
    department: 'Marketing',
    leaveBalance: 25,
    soldeConges: 25,
    dateEmbauche: '2023-01-15',
    startDate: '2023-01-15'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Pierre',
    email: 'pierre@entreprise.fr',
    role: 'manager',
    department: 'IT',
    leaveBalance: 30,
    soldeConges: 30,
    dateEmbauche: '2022-03-10',
    startDate: '2022-03-10'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Sophie',
    email: 'admin@entreprise.fr',
    role: 'admin',
    department: 'RH',
    leaveBalance: 35,
    soldeConges: 35,
    dateEmbauche: '2021-06-01',
    startDate: '2021-06-01'
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email)
    if (user && password === 'demo123') {
      set({ user })
      return true
    }
    return false
  },
  logout: () => set({ user: null })
}))
