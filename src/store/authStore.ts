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
    name: 'Marie Dupont',
    email: 'marie@entreprise.fr',
    role: 'employee',
    department: 'Marketing',
    leaveBalance: 25,
    startDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre@entreprise.fr',
    role: 'manager',
    department: 'IT',
    leaveBalance: 30,
    startDate: '2022-03-10'
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'admin@entreprise.fr',
    role: 'admin',
    department: 'RH',
    leaveBalance: 35,
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
