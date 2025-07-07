import { FiBook, FiClock, FiCalendar, FiInfo, FiAlertCircle } from 'react-icons/fi'

export default function LaborLaw() {
  const sections = [
    {
      title: "Congés payés annuels",
      icon: FiCalendar,
      content: [
        "Durée légale : 2,5 jours ouvrables par mois de travail effectif",
        "Soit 30 jours ouvrables (5 semaines) pour une année complète",
        "Période de référence : du 1er juin au 31 mai de l'année suivante",
        "Période de prise des congés : du 1er mai au 31 octobre (sauf accord collectif)"
      ]
    },
    {
      title: "Congés pour événements familiaux",
      icon: FiInfo,
      content: [
        "Mariage du salarié : 4 jours",
        "Naissance ou adoption : 3 jours",
        "Mariage d'un enfant : 1 jour",
        "Décès du conjoint, d'un enfant, du père ou de la mère : 2 jours",
        "Décès d'un beau-parent : 1 jour"
      ]
    },
    {
      title: "Congé maladie",
      icon: FiAlertCircle,
      content: [
        "Arrêt de travail sur prescription médicale",
        "Indemnités journalières de la Sécurité sociale après 3 jours de carence",
        "Complément employeur selon la convention collective",
        "Durée maximale : 360 jours sur 3 ans pour une même affection"
      ]
    },
    {
      title: "Congé maternité",
      icon: FiClock,
      content: [
        "Durée légale : 16 semaines (6 semaines avant + 10 semaines après)",
        "Congé prénatal peut être reporté partiellement sur le congé postnatal",
        "Congé postnatal de 10 semaines minimum obligatoire",
        "Indemnités journalières de la Sécurité sociale"
      ]
    },
    {
      title: "Congé paternité et d'accueil de l'enfant",
      icon: FiInfo,
      content: [
        "Durée : 25 jours calendaires (32 jours en cas de naissances multiples)",
        "À prendre dans les 4 mois suivant la naissance",
        "4 jours consécutifs obligatoires à prendre immédiatement après la naissance",
        "Indemnités journalières de la Sécurité sociale"
      ]
    },
    {
      title: "RTT (Réduction du Temps de Travail)",
      icon: FiClock,
      content: [
        "Pour les salariés à temps plein avec horaire > 35h/semaine",
        "Nombre de jours RTT calculé selon les heures supplémentaires",
        "Peut être pris par journée ou demi-journée",
        "Accord de l'employeur requis pour les dates"
      ]
    }
  ]

  const importantNotes = [
    "Les congés payés ne peuvent pas être remplacés par une indemnité, sauf en cas de rupture du contrat de travail",
    "L'employeur peut fixer les dates de congés, mais doit respecter un délai de prévenance",
    "Le fractionnement des congés peut donner droit à des jours supplémentaires",
    "Certaines conventions collectives peuvent prévoir des dispositions plus favorables"
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Droit du travail - Congés</h1>
        <p className="mt-1 text-sm text-gray-600">
          Informations légales sur les différents types de congés en France
        </p>
      </div>

      {/* Sections principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Notes importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FiAlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-lg font-medium text-yellow-900">
            Points importants à retenir
          </h2>
        </div>
        <ul className="space-y-2">
          {importantNotes.map((note, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></div>
              <span className="text-sm text-yellow-800">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ressources utiles */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <FiBook className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Ressources utiles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://www.service-public.fr/particuliers/vosdroits/F2258"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Service Public</h3>
            <p className="text-sm text-gray-600">Congés payés du salarié du secteur privé</p>
          </a>
          <a
            href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006177836/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Légifrance</h3>
            <p className="text-sm text-gray-600">Code du travail - Congés payés</p>
          </a>
          <a
            href="https://www.ameli.fr/assure/droits-demarches/conges/conge-maternite"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Ameli</h3>
            <p className="text-sm text-gray-600">Congé maternité</p>
          </a>
          <a
            href="https://travail-emploi.gouv.fr/droit-du-travail/temps-de-travail-et-conges/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Ministère du Travail</h3>
            <p className="text-sm text-gray-600">Temps de travail et congés</p>
          </a>
        </div>
      </div>

      {/* Avertissement */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <FiAlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Avertissement
            </h3>
            <p className="mt-1 text-sm text-red-700">
              Ces informations sont données à titre indicatif et peuvent évoluer. 
              Pour des situations spécifiques, consultez votre convention collective, 
              votre service RH ou un conseiller juridique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
