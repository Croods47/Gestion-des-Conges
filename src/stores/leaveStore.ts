import { create } from 'zustand'

export interface LeaveRequest {
  id: string
  userId: string
  userName: string
  userDepartment: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  comments?: string
}

export interface LeaveBalance {
  vacation: number
  sick: number
  personal: number
  maternity: number
  paternity: number
}

export interface LeaveState {
  requests: LeaveRequest[]
  balance: LeaveBalance
  isLoading: boolean
  error: string | null
  submitRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => void
  updateRequestStatus: (id: string, status: 'approved' | 'rejected', comments?: string, reviewedBy?: string) => void
  fetchUserRequests: (userId: string) => void
  fetchAllRequests: () => void
}

const mockRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: 'emp1',
    userName: 'Jean Martin',
    userDepartment: 'Développement',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    days: 8,
    reason: 'Vacances en famille',
    status: 'approved',
    submittedAt: '2024-01-15',
    reviewedAt: '2024-01-16',
    reviewedBy: 'Sophie Dubois',
    comments: 'Demande approuvée'
  }
]

export const useLeaveStore = create<LeaveState>((set) => ({
  requests: mockRequests,
  balance: {
    vacation: 25,
    sick: 10,
    personal: 5,
    maternity: 16,
    paternity: 3
  },
  isLoading: false,
  error: null,

  submitRequest: (newRequest) => {
    const request: LeaveRequest = {
      ...newRequest,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    set((state) => ({
      requests: [...state.requests, request]
    }))
  },

  updateRequestStatus: (id, status, comments, reviewedBy) => {
    set((state) => ({
      requests: state.requests.map(request =>
        request.id === id
          ? {
              ...request,
              status,
              comments,
              reviewedBy,
              reviewedAt: new Date().toISOString()
            }
          : request
      )
    }))
  },

  fetchUserRequests: (userId) => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  },

  fetchAllRequests: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  }
}))
