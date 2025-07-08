import { useAuthStore } from '../stores/authStore'
import { useCongeStore } from '../stores/congeStore'
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiUsers } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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
                