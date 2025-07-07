import { create } from 'zustand'

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

export interface PaymentState {
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  subscription: Subscription | null
  isLoading: boolean
  error: string | null
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  processPayment: (amount: number, paymentMethodId: string) => Promise<boolean>
  fetchTransactions: () => void
  updateSubscription: (plan: 'basic' | 'premium' | 'enterprise') => Promise<boolean>
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    last4: '0005',
    brand: 'mastercard',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false
  }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2999,
    currency: 'EUR',
    status: 'succeeded',
    description: 'Abonnement Premium - Janvier 2024',
    date: '2024-01-15',
    paymentMethod: 'Visa •••• 4242'
  },
  {
    id: '2',
    amount: 2999,
    currency: 'EUR',
    status: 'succeeded',
    description: 'Abonnement Premium - Décembre 2023',
    date: '2023-12-15',
    paymentMethod: 'Visa •••• 4242'
  }
]

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentMethods: mockPaymentMethods,
  transactions: mockTransactions,
  subscription: {
    id: 'sub_1',
    plan: 'premium',
    status: 'active',
    currentPeriodStart: '2024-01-15',
    currentPeriodEnd: '2024-02-15',
    amount: 2999,
    currency: 'EUR'
  },
  isLoading: false,
  error: null,

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

  processPayment: async (amount, paymentMethodId) => {
    set({ isLoading: true })
    
    // Simulation d'un paiement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const success = Math.random() > 0.1 // 90% de succès
    
    if (success) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount,
        currency: 'EUR',
        status: 'succeeded',
        description: 'Paiement test',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Carte de test'
      }
      
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }))
    } else {
      set({ isLoading: false, error: 'Échec du paiement' })
    }
    
    return success
  },

  fetchTransactions: () => {
    set({ isLoading: true })
    // Simulation d'un appel API
    setTimeout(() => {
      set({ isLoading: false })
    }, 1000)
  },

  updateSubscription: async (plan) => {
    set({ isLoading: true })
    
    // Simulation d'une mise à jour d'abonnement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const planPrices = {
      basic: 999,
      premium: 2999,
      enterprise: 9999
    }
    
    set((state) => ({
      subscription: state.subscription ? {
        ...state.subscription,
        plan,
        amount: planPrices[plan]
      } : null,
      isLoading: false
    }))
    
    return true
  }
}))
