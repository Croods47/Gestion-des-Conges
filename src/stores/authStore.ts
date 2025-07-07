import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: 'employe' | 'manager' | 'admin'
  soldeConges: number
  dateEmbauche: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

// Utilisateurs de démonstration
const demoUsers: User[] = [
  {
    id: '1',
    email: 'employe@demo.com',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'employe',
    soldeConges: 25,
    dateEmbauche: '2020-01-15'
  },
  {
    id: '2',
    email: 'manager@demo.com',
    nom: 'Martin',
    prenom: 'Marie',
    role: 'manager',
    soldeConges: 30,
    dateEmbauche: '2018-03-10'
  },
  {
    id: '3',
    email: 'admin@demo.com',
    nom: 'Durand',
    prenom: 'Pierre',
    role: 'admin',
    soldeConges: 35,
    dateEmbauche: '2015-06-01'
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulation d'une authentification
        const user = demoUsers.find(u => u.email === email)
        if (user && password === 'demo123') {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      checkAuth: () => {
        const state = get()
        if (state.user) {
          set({ isAuthenticated: true })
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
