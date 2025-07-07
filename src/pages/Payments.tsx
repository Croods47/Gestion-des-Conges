import { useState } from 'react'
import { usePaymentStore } from '../stores/paymentStore'
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
  FiAlertCircle,
  FiSettings
} from 'react-icons/fi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Payments() {
  const { 
    paymentMethods, 
    transactions, 
    subscription, 
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    processPayment,
    createSubscription,
    cancelSubscription
  } = usePaymentStore()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'transactions' | 'subscription'>('overview')
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [showOneTimePayment, setShowOneTimePayment] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  
  const [newMethodData, setNewMethodData] = useState({
    type: 'card' as 'card' | 'bank',
    last4: '',
    brand: '',
    bankName: ''
  })
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    paymentMethodId: ''
  })
  
  const [subscriptionData, setSubscriptionData] = useState({
    planName: 'Premium',
    amount: '2999',
    interval: 'month' as 'month' | 'year'
  })
  
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation des données
      if (newMethodData.type === 'card') {
        if (!newMethodData.brand || !newMethodData.last4) {
          toast.error('Veuillez remplir tous les champs de la carte')
          return
        }
        if (newMethodData.last4.length !== 4) {
          toast.error('Les 4 derniers chiffres doivent contenir exactement 4 caractères')
          return
        }
      } else {
        if (!newMethodData.bankName) {
          toast.error('Veuillez saisir le nom de la banque')
          return
        }
      }
      
      addPaymentMethod({
        type: newMethodData.type,
        last4: newMethodData.last4,
        brand: newMethodData.brand,
        bankName: newMethodData.bankName,
        isDefault: paymentMethods.length === 0
      })
      
      toast.success('Méthode de paiement ajoutée avec succès')
      setShowAddMethod(false)
      setNewMethodData({ type: 'card', last4: '', brand: '', bankName: '' })
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la méthode de paiement')
    }
  }
  
  const handleRemovePaymentMethod = (id: string) => {
    if (paymentMethods.length === 1) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer votre dernière méthode de paiement ?')) {
        return
      }
    }
    
    removePaymentMethod(id)
    toast.success('Méthode de paiement supprimée')
  }
  
  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id)
    toast.success('Méthode de paiement définie par défaut')
  }
  
  const handleOneTimePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!paymentData.paymentMethodId) {
        toast.error('Veuillez sélectionner une méthode de paiement')
        return
      }
      
      const amount = parseFloat(paymentData.amount)
      if (amount <= 0) {
        toast.error('Le montant doit être supérieur à 0')
        return
      }
      
      const success = await processPayment(
        Math.round(amount * 100), // Convertir en centimes
        paymentData.description,
        paymentData.paymentMethodId
      )
      
      if (success) {
        toast.success('Paiement effectué avec succès')
        setShowOneTimePayment(false)
        setPaymentData({ amount: '', description: '', paymentMethodId: '' })
      } else {
        toast.error('Le paiement a échoué. Veuillez réessayer.')
      }
    } catch (error) {
      toast.error('Erreur lors du paiement')
    }
  }
  
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (subscription) {
        toast.error('Vous avez déjà un abonnement actif')
        return
      }
      
      if (paymentMethods.length === 0) {
        toast.error('Veuillez ajouter une méthode de paiement avant de créer un abonnement')
        return
      }
      
      const success = await createSubscription(
        subscriptionData.planName,
        parseInt(subscriptionData.amount),
        subscriptionData.interval
      )
      
      if (success) {
        toast.success('Abonnement créé avec succès')
        setShowSubscriptionForm(false)
      } else {
        toast.error('Erreur lors de la création de l\'abonnement')
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'abonnement')
    }
  }
  
  const handleCancelSubscription = () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      return
    }
    
    cancelSubscription()
    toast.success('Abonnement programmé pour annulation à la fin de la période')
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheck className="mr-1 h-3 w-3" />
            Réussi
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            En cours
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiX className="mr-1 h-3 w-3" />
            Échoué
          </span>
        )
      default:
        return null
    }
  }
  
  const getPaymentMethodDisplay = (method: any) => {
    if (method.type === 'card') {
      return `${method.brand} •••• ${method.last4}`
    } else {
      return method.bankName
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-600">
          Gérez vos méthodes de paiement, abonnements et transactions
        </p>
      </div>
      
      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vue d\'ensemble', icon: FiDollarSign },
            { id: 'methods', name: 'Méthodes de paiement', icon: FiCreditCard },
            { id: 'transactions', name: 'Transactions', icon: FiCalendar },
            { id: 'subscription', name: 'Abonnement', icon: FiStar }
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
      
      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total dépensé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(transactions.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0) / 100).toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiCalendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiCreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Méthodes</p>
                  <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FiStar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Abonnement</p>
                  <p className="text-lg font-bold text-gray-900">
                    {subscription ? subscription.planName : 'Aucun'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowAddMethod(true)}
                className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiCreditCard className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Ajouter une méthode</p>
                  <p className="text-sm text-gray-500">Carte ou compte bancaire</p>
                </div>
              </button>
              
              <button
                onClick={() => setShowOneTimePayment(true)}
                disabled={paymentMethods.length === 0}
                className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDollarSign className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Paiement unique</p>
                  <p className="text-sm text-gray-500">Effectuer un paiement ponctuel</p>
                </div>
              </button>
              
              {!subscription && (
                <button
                  onClick={() => setShowSubscriptionForm(true)}
                  disabled={paymentMethods.length === 0}
                  className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiStar className="h-6 w-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">S'abonner</p>
                    <p className="text-sm text-gray-500">Créer un abonnement récurrent</p>
                  </div>
                </button>
              )}
            </div>
            
            {paymentMethods.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Ajoutez une méthode de paiement pour effectuer des transactions et créer des abonnements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Méthodes de paiement */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Méthodes de paiement</h2>
            <button
              onClick={() => setShowAddMethod(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Ajouter
            </button>
          </div>
          
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune méthode de paiement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ajoutez une carte bancaire ou un compte pour effectuer des paiements.
              </p>
              <button
                onClick={() => setShowAddMethod(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Ajouter une méthode
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <FiCreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getPaymentMethodDisplay(method)}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {method.type === 'card' ? 'Carte bancaire' : 'Compte bancaire'}
                        </p>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Par défaut
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Définir par défaut"
                        >
                          <FiSettings className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Historique des transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vos transactions apparaîtront ici.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const paymentMethod = paymentMethods.find(m => m.id === transaction.paymentMethodId)
                return (
                  <li key={transaction.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>
                            {format(new Date(transaction.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </span>
                          {paymentMethod && (
                            <span>
                              {getPaymentMethodDisplay(paymentMethod)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.status === 'succeeded' ? 'text-green-600' :
                          transaction.status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {(transaction.amount / 100).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
      
      {/* Abonnement */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {subscription ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Abonnement actuel</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : subscription.status === 'canceled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.status === 'active' ? 'Actif' : 
                   subscription.status === 'canceled' ? 'Annulé' : 'En attente'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="text-lg font-medium text-gray-900">{subscription.planName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="text-lg font-medium text-gray-900">
                    {(subscription.amount / 100).toFixed(2)}€/{subscription.interval === 'month' ? 'mois' : 'an'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Période actuelle</p>
                  <p className="text-sm text-gray-900">
                    Du {format(new Date(subscription.currentPeriodStart), 'dd MMM yyyy', { locale: fr })} au {format(new Date(subscription.currentPeriodEnd), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <p className="text-sm text-gray-900">
                    {subscription.cancelAtPeriodEnd 
                      ? 'Sera annulé à la fin de la période'
                      : 'Renouvellement automatique'
                    }
                  </p>
                </div>
              </div>
              
              {subscription.cancelAtPeriodEnd && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Votre abonnement sera annulé le {format(new Date(subscription.currentPeriodEnd), 'dd MMM yyyy', { locale: fr })}.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3 mt-6">
                {!subscription.cancelAtPeriodEnd && subscription.status === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    Annuler l'abonnement
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FiStar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun abonnement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Créez un abonnement pour accéder aux fonctionnalités premium.
              </p>
              {paymentMethods.length > 0 ? (
                <button
                  onClick={() => setShowSubscriptionForm(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Créer un abonnement
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Ajoutez d'abord une méthode de paiement
                  </p>
                  <button
                    onClick={() => setActiveTab('methods')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Gérer les méthodes de paiement
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Modal - Ajouter méthode de paiement */}
      {showAddMethod && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ajouter une méthode de paiement
            </h3>
            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newMethodData.type}
                  onChange={(e) => setNewMethodData({ ...newMethodData, type: e.target.value as 'card' | 'bank' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Carte bancaire</option>
                  <option value="bank">Compte bancaire</option>
                </select>
              </div>
              
              {newMethodData.type === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <select
                      value={newMethodData.brand}
                      onChange={(e) => setNewMethodData({ ...newMethodData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner une marque</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="American Express">American Express</option>
                      <option value="Carte Bleue">Carte Bleue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      4 derniers chiffres
                    </label>
                    <input
                      type="text"
                      value={newMethodData.last4}
                      onChange={(e) => setNewMethodData({ ...newMethodData, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la banque
                  </label>
                  <select
                    value={newMethodData.bankName}
                    onChange={(e) => setNewMethodData({ ...newMethodData, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner une banque</option>
                    <option value="BNP Paribas">BNP Paribas</option>
                    <option value="Crédit Agricole">Crédit Agricole</option>
                    <option value="Société Générale">Société Générale</option>
                    <option value="LCL">LCL</option>
                    <option value="Crédit Mutuel">Crédit Mutuel</option>
                    <option value="Banque Populaire">Banque Populaire</option>
                    <option value="Caisse d'Épargne">Caisse d'Épargne</option>
                    <option value="La Banque Postale">La Banque Postale</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMethod(false)
                    setNewMethodData({ type: 'card', last4: '', brand: '', bankName: '' })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal - Paiement unique */}
      {showOneTimePayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Paiement unique
            </h3>
            <form onSubmit={handleOneTimePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="29.99"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={paymentData.description}
                  onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Module supplémentaire, formation..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement
                </label>
                <select
                  value={paymentData.paymentMethodId}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethodId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une méthode</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {getPaymentMethodDisplay(method)}
                      {method.isDefault && ' (Par défaut)'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOneTimePayment(false)
                    setPaymentData({ amount: '', description: '', paymentMethodId: '' })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : 'Payer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal - Créer abonnement */}
      {showSubscriptionForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Créer un abonnement
            </h3>
            <form onSubmit={handleCreateSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={subscriptionData.planName}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, planName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={(parseInt(subscriptionData.amount) / 100).toString()}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, amount: (parseFloat(e.target.value) * 100).toString() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="29.99"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fréquence
                </label>
                <select
                  value={subscriptionData.interval}
                  onChange={(e) => setSubscriptionData({ ...subscriptionData, interval: e.target.value as 'month' | 'year' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">Mensuel</option>
                  <option value="year">Annuel</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubscriptionForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
