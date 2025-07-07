import { useAuthStore } from '../stores/authStore'
import { useCongesStore } from '../stores/congesStore'
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiTrendingUp
} from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { demandes, solde } = useCongesStore()

  const userDemandes = demandes.filter(d => d.utilisateurId === user?.id)
  const pendingRequests = userDemandes.filter(d => d.statut === 'en_attente')
  const approvedRequests = userDemandes.filter(d => d.statut === 'approuve')
  const rejectedRequests = userDemandes.filter(d => d.statut === 'refuse')

  const chartData = [
    { name: 'Congés payés', jours: solde.congesPayes },
    { name: 'RTT', jours: solde.rtt },
    { name: 'Maladie', jours: solde.congesMaladie },
    { name: 'Maternité', jours: solde.congesMaternite },
  ]

  const stats = [
    {
      name: 'Demandes en attente',
      value: pendingRequests.length,
      icon: FiClock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      name: 'Demandes approuvées',
      value: approvedRequests.length,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'Demandes refusées',
      value: rejectedRequests.length,
      icon: FiXCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      name: 'Congés restants',
      value: solde.congesPayes,
      icon: FiCalendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour {user?.prenom} !
        </h1>
        <p className="text-gray-600">Voici un aperçu de vos congés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FiTrendingUp className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Solde des congés</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jours" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Demandes récentes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userDemandes.slice(0, 3).map((demande) => (
            <div key={demande.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {demande.typeConge}
                  </p>
                  <p className="text-sm text-gray-500">
                    Du {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} au {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  demande.statut === 'approuve' ? 'bg-green-100 text-green-800' :
                  demande.statut === 'refuse' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {demande.statut === 'approuve' ? 'Approuvée' :
                   demande.statut === 'refuse' ? 'Refusée' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
