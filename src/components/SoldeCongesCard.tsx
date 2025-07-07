import { SoldeConges } from '../stores/congesStore'

type SoldeCongesCardProps = {
  solde: SoldeConges
}

const SoldeCongesCard = ({ solde }: SoldeCongesCardProps) => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900">Mon solde de congés</h3>
      
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
          <h4 className="text-sm font-medium text-primary-800">Congés payés</h4>
          <p className="mt-2 text-3xl font-bold text-primary-600">{solde.congesPayes}</p>
          <p className="mt-1 text-sm text-primary-700">jours disponibles</p>
        </div>
        
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-100">
          <h4 className="text-sm font-medium text-secondary-800">RTT</h4>
          <p className="mt-2 text-3xl font-bold text-secondary-600">{solde.rtt}</p>
          <p className="mt-1 text-sm text-secondary-700">jours disponibles</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h4 className="text-sm font-medium text-green-800">Congés d'ancienneté</h4>
          <p className="mt-2 text-3xl font-bold text-green-600">{solde.anciennete}</p>
          <p className="mt-1 text-sm text-green-700">jours disponibles</p>
        </div>
      </div>
      
      <div className="mt-5 text-sm text-gray-500">
        <p>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  )
}

export default SoldeCongesCard
