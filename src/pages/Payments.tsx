import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { usePaymentStore } from '../stores/paymentStore'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2,
  FiStar,
  FiRefreshCw
} from 'react-icons/fi'

const Payments = () => {
  const { user } = useAuthStore()
  const {
    payments,
    paymentMethods,
    plans,
    isLoading,
    fetchPayments,
    fetchPaymentMethods,
    fetchPlans,
    createOneTimePayment,
    createSubscription,
    cancelSubscription,
    removePaymentMethod
  } = usePaymentStore()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'methods' | 'history'>('overview')
  const [showOneTimePayment, setShowOneTimePayment] = useState(false)
  const [oneTimeAmount, setOneTimeAmount] = useState('')
  const [oneTimeDescription, setOneTimeDescription] = useState('')
  
  useEffect(() => {
    if (user) {
      fetchPayments(user.id)
      fetchPaymentMethods(user.id)
      fetchPlans()
    }
  }, [user, fetchPayments, fetchPaymentMethods, fetchPlans])
  
  const activeSubscription = payments.find(p => p.type === 'recurring' && p.status === 'completed')
  const currentPlan = activeSubscription ? plans.find(p => p.id === activeSubscription.planId) : null
  
  const handleOneTimePayment = async () => {
    if (!user || !oneTimeAmount || !oneTimeDescription) return
    
    try {
      await createOneTimePayment(user.id, parseFloat(oneTimeAmount), oneTimeDescription)
      toast.success('Paiement effectué avec succès')
      setShowOneTimePayment(false)
      setOneTimeAmount('')
      setOneTimeDescription('')
    } catch (error) {
      toast.error('Erreur lors du paiement')
    }
  }
  
  const handleSubscribe = async (planId: string) => {
    if (!user) return
    
    try {
      await createSubscription(user.id, planId)
      toast.success('Abonnement créé avec succès')
    } catch (error) {
      toast.error('Erreur lors de la création de l\'abonnement')
    }
  }
  
  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return
    
    try {
      await cancelSubscription(subscriptionId)
      toast.success('Abonnement annulé')
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'pending':
        return 'En attente'
      case 'failed':
        return 'Échoué'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos abonnements et paiements
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vue d\'ensemble', icon: FiDollarSign },
            { id: 'plans', name: 'Plans', icon: FiStar },
            { id: 'methods', name: 'Moyens de paiement', icon: FiCreditCard },
            { id: 'history', name: 'Historique', icon: FiCalendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Subscription */}
          {currentPlan ? (
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    Plan {currentPlan.name}
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {currentPlan.price}€/{currentPlan.interval === 'monthly' ? 'mois' : 'an'}
                  </p>
                  {activeSubscription?.nextPaymentDate && (
                    <p className="text-xs text-blue-600 mt-2">
                      Prochain paiement: {format(parseISO(activeSubscription.nextPaymentDate), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {activeSubscription?.stripeSubscriptionId && (
                    <button
                      onClick={() => handleCancelSubscription(activeSubscription.stripeSubscriptionId!)}
                      className="btn-danger"
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <FiStar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun abonnement actif</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choisissez un plan pour commencer
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('plans')}
                  className="btn-primary"
                >
                  Voir les plans
                </button>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Paiement ponctuel</h3>
              <p className="text-sm text-gray-500 mb-4">
                Effectuez un paiement unique pour des services supplémentaires
              </p>
              <button
                onClick={() => setShowOneTimePayment(true)}
                className="btn-primary w-full"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Nouveau paiement
              </button>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Moyens de paiement</h3>
              <p className="text-sm text-gray-500 mb-4">
                {paymentMethods.length} moyen{paymentMethods.length > 1 ? 's' : ''} de paiement configuré{paymentMethods.length > 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setActiveTab('methods')}
                className="btn-secondary w-full"
              >
                <FiCreditCard className="mr-2 h-4 w-4" />
                Gérer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                    Populaire
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-sm text-gray-500">/{plan.interval === 'monthly' ? 'mois' : 'an'}</span>
                </div>
              </div>
              
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || currentPlan?.id === plan.id}
                  className={`w-full ${
                    currentPlan?.id === plan.id
                      ? 'btn-secondary cursor-not-allowed'
                      : plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {currentPlan?.id === plan.id ? 'Plan actuel' : 'Choisir ce plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Moyens de paiement</h2>
            <button className="btn-primary">
              <FiPlus className="mr-2 h-4 w-4" />
              Ajouter une carte
            </button>
          </div>
          
          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiCreditCard className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          •••• •••• •••• {method.last4}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method.brand.toUpperCase()} • Expire {method.expiryMonth}/{method.expiryYear}
                        </p>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Par défaut
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removePaymentMethod(method.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun moyen de paiement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ajoutez une carte pour effectuer des paiements
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Historique des paiements</h2>
          
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${
                        payment.type === 'recurring' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {payment.type === 'recurring' ? (
                          <FiRefreshCw className={`h-5 w-5 ${
                            payment.type === 'recurring' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        ) : (
                          <FiDollarSign className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(payment.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                        {payment.nextPaymentDate && payment.status === 'completed' && (
                          <p className="text-xs text-blue-600">
                            Prochain: {format(parseISO(payment.nextPaymentDate), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {payment.amount}€
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vos paiements apparaîtront ici
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* One-time Payment Modal */}
      {showOneTimePayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Paiement ponctuel
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="label">
                    Montant (€)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    className="input"
                    placeholder="0.00"
                    value={oneTimeAmount}
                    onChange={(e) => setOneTimeAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    className="input"
                    placeholder="Formation, consultation..."
                    value={oneTimeDescription}
                    onChange={(e) => setOneTimeDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowOneTimePayment(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handleOneTimePayment}
                  disabled={isLoading || !oneTimeAmount || !oneTimeDescription}
                  className="btn-primary"
                >
                  {isLoading ? 'Traitement...' : 'Payer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments
