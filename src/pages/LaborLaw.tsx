import { FiBook, FiCalendar, FiClock, FiInfo, FiHeart, FiUser } from 'react-icons/fi'

export default function LaborLaw() {
  const sections = [
    {
      title: 'Congés payés',
      icon: FiCalendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      content: [
        'Durée légale : 2,5 jours ouvrables par mois travaillé (30 jours par an)',
        'Période de référence : du 1er juin au 31 mai de l\'année suivante',
        'Prise des congés : entre le 1er mai et le 31 octobre (période légale)',
        'Fractionnement possible avec accord de l\'employeur',
        'Indemnité de congés payés : 1/10e de la rémunération brute totale'
      ]
    },
    {
      title: 'RTT (Réduction du Temps de Travail)',
      icon: FiClock,
      color: 'text-green-600',
      bg: 'bg-green-100',
      content: [
        'Pour les salariés à 35h : pas de RTT obligatoire',
        'Pour les salariés au forfait ou > 35h : RTT selon accord d\'entreprise',
        'Nombre de jours RTT variable selon l\'organisation du temps de travail',
        'Possibilité de report selon les accords collectifs',
        'Prise des RTT soumise à l\'accord de l\'employeur'
      ]
    },
    {
      title: 'Congés maladie',
      icon: FiHeart,
      color: 'text-red-600',
      bg: 'bg-red-100',
      content: [
        'Arrêt maladie sur prescription médicale',
        'Délai de carence : 3 jours pour les indemnités journalières',
        'Maintien de salaire selon la convention collective',
        'Durée maximale : 360 jours sur 3 ans consécutifs',
        'Contrôle médical possible par l\'employeur'
      ]
    },
    {
      title: 'Congé maternité',
      icon: FiUser,
      color: 'text-pink-600',
      bg: 'bg-pink-100',
      content: [
        'Durée légale : 16 semaines (6 semaines avant + 10 semaines après)',
        'Congé prénatal : peut être reporté partiellement après l\'accouchement',
        'Congé postnatal : 8 semaines minimum obligatoires',
        'Grossesses multiples : durée prolongée',
        'Protection contre le licenciement pendant le congé'
      ]
    },
    {
      title: 'Congé paternité',
      icon: FiUser,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      content: [
        'Durée : 25 jours calendaires (dont 4 jours obligatoires)',
        'À prendre dans les 6 mois suivant la naissance',
        'Peut être fractionné en 2 périodes minimum de 5 jours',
        'Indemnisation par la Sécurité sociale',
        'Maintien de salaire selon la convention collective'
      ]
    }
  ]

  const importantNotes = [
    'Les congés ne peuvent pas être remplacés par une indemnité compensatrice, sauf en cas de rupture du contrat de travail',
    'L\'employeur peut fixer l\'ordre des départs en congés en tenant compte de la situation familiale',
    'Un salarié ne peut pas renoncer à ses congés payés',
    'Les jours fériés tombant pendant les congés ne sont pas décomptés des congés payés',
    'En cas de maladie pendant les congés, les jours de maladie peuvent être reportés sous conditions'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiBook className="h-6 w-6 mr-2" />
          Informations légales sur les congés
        </h1>
        <p className="text-gray-600 mt-2">
          Retrouvez les principales dispositions du Code du travail français concernant les congés
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${section.bg} mr-4`}>
                    <Icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FiInfo className="h-5 w-5 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">Points importants à retenir</h3>
        </div>
        
        <ul className="space-y-2">
          {importantNotes.map((note, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <span className="text-yellow-800 text-sm leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Ressources utiles</h3>
        <div className="space-y-2 text-sm">
          <p className="text-blue-700">
            <strong>Code du travail :</strong> Articles L3141-1 à L3141-32 (congés payés)
          </p>
          <p className="text-blue-700">
            <strong>Service public :</strong> service-public.fr - section "Travail"
          </p>
          <p className="text-blue-700">
            <strong>Ministère du Travail :</strong> travail-emploi.gouv.fr
          </p>
        </div>
      </div>
    </div>
  )
}
