import { create } from 'zustand'

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'employee' | 'manager' | 'admin'
  departement: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const utilisateursDemo: User[] = [
  {
    id: 'emp1',
    email: 'jean.martin@entreprise.fr',
    nom: 'Martin',
    prenom: 'Jean',
    role: 'employee',
    departement: 'Développement'
  },
  {
    id: 'mgr1',
    email: 'sophie.dubois@entreprise.fr',
    nom: 'Dubois',
    prenom: 'Sophie',
    role: 'manager',
    departement: 'Développement'
  },
  {
    id: 'admin1',
    email: 'admin@entreprise.fr',
    nom: 'Admin',
    prenom: 'Système',
    role: 'admin',
    departement: 'RH'
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simulation d'authentification
    const user = utilisateursDemo.find(u => u.email === email)
    
    if (user && password === 'password') {
      set({ user, isAuthenticated: true })
      return true
    }
    
    return false
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  }
}))
