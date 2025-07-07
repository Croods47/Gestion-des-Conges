import { create } from 'zustand'

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4?: string
  brand?: string
  bankName?: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  date: Date
  paymentMethodId: string
}

export interface Subscription {
  id: string
  planName: string
  amount: number
  currency: string
  interval: 'month' | 'year'
  status: 'active' | 'canceled' | 'past_due'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

interface PaymentState {
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  subscription: Subscription | null
  loading: boolean
  
  // Actions
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  processPayment: (amount: number, description: string, paymentMethodId: string) => Promise<boolean>
  createSubscription: (planName: string, amount: number, interval: 'month' | 'year') => Promise<boolean>
  cancelSubscription: () => void
  fetchTransactions: () => Transaction[]
}

// Données de démonstration
const demoPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    isDefault: false
  },
  {
    id: '3',
    type: 'bank',
    bankName: 'BNP Paribas',
    isDefault: false
  }
]

const demoTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2999,
    currency: 'EUR',
    status: 'succeeded',
    description: 'Abonnement Premium - Janvier 2024',
    date: new Date('2024-01-01'),
    paymentMethodId: '1'
  },
  {
    id: '2',
    amount: 999,
    currency: 'EUR',
    status: 'succeeded',
    description: 'Module RH supplémentaire',
    date: new Date('2024-01-15'),
    paymentMethodId: '1'
  },
  {
    id: '3',
    amount: 4999,
    currency: 'EUR',
    status: 'pending',
    description: 'Formation équipe - Février 2024',
    date: new Date('2024-02-01'),
    paymentMethodId: '2'
  },
  {
    id: '4',
    amount: 1999,
    currency: 'EUR',
    status: 'failed',
    description: 'Consultation expert',
    date: new Date('2024-01-20'),
    paymentMethodId: '3'
  }
]

const demoSubscription: Subscription = {
  id: '1',
  planName: 'Premium',
  amount: 2999,
  currency: 'EUR',
  interval: 'month',
  status: 'active',
  currentPeriodStart: new Date('2024-01-01'),
  currentPeriodEnd: new Date('2024-02-01'),
  cancelAtPeriodEnd: false
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentMethods: demoPaymentMethods,
  transactions: demoTransactions,
  subscription: demoSubscription,
  loading: false,
  
  addPaymentMethod: (method) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString()
    }
    
    // Si c'est la première méthode, la définir par défaut
    if (get().paymentMethods.length === 0) {
      newMethod.isDefault = true
    }
    
    set(state => ({
      paymentMethods: [...state.paymentMethods, newMethod]
    }))
  },
  
  removePaymentMethod: (id) => {
    const { paymentMethods } = get()
    const methodToRemove = paymentMethods.find(m => m.id === id)
    
    if (!methodToRemove) return
    
    // Empêcher la suppression si c'est la seule méthode par défaut
    if (methodToRemove.isDefault && paymentMethods.length > 1) {
      // Définir une autre méthode comme par défaut
      const remainingMethods = paymentMethods.filter(m => m.id !== id)
      remainingMethods[0].isDefault = true
      
      set({ paymentMethods: remainingMethods })
    } else if (paymentMethods.length === 1) {
      // Permettre la suppression de la dernière méthode
      set({ paymentMethods: [] })
    } else {
      set(state => ({
        paymentMethods: state.paymentMethods.filter(method => method.id !== id)
      }))
    }
  },
  
  setDefaultPaymentMethod: (id) => {
    set(state => ({
      paymentMethods: state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    }))
  },
  
  processPayment: async (amount, description, paymentMethodId) => {
    set({ loading: true })
    
    try {
      // Vérifier que la méthode de paiement existe
      const { paymentMethods } = get()
      const paymentMethod = paymentMethods.find(m => m.id === paymentMethodId)
      
      if (!paymentMethod) {
        throw new Error('Méthode de paiement non trouvée')
      }
      
      // Simulation d'un paiement avec délai
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simuler un échec occasionnel (10% de chance)
      const shouldFail = Math.random() < 0.1
      
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount,
        currency: 'EUR',
        status: shouldFail ? 'failed' : 'succeeded',
        description,
        date: new Date(),
        paymentMethodId
      }
      
      set(state => ({
        transactions: [transaction, ...state.transactions],
        loading: false
      }))
      
      return !shouldFail
    } catch (error) {
      set({ loading: false })
      return false
    }
  },
  
  createSubscription: async (planName, amount, interval) => {
    set({ loading: true })
    
    try {
      // Simulation de création d'abonnement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const subscription: Subscription = {
        id: Date.now().toString(),
        planName,
        amount,
        currency: 'EUR',
        interval,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
      
      // Ajouter une transaction pour l'abonnement
      const transaction: Transaction = {
        id: (Date.now() + 1).toString(),
        amount,
        currency: 'EUR',
        status: 'succeeded',
        description: `Abonnement ${planName} - ${interval === 'month' ? 'Mensuel' : 'Annuel'}`,
        date: new Date(),
        paymentMethodId: get().paymentMethods.find(m => m.isDefault)?.id || get().paymentMethods[0]?.id || ''
      }
      
      set(state => ({
        subscription,
        transactions: [transaction, ...state.transactions],
        loading: false
      }))
      
      return true
    } catch (error) {
      set({ loading: false })
      return false
    }
  },
  
  cancelSubscription: () => {
    set(state => ({
      subscription: state.subscription ? {
        ...state.subscription,
        cancelAtPeriodEnd: true,
        status: 'canceled'
      } : null
    }))
  },
  
  fetchTransactions: () => {
    return get().transactions
  }
}))
