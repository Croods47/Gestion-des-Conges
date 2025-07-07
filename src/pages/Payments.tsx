import { useState, useEffect } from 'react'
import { usePaymentStore } from '../store/paymentStore'
import { toast } from 'react-toastify'
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiCalendar, 
  FiCheck, 
  FiX, 
  FiPlus,
  FiTrash2,
  FiStar,
  FiShield,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi'

export default function Payments() {
  const {
    paymentMethods,
    transactions,
    subscription,
    isLoading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    processPayment,
    fetchTransactions,
    updateSubscription
  } = usePaymentStore()

  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({
    type: 'card' as const,
    last4: '',
    brand: 'visa',
    expiryMonth: 1,
    expiryYear: 2025,
    isDefault: false
  })
  const [testAmount, setTestAmount] = useState(1000)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleAddCard = () => {
    if (!newCard.last4 || newCard.last4.length !== 4) {
      toast.error('Veuillez saisir les 4 derniers chiffres de la carte')
      return
    }

    addPaymentMethod(newCard)
    toast.success('Méthode de paiement ajoutée avec succès')
    setShowAddCard(false)
    setNewCard({
      type: 'card',
      last4: '',
      brand: 'visa',
      expiryMonth: 1,
      expiryYear: 2025,
      isDefault: false
    })
  }

  const handleRemoveCard = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      removePaymentMethod(id)
      toast.success('Méthode de paiement supprimée')
    }
  }

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id)
    toast.success('Méthode de paiement par défaut mise à jour')
  }

  const handleTestPayment = async () => {
    const defaultMethod = paymentMethods.find(m => m.isDefault)
    if (!defaultMethod) {
      toast.error('Aucune méthode de paiement par défaut')
      return
    }

    const success = await processPayment(testAmount, defaultMethod.id)
    if (success) {
      toast.success('Paiement test réussi !')
    } else {
      toast.error('Échec du paiement test')
    }
  }

  const handleSubscriptionChange = async (plan: 'basic' | 'premium' | 'enterprise') => {
    const success = await updateSubscription(plan)
    if (success) {
      toast.success('Abonnement mis à jour avec succès')
    } else {
      toast.error('Erreur lors de la mise à jour de l\'abonnement')
    }
  }

  const plans = [
    {
      name: 'Basic',
      id: 'basic' as const,
      price: 999,
      features: ['Gestion des congés', 'Historique basique', 'Support email']
    },
    {
      name: 'Premium',
      id: 'premium' as const,
      price: 2999,
      features: ['Toutes les fonctionnalités Basic', 'Rapports avancés', 'Support prioritaire', 'API access']
    },
    {
      name: 'Enterprise',
      id: 'enterprise' as const,
      price: 9999,
      features: ['Toutes les fonctionnalités Premium', 'Support dédié', 'Intégrations personnalisées', 'SLA garanti']
    }
  ]

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2) + ' €'
  }

  const getBrandIcon = () => {
    return <FiCreditCard className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiDollarSign className="h-6 w-6 mr-2" />
          Gestion des paiements
        </h1>
        <p className="text-gray-600">Gérez vos méthodes de paiement et votre abonnement</p>
      </div>

      {/* Subscription Status */}
      {subscription && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiShield className="h-5 w-5 mr-2" />
              Abonnement actuel
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-lg font-semibold capitalize">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prix mensuel</p>
              <p className="text-lg font-semibold">{formatPrice(subscription.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prochaine facturation</p>
              <p className="text-lg font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiTrendingUp className="h-5 w-5 mr-2" />
          Plans d'abonnement
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className={`border rounded-lg p-4 ${
              subscription?.plan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(plan.price)}</p>
                <p className="text-sm text-gray-600">par mois</p>
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {subscription?.plan !== plan.id && (
                <button
                  onClick={() => handleSubscriptionChange(plan.id)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Mise à jour...' : 'Choisir ce plan'}
                </button>
              )}
              
              {subscription?.plan === plan.id && (
                <div className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-center font-medium">
                  Plan actuel
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiCreditCard className="h-5 w-5 mr-2" />
            Méthodes de paiement
          </h2>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Ajouter une carte
          </button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                {getBrandIcon()}
                <div className="ml-3">
                  <p className="font-medium">
                    {method.brand?.toUpperCase()} •••• {method.last4}
                    {method.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <FiStar className="h-3 w-3 mr-1" />
                        Par défaut
                      </span>
                    )}
                  </p>
                  {method.expiryMonth && method.expiryYear && (
                    <p className="text-sm text-gray-600">
                      Expire {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Définir par défaut
                  </button>
                )}
                <button
                  onClick={() => handleRemoveCard(method.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddCard && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Ajouter une nouvelle carte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4 derniers chiffres
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={newCard.last4}
                  onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de carte
                </label>
                <select
                  value={newCard.brand}
                  onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mois d'expiration
                </label>
                <select
                  value={newCard.expiryMonth}
                  onChange={(e) => setNewCard({ ...newCard, expiryMonth: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année d'expiration
                </label>
                <select
                  value={newCard.expiryYear}
                  onChange={(e) => setNewCard({ ...newCard, expiryYear: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="setDefault"
                checked={newCard.isDefault}
                onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                Définir comme méthode par défaut
              </label>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Test Payment */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test de paiement</h2>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (centimes)
            </label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(parseInt(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <div className="pt-6">
            <button
              onClick={handleTestPayment}
              disabled={isLoading || paymentMethods.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Traitement...' : `Tester paiement ${formatPrice(testAmount)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiCalendar className="h-5 w-5 mr-2" />
          Historique des transactions
        </h2>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune transaction</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(transaction.amount)}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status === 'succeeded' ? (
                      <>
                        <FiCheck className="h-3 w-3 mr-1" />
                        Réussi
                      </>
                    ) : transaction.status === 'pending' ? (
                      <>
                        <FiClock className="h-3 w-3 mr-1" />
                        En attente
                      </>
                    ) : (
                      <>
                        <FiX className="h-3 w-3 mr-1" />
                        Échoué
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
