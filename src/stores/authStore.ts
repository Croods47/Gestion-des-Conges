import { create } from 'zustand'

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'employee' | 'manager' | 'admin'
  annualLeave: number
  avatar?: string
}

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Utilisateurs de démonstration
const demoUsers: User[] = [
  {
    id: '1',
    email: 'employe@demo.com',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'employee',
    annualLeave: 25
  },
  {
    id: '2',
    email: 'manager@demo.com',
    nom: 'Martin',
    prenom: 'Marie',
    role: 'manager',
    annualLeave: 25
  },
  {
    id: '3',
    email: 'admin@demo.com',
    nom: 'Durand',
    prenom: 'Pierre',
    role: 'admin',
    annualLeave: 25
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // Simulation d'une authentification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = demoUsers.find(u => u.email === email)
    
    if (user && password === 'demo123') {
      set({ user })
      return true
    }
    
    return false
  },
  logout: () => {
    set({ user: null })
  }
}))
