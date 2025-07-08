import { create } from 'zustand'

export type PaymentType = 'one-time' | 'recurring'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type RecurringInterval = 'monthly' | 'quarterly' | 'yearly'

export type PaymentPlan = {
  id: string
  name: string
  description: string
  price: number
  interval: RecurringInterval
  features: string[]
  popular?: boolean
}

export type Payment = {
  id: string
  userId: number
  type: PaymentType
  amount: number
  currency: string
  status: PaymentStatus
  description: string
  planId?: string
  recurringInterval?: RecurringInterval
  nextPaymentDate?: string
  createdAt: string
  updatedAt: string
  stripePaymentIntentId?: string
  stripeSubscriptionId?: string
}

export type PaymentMethod = {
  id: string
  userId: number
  type: 'card'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  stripePaymentMethodId: string
}

type PaymentState = {
  payments: Payment[]
  paymentMethods: PaymentMethod[]
  plans: PaymentPlan[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchPayments: (userId: number) => Promise<void>
  fetchPaymentMethods: (userId: number) => Promise<void>
  fetchPlans: () => Promise<void>
  createOneTimePayment: (userId: number, amount: number, description: string) => Promise<string>
  createSubscription: (userId: number, planId: string) => Promise<string>
  cancelSubscription: (subscriptionId: string) => Promise<void>
  addPaymentMethod: (userId: number, paymentMethodData: Omit<PaymentMethod, 'id' | 'userId'>) => Promise<void>
  removePaymentMethod: (paymentMethodId: string) => Promise<void>
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>
}

// Mock payment plans
const MOCK_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basique',
    description: 'Pour les petites équipes',
    price: 9.99,
    interval: 'monthly',
    features: [
      'Jusqu\'à 10 employés',
      'Gestion des congés payés',
      'Historique des demandes',
      'Support email'
    ]
  },
  {
    id: 'pro',
    name: 'Professionnel',
    description: 'Pour les entreprises en croissance',
    price: 19.99,
    interval: 'monthly',
    features: [
      'Jusqu\'à 50 employés',
      'Tous les types de congés',
      'Rapports avancés',
      'Intégrations API',
      'Support prioritaire'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Pour les grandes organisations',
    price: 49.99,
    interval: 'monthly',
    features: [
      'Employés illimités',
      'Personnalisation complète',
      'Conformité RGPD',
      'Support dédié',
      'Formation incluse'
    ]
  }
]

// Mock payments
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    userId: 1,
    type: 'recurring',
    amount: 19.99,
    currency: 'EUR',
    status: 'completed',
    description: 'Abonnement Professionnel - Novembre 2024',
    planId: 'pro',
    recurringInterval: 'monthly',
    nextPaymentDate: '2024-12-15',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:05:00Z',
    stripeSubscriptionId: 'sub_mock_123'
  },
  {
    id: '2',
    userId: 1,
    type: 'one-time',
    amount: 99.99,
    currency: 'EUR',
    status: 'completed',
    description: 'Formation équipe RH',
    createdAt: '2024-10-20T14:30:00Z',
    updatedAt: '2024-10-20T14:35:00Z',
    stripePaymentIntentId: 'pi_mock_456'
  }
]

// Mock payment methods
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    userId: 1,
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    stripePaymentMethodId: 'pm_mock_123'
  }
]

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  paymentMethods: [],
  plans: MOCK_PLANS,
  isLoading: false,
  error: null,
  
  fetchPayments: async (userId: number) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const userPayments = MOCK_PAYMENTS.filter(p => p.userId === userId)
      set({ payments: userPayments, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des paiements', isLoading: false })
    }
  },
  
  fetchPaymentMethods: async (userId: number) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const userMethods = MOCK_PAYMENT_METHODS.filter(pm => pm.userId === userId)
      set({ paymentMethods: userMethods, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des moyens de paiement', isLoading: false })
    }
  },
  
  fetchPlans: async () => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      set({ plans: MOCK_PLANS, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des plans', isLoading: false })
    }
  },
  
  createOneTimePayment: async (userId: number, amount: number, description: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const payment: Payment = {
        id: Date.now().toString(),
        userId,
        type: 'one-time',
        amount,
        currency: 'EUR',
        status: 'completed',
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stripePaymentIntentId: `pi_mock_${Date.now()}`
      }
      
      const { payments } = get()
      set({ payments: [payment, ...payments], isLoading: false })
      
      return payment.id
    } catch (error) {
      set({ error: 'Erreur lors du paiement', isLoading: false })
      throw error
    }
  },
  
  createSubscription: async (userId: number, planId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const plan = MOCK_PLANS.find(p => p.id === planId)
      if (!plan) throw new Error('Plan non trouvé')
      
      const payment: Payment = {
        id: Date.now().toString(),
        userId,
        type: 'recurring',
        amount: plan.price,
        currency: 'EUR',
        status: 'completed',
        description: `Abonnement ${plan.name}`,
        planId,
        recurringInterval: plan.interval,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stripeSubscriptionId: `sub_mock_${Date.now()}`
      }
      
      const { payments } = get()
      set({ payments: [payment, ...payments], isLoading: false })
      
      return payment.id
    } catch (error) {
      set({ error: 'Erreur lors de la création de l\'abonnement', isLoading: false })
      throw error
    }
  },
  
  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { payments } = get()
      const updatedPayments = payments.map(payment =>
        payment.stripeSubscriptionId === subscriptionId
          ? { ...payment, status: 'cancelled' as PaymentStatus, updatedAt: new Date().toISOString() }
          : payment
      )
      
      set({ payments: updatedPayments, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors de l\'annulation de l\'abonnement', isLoading: false })
      throw error
    }
  },
  
  addPaymentMethod: async (userId: number, paymentMethodData) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const paymentMethod: PaymentMethod = {
        ...paymentMethodData,
        id: Date.now().toString(),
        userId,
        stripePaymentMethodId: `pm_mock_${Date.now()}`
      }
      
      const { paymentMethods } = get()
      set({ paymentMethods: [...paymentMethods, paymentMethod], isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors de l\'ajout du moyen de paiement', isLoading: false })
      throw error
    }
  },
  
  removePaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const { paymentMethods } = get()
      const filteredMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId)
      
      set({ paymentMethods: filteredMethods, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors de la suppression du moyen de paiement', isLoading: false })
      throw error
    }
  },
  
  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const { paymentMethods } = get()
      const updatedMethods = paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }))
      
      set({ paymentMethods: updatedMethods, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour du moyen de paiement', isLoading: false })
      throw error
    }
  }
}))
