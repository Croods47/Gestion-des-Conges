import { create } from 'zustand'
import { PaymentMethod, Transaction, Subscription } from '../types'

interface PaymentState {
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  subscription: Subscription | null
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateSubscription: (subscription: Subscription) => void
}

// Mock data
const mockPaymentMethods: PaymentMethod[] = [
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

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2999,
    currency: 'eur',
    status: 'succeeded',
    description: 'Abonnement Premium - Janvier 2024',
    date: '2024-01-01T00:00:00Z',
    paymentMethod: 'Visa •••• 4242'
  },
  {
    id: '2',
    amount: 999,
    currency: 'eur',
    status: 'succeeded',
    description: 'Formation RH supplémentaire',
    date: '2024-01-15T00:00:00Z',
    paymentMethod: 'Visa •••• 4242'
  }
]

const mockSubscription: Subscription = {
  id: '1',
  plan: 'premium',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  amount: 2999,
  currency: 'eur'
}

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentMethods: mockPaymentMethods,
  transactions: mockTransactions,
  subscription: mockSubscription,
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
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    set((state) => ({
      transactions: [newTransaction, ...state.transactions]
    }))
  },
  updateSubscription: (subscription) => {
    set({ subscription })
  }
}))
