export interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'manager' | 'admin'
  department: string
  leaveBalance: number
  startDate: string
}

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

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  date: string
  paymentMethod: string
}

export interface Subscription {
  id: string
  plan: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  currency: string
}
