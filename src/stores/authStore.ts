import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    nom: 'Martin',
    prenom: 'Jean',
    email: 'jean.martin@entreprise.fr',
    role: 'employee',
    department: 'Développement',
    startDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    nom: 'Dubois',
    prenom: 'Sophie',
    email: 'sophie.dubois@entreprise.fr',
    role: 'manager',
    department: 'Marketing',
    startDate: '2022-03-10',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@entreprise.fr',
    role: 'admin',
    department: 'RH',
    startDate: '2021-06-01',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email)
    if (user && password === 'password') {
      set({ user })
      return true
    }
    return false
  },
  logout: () => set({ user: null })
}))
