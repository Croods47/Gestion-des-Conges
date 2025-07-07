import { useCongesStore } from '../stores/congesStore'
import { FiCalendar, FiClock, FiHeart, FiUser } from 'react-icons/fi'

export default function SoldeCongesCard() {
  const { solde } = useCongesStore()

  const congesData = [
    {
      type: 'Congés payés',
      solde: solde.congesPayes,
      icon: FiCalendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      type: 'RTT',
      solde: solde.rtt,
      icon: FiClock,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      type: 'Congé maladie',
      solde: solde.congesMaladie,
      icon: FiHeart,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      type: 'Congé maternité',
      solde: solde.congesMaternite,
      icon: FiUser,
      color: 'text-pink-600',
      bg: 'bg-pink-100'
    },
    {
      type: 'Congé paternité',
      solde: solde.congesPaternite,
      icon: FiUser,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Solde des congés</h2>
      <div className="space-y-4">
        {congesData.map((conge) => {
          const Icon = conge.icon
          return (
            <div key={conge.type} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${conge.bg}`}>
                  <Icon className={`h-5 w-5 ${conge.color}`} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {conge.type}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {conge.solde} jour{conge.solde > 1 ? 's' : ''}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Ancienneté : {solde.anciennete} an{solde.anciennete > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
