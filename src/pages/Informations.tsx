import { FiBook, FiClock, FiCalendar, FiInfo, FiAlertCircle } from 'react-icons/fi'

const Informations = () => {
  const congesInfo = [
    {
      title: 'Congés payés',
      description: 'Droit légal de 25 jours ouvrables par an (5 semaines)',
      details: [
        'Acquisition: 2,5 jours par mois travaillé',
        'Période de référence: du 1er juin au 31 mai',
        'Prise des congés: du 1er mai au 31 octobre (période légale)',
        'Report possible sous conditions'
      ],
      icon: FiCalendar,
      color: 'blue'
    },
    {
      title: 'RTT (Réduction du Temps de Travail)',
      description: 'Jours de repos compensateurs pour les 35h',
      details: [
        'Calculés selon la convention collective',
        'Généralement entre 10 et 25 jours par an',
        'Peuvent être imposés par l\'employeur',
        'Pas de report automatique'
      ],
      icon: FiClock,
      color: 'green'
    },
    {
      title: 'Congés exceptionnels',
      description: 'Congés pour événements familiaux',
      details: [
        'Mariage: 4 jours',
        'Naissance/adoption: 3 jours',
        'Décès conjoint/enfant: 2-3 jours',
        'Déménagement: 1 jour (selon convention)'
      ],
      icon: FiInfo,
      color: 'purple'
    },
    {
      title: 'Congé maladie',
      description: 'Arrêt de travail pour raisons médicales',
      details: [
        'Certificat médical obligatoire',
        'Délai de carence possible',
        'Indemnisation par la Sécurité Sociale',
        'Complément employeur selon convention'
      ],
      icon: FiAlertCircle,
      color: 'red'
    }
  ]
  
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Informations légales</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tout ce que vous devez savoir sur vos droits aux congés
        </p>
      </div>
      
      {/* Important notice */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex">
          <FiBook className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Information importante
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Ces informations sont données à titre indicatif et peuvent varier selon votre convention collective.
                Consultez votre service RH pour des informations spécifiques à votre situation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Types de congés */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {congesInfo.map((conge, index) => (
          <div key={index} className="card">
            <div className="flex items-start">
              <div className={`flex-shrink-0 p-3 rounded-lg ${getColorClasses(conge.color)}`}>
                <conge.icon className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {conge.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {conge.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {conge.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></span>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Procédure de demande */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Procédure de demande de congé
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Planification</h3>
              <p className="text-sm text-gray-600">
                Vérifiez votre solde de congés et planifiez vos dates en tenant compte des contraintes de service.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Demande</h3>
              <p className="text-sm text-gray-600">
                Soumettez votre demande via l'application en précisant les dates et le motif.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Validation</h3>
              <p className="text-sm text-gray-600">
                Votre manager examine la demande et vous notifie de sa décision.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Confirmation</h3>
              <p className="text-sm text-gray-600">
                Une fois approuvée, votre demande est enregistrée et votre solde mis à jour.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contacts utiles */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Contacts utiles
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Service RH</h3>
            <p className="text-sm text-gray-600">rh@entreprise.fr</p>
            <p className="text-sm text-gray-600">01 23 45 67 89</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Support technique</h3>
            <p className="text-sm text-gray-600">support@entreprise.fr</p>
            <p className="text-sm text-gray-600">01 23 45 67 90</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Informations
