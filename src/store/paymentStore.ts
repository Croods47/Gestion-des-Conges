import { create } from 'zustand'
import { PaymentMethod, Transaction, Subscription } from '../types'

interface PaymentState {
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  subscription: Subscription | null
  isLoading: boolean
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  processPayment: (amount: number, paymentMethodId: string) => Promise<boolean>
  fetchTransactions: () => void
  updateSubscription: (plan: 'basic' | 'premium' | 'enterprise') => Promise<boolean>
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  }
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2999,
    currency: 'EUR',
    status: 'succeeded',
    description: 'Abonnement Premium - Janvier 2024',
    date: '2024-01-01T00:00:00Z',
    paymentMethod: 'Visa •••• 4242'
  }
]

const initialSubscription: Subscription = {
  id: '1',
  plan: 'premium',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  amount: 2999,
  currency: 'EUR'
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentMethods: initialPaymentMethods,
  transactions: initialTransactions,
  subscription: initialSubscription,
  isLoading: false,

  addPaymentMethod: (method) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString()
    }
    
    set((state) => ({
      paymentMethods: [...state.paymentMethods, newMethod]
    }))
  },

  removePaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.filter(method => method.id !== id)
    }))
  },

  setDefaultPaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    }))
  },

  processPayment: async (amount) => {
    set({ isLoading: true })
    
    // Simulation d'un paiement
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction: Transaction = {
          id: Date.now().toString(),
          amount,
          currency: 'EUR',
          status: Math.random() > 0.1 ? 'succeeded' : 'failed',
          description: `Paiement test - ${(amount / 100).toFixed(2)}€`,
          date: new Date().toISOString(),
          paymentMethod: 'Visa •••• 4242'
        }
        
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          isLoading: false
        }))
        
        resolve(transaction.status === 'succeeded')
      }, 2000)
    })
  },

  fetchTransactions: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  },

  updateSubscription: async (plan) => {
    set({ isLoading: true })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const prices = { basic: 999, premium: 2999, enterprise: 9999 }
        
        set((state) => ({
          subscription: state.subscription ? {
            ...state.subscription,
            plan,
            amount: prices[plan]
          } : null,
          isLoading: false
        }))
        
        resolve(true)
      }, 1500)
    })
  }
}))
