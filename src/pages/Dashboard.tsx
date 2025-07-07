import { useAuthStore } from '../stores/authStore'
import { useCongeStore } from '../stores/congeStore'
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiPlus } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { demandes, getDemandesParEmploye, getToutesLesDemandes } = useCongeStore()

  const mesDemandesData = user ? getDemandesParEmploye(user.id) : []
  const toutesDemandesData = getToutesLesDemandes()

  const stats = {
    soldeConges: user?.soldeConges || 0,
    demandesEnAttente: mesDemandesData.filter(d => d.statut === 'en_attente').length,
    demandesApprouvees: mesDemandesData.filter(d => d.statut === 'approuve').length,
    demandesRefusees: mesDemandesData.filter(d => d.statut === 'refuse').length,
  }

  const adminStats = {
    totalDemandes: toutesDemandesData.length,
    enAttente: toutesDemandesData.filter(d => d.statut === 'en_attente').length,
    approuvees: toutesDemandesData.filter(d => d.statut === 'approuve').length,
    refusees: toutesDemandesData.filter(d => d.statut === 'refuse').length,
  }

  const chartData = [
    { name: 'En attente', value: stats.demandesEnAttente, color: '#f59e0b' },
    { name: 'Approuvées', value: stats.demandesApprouvees, color: '#10b981' },
    { name: 'Refusées', value: stats.demandesRefusees, color: '#ef4444' },
  ]

  const monthlyData = [
    { month: 'Jan', demandes: 12 },
    { month: 'Fév', demandes: 19 },
    { month: 'Mar', demandes: 15 },
    { month: 'Avr', demandes: 25 },
    { month: 'Mai', demandes: 22 },
    { month: 'Jun', demandes: 30 },
  ]

  const COLORS = ['#f59e0b', '#10b981', '#ef4444']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.prenom} {user?.nom}
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Solde congés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.soldeConges} jours
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En attente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.demandesEnAttente}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approuvées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.demandesApprouvees}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiXCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Refusées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.demandesRefusees}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vue d'ensemble - Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-purple-100 truncate">
                        Total demandes
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {adminStats.totalDemandes}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiClock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-yellow-100 truncate">
                        En attente
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {adminStats.enAttente}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiCheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-100 truncate">
                        Approuvées
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {adminStats.approuvees}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiXCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-red-100 truncate">
                        Refusées
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {adminStats.refusees}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition de mes demandes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution mensuelle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demandes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Demandes récentes</h3>
            <Link
              to="/historique"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Voir tout
            </Link>
          </div>
        </div>
        <div className="px-6 py-4">
          {mesDemandesData.length > 0 ? (
            <div className="space-y-4">
              {mesDemandesData.slice(0, 3).map((demande) => (
                <div key={demande.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {demande.dateDebut} - {demande.dateFin}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        demande.statut === 'approuve' 
                          ? 'bg-green-100 text-green-800'
                          : demande.statut === 'refuse'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {demande.statut === 'approuve' ? 'Approuvée' : 
                         demande.statut === 'refuse' ? 'Refusée' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{demande.motif}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {demande.nbJours} jour{demande.nbJours > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore fait de demande de congé.
              </p>
              <div className="mt-6">
                <Link
                  to="/demande"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Créer une demande
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/demande"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FiPlus className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Nouvelle demande</h4>
              <p className="text-sm text-gray-500">Créer une demande de congé</p>
            </div>
          </Link>

          <Link
            to="/historique"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FiClock className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Historique</h4>
              <p className="text-sm text-gray-500">Voir toutes mes demandes</p>
            </div>
          </Link>

          <Link
            to="/infos"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <FiCalendar className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Informations</h4>
              <p className="text-sm text-gray-500">Consulter les règles</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
