import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiCalendar, 
  FiCheck, 
  FiPlus,
  FiTrash2,
  FiStar
} from 'react-icons/fi'
import { toast } from 'react-toastify'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  date: string
  paymentMethod: string
}

interface Subscription {
  id: string
  plan: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  currency: string
}

const Payments = () => {
  const { user } = useAuthStore()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [oneTimeAmount, setOneTimeAmount] = useState('')
  const [oneTimeDescription, setOneTimeDescription] = useState('')
  
  useEffect(() => {
    if (user) {
      fetchPayments()
      fetchPaymentMethods()
    }
  }, [user])
  
  const fetchPayments = () => {
    // Mock data
    setTransactions([
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
    ])
  }
  
  const fetchPaymentMethods = () => {
    // Mock data
    setPaymentMethods([
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ])
    
    setSubscription({
      id: '1',
      plan: 'premium',
      status: 'active',
      currentPeriodStart: '2024-01-01T00:00:00Z',
      currentPeriodEnd: '2024-02-01T00:00:00Z',
      amount: 2999,
      currency: 'eur'
    })
  }
  
  const createOneTimePayment = async (amount: number, description: string) => {
    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: Math.round(amount * 100),
        currency: 'eur',
        status: 'succeeded',
        description,
        date: new Date().toISOString(),
        paymentMethod: 'Visa •••• 4242'
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      toast.success('Paiement effectué avec succès')
      setOneTimeAmount('')
      setOneTimeDescription('')
    } catch (error) {
      toast.error('Erreur lors du paiement')
    } finally {
      setIsLoading(false)
    }
  }
  
  const createSubscription = async (planId: string) => {
    setIsLoading(true)
    try {
      // Simulate subscription creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const plans = {
        basic: { amount: 999, name: 'Basic' },
        premium: { amount: 2999, name: 'Premium' },
        enterprise: { amount: 9999, name: 'Enterprise' }
      }
      
      const plan = plans[planId as keyof typeof plans]
      
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        plan: planId as 'basic' | 'premium' | 'enterprise',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: plan.amount,
        currency: 'eur'
      }
      
      setSubscription(newSubscription)
      toast.success(`Abonnement ${plan.name} activé avec succès`)
    } catch (error) {
      toast.error('Erreur lors de la création de l\'abonnement')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleOneTimePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oneTimeAmount || !oneTimeDescription) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    
    await createOneTimePayment(parseFloat(oneTimeAmount), oneTimeDescription)
  }
  
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }
  
  const getPlanName = (plan: string) => {
    const names = {
      basic: 'Basic',
      premium: 'Premium',
      enterprise: 'Enterprise'
    }
    return names[plan as keyof typeof names] || plan
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements et Facturation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos abonnements, moyens de paiement et consultez votre historique.
        </p>
      </div>
      
      {/* Abonnement actuel */}
      {subscription && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Abonnement actuel
            </h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Plan {getPlanName(subscription.plan)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatAmount(subscription.amount, subscription.currency)} / mois
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status === 'active' ? 'Actif' : subscription.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                <p>Période actuelle : {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Plans d'abonnement */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Plans d'abonnement
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { id: 'basic', name: 'Basic', price: 999, features: ['10 employés', 'Support email'] },
              { id: 'premium', name: 'Premium', price: 2999, features: ['50 employés', 'Support prioritaire', 'Rapports avancés'] },
              { id: 'enterprise', name: 'Enterprise', price: 9999, features: ['Employés illimités', 'Support dédié', 'API personnalisée'] }
            ].map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                  {subscription?.plan === plan.id && (
                    <FiStar className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatAmount(plan.price, 'eur')}
                  <span className="text-base font-normal text-gray-500">/mois</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {subscription?.plan !== plan.id && (
                  <button
                    onClick={() => createSubscription(plan.id)}
                    disabled={isLoading}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Choisir ce plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Paiement ponctuel */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Paiement ponctuel
          </h3>
          <form onSubmit={handleOneTimePayment} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Montant (€)
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="1"
                    value={oneTimeAmount}
                    onChange={(e) => setOneTimeAmount(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  <FiDollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={oneTimeDescription}
                  onChange={(e) => setOneTimeDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Formation, service supplémentaire..."
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <FiCreditCard className="h-4 w-4 mr-2" />
              {isLoading ? 'Traitement...' : 'Effectuer le paiement'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Moyens de paiement */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Moyens de paiement
            </h3>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FiPlus className="h-4 w-4 mr-2" />
              Ajouter
            </button>
          </div>
          
          <div className="mt-5 space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <FiCreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </p>
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-sm text-gray-500">
                        Expire {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                  {method.isDefault && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Par défaut
                    </span>
                  )}
                </div>
                <button className="text-red-600 hover:text-red-800">
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Historique des transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Historique des transactions
          </h3>
          
          <div className="mt-5">
            {transactions.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <li key={transaction.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FiCalendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.date)} • {transaction.paymentMethod}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'succeeded' ? 'Réussi' : transaction.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatAmount(transaction.amount, transaction.currency)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune transaction pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments
