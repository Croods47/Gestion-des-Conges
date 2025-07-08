import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

// Utilisateurs de démonstration
const demoUsers: User[] = [
  {
    id: '1',
    email: 'employe@demo.com',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'employe',
    departement: 'Développement'
  },
  {
    id: '2',
    email: 'manager@demo.com',
    nom: 'Martin',
    prenom: 'Marie',
    role: 'manager',
    departement: 'Développement'
  },
  {
    id: '3',
    email: 'admin@demo.com',
    nom: 'Durand',
    prenom: 'Pierre',
    role: 'admin',
    departement: 'RH'
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })

    // Simulation d'un délai d'authentification
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = demoUsers.find(u => u.email === email)
    
    if (user && password === 'demo123') {
      set({ user, loading: false })
      return true
    } else {
      set({ 
        error: 'Email ou mot de passe incorrect', 
        loading: false 
      })
      return false
    }
  },

  logout: () => {
    set({ user: null, error: null })
  },

  clearError: () => {
    set({ error: null })
  }
}))
