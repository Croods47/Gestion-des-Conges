import { create } from 'zustand'
import { LeaveRequest } from '../types'

interface LeaveState {
  requests: LeaveRequest[]
  addRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void
  updateRequest: (id: string, updates: Partial<LeaveRequest>) => void
  getRequestsByUser: (userId: string) => LeaveRequest[]
  getAllRequests: () => LeaveRequest[]
}

// Mock data
const mockRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Marie Dupont',
    userDepartment: 'Marketing',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 4,
    reason: 'Vacances en famille',
    status: 'approved',
    submittedAt: '2024-01-15T10:00:00Z',
    reviewedAt: '2024-01-16T14:30:00Z',
    reviewedBy: 'Pierre Martin'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Pierre Martin',
    userDepartment: 'IT',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 2,
    reason: 'Grippe',
    status: 'approved',
    submittedAt: '2024-01-20T08:00:00Z',
    reviewedAt: '2024-01-20T09:00:00Z',
    reviewedBy: 'Sophie Bernard'
  },
  {
    id: '3',
    userId: '1',
    userName: 'Marie Dupont',
    userDepartment: 'Marketing',
    type: 'personal',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    days: 2,
    reason: 'Rendez-vous médical',
    status: 'pending',
    submittedAt: '2024-01-25T16:00:00Z'
  }
]

export const useLeaveStore = create<LeaveState>((set, get) => ({
  requests: mockRequests,
  addRequest: (request) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    }
    set((state) => ({
      requests: [...state.requests, newRequest]
    }))
  },
  updateRequest: (id, updates) => {
    set((state) => ({
      requests: state.requests.map(req =>
        req.id === id ? { ...req, ...updates } : req
      )
    }))
  },
  getRequestsByUser: (userId) => {
    return get().requests.filter(req => req.userId === userId)
  },
  getAllRequests: () => {
    return get().requests
  }
}))
