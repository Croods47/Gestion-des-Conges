import { useAuthStore } from '../stores/authStore'
import { useLeaveStore } from '../stores/leaveStore'
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiUsers,
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi'
import { format, startOfYear, endOfYear } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { leaves } = useLeaveStore()

  // Filtrer les congés de l'utilisateur actuel pour l'année en cours
  const currentYear = new Date().getFullYear()
  const yearStart = startOfYear(new Date())
  const yearEnd = endOfYear(new Date())
  
  const userLeaves = leaves.filter(leave => 
    leave.employeeId === user?.id &&
    new Date(leave.startDate) >= yearStart &&
    new Date(leave.startDate) <= yearEnd
  )

  const allLeaves = user?.role === 'admin' || user?.role === 'manager' 
    ? leaves.filter(leave => 
        new Date(leave.startDate) >= yearStart &&
        new Date(leave.startDate) <= yearEnd
      )
    : userLeaves

  // Calculs des statistiques
  const totalDaysUsed = userLeaves
    .filter(leave => leave.status === 'approved')
    .reduce((sum, leave) => sum + leave.duration, 0)

  const pendingRequests = userLeaves.filter(leave => leave.status === 'pending').length
  const approvedRequests = userLeaves.filter(leave => leave.status === 'approved').length
  const rejectedRequests = userLeaves.filter(leave => leave.status === 'rejected').length

  const remainingDays = (user?.annualLeave || 25) - totalDaysUsed

  // Données pour les graphiques
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthLeaves = allLeaves.filter(leave => {
      const leaveDate = new Date(leave.startDate)
      return leaveDate.getMonth() + 1 === month && leave.status === 'approved'
    })
    
    return {
      month: format(new Date(currentYear, i, 1), 'MMM', { locale: fr }),
      jours: monthLeaves.reduce((sum, leave) => sum + leave.duration, 0)
    }
  })

  const statusData = [
    { name: 'Approuvés', value: approvedRequests, color: '#10B981' },
    { name: 'En attente', value: pendingRequests, color: '#F59E0B' },
    { name: 'Refusés', value: rejectedRequests, color: '#EF4444' }
  ]

  const recentLeaves = allLeaves
    .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour {user?.prenom} !
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de vos congés pour {currentYear}
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours utilisés</p>
              <p className="text-2xl font-bold text-gray-900">{totalDaysUsed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jours restants</p>
              <p className="text-2xl font-bold text-gray-900">{remainingDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total demandes</p>
              <p className="text-2xl font-bold text-gray-900">{userLeaves.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {remainingDays < 5 && remainingDays > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Attention : Il ne vous reste que {remainingDays} jour{remainingDays > 1 ? 's' : ''} de congés pour cette année.
            </p>
          </div>
        </div>
      )}

      {remainingDays <= 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <FiXCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">
              Vous avez épuisé votre quota de congés pour cette année.
            </p>
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique mensuel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Congés par mois ({currentYear})
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jours" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique des statuts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Répartition des demandes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demandes récentes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {user?.role === 'admin' || user?.role === 'manager' ? 'Demandes récentes (équipe)' : 'Mes demandes récentes'}
          </h3>
        </div>
        {recentLeaves.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentLeaves.map((leave) => (
              <li key={leave.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {leave.type} - {leave.duration} jour{leave.duration > 1 ? 's' : ''}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.status === 'approved' ? 'Approuvé' :
                         leave.status === 'pending' ? 'En attente' : 'Refusé'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>
                        Du {format(new Date(leave.startDate), 'dd MMM yyyy', { locale: fr })} au {format(new Date(leave.endDate), 'dd MMM yyyy', { locale: fr })}
                      </span>
                      {(user?.role === 'admin' || user?.role === 'manager') && leave.employeeId !== user?.id && (
                        <span className="ml-2 text-gray-400">
                          • Employé ID: {leave.employeeId}
                        </span>
                      )}
                    </div>
                    {leave.reason && (
                      <p className="mt-1 text-sm text-gray-600">{leave.reason}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune demande de congé pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
