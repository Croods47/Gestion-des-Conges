import { create } from 'zustand'

export interface Leave {
  id: string
  employeeId: string
  type: string
  startDate: string
  endDate: string
  duration: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  managerComment?: string
}

interface LeaveState {
  leaves: Leave[]
  addLeave: (leave: Omit<Leave, 'id' | 'createdAt'>) => Promise<void>
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>
}

// Données de démonstration
const demoLeaves: Leave[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'congés payés',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    duration: 5,
    reason: 'Vacances en famille',
    status: 'approved',
    createdAt: '2024-01-15T10:00:00Z',
    managerComment: 'Approuvé - Bonnes vacances !'
  },
  {
    id: '2',
    employeeId: '1',
    type: 'RTT',
    startDate: '2024-03-01',
    endDate: '2024-03-01',
    duration: 1,
    reason: 'Rendez-vous médical',
    status: 'pending',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    employeeId: '2',
    type: 'congés payés',
    startDate: '2024-04-10',
    endDate: '2024-04-17',
    duration: 6,
    reason: 'Voyage',
    status: 'approved',
    createdAt: '2024-03-01T09:15:00Z'
  }
]

export const useLeaveStore = create<LeaveState>((set, get) => ({
  leaves: demoLeaves,
  addLeave: async (leave) => {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newLeave: Leave = {
      ...leave,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    set(state => ({
      leaves: [...state.leaves, newLeave]
    }))
  },
  updateLeaveStatus: async (id, status, comment) => {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => ({
      leaves: state.leaves.map(leave =>
        leave.id === id
          ? { ...leave, status, managerComment: comment }
          : leave
      )
    }))
  }
}))
