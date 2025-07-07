import { FiInfo, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi'

const InfosConges = () => {
  const infosConges = [
    {
      titre: "Congés payés annuels",
      description: "Droit à 2,5 jours ouvrables par mois travaillé, soit 30 jours ouvrables (5 semaines) par an.",
      details: [
        "Acquisition progressive tout au long de l'année",
        "Période de référence : du 1er juin au 31 mai",
        "Report possible sous conditions",
        "Indemnisation à 1/10e du salaire brut"
      ]
    },
    {
      titre: "RTT (Réduction du Temps de Travail)",
      description: "Jours de repos compensateurs pour les salariés travaillant plus de 35h par semaine.",
      details: [
        "Nombre variable selon la convention collective",
        "Généralement entre 8 et 25 jours par an",
        "Peuvent être imposés par l'employeur",
        "Pas de report automatique d'une année sur l'autre"
      ]
    },
    {
      titre: "Congés exceptionnels",
      description: "Congés accordés pour des événements familiaux ou personnels spécifiques.",
      details: [
        "Mariage : 4 jours",
        "Naissance/adoption : 3 jours",
        "Décès conjoint/enfant : 2-3 jours",
        "Déménagement : 1 jour (selon convention)"
      ]
    }
  ]
  
  const bonnesPratiques = [
    {
      titre: "Planification",
      description: "Anticipez vos demandes de congés, surtout pour les périodes de forte demande (été, fêtes)."
    },
    {
      titre: "Communication",
      description: "Informez votre équipe et organisez la continuité de votre travail pendant votre absence."
    },
    {
      titre: "Délais",
      description: "Respectez les délais de prévenance définis par votre convention collective (généralement 1 mois)."
    },
    {
      titre: "Documentation",
      description: "Conservez une copie de vos demandes et des réponses de votre employeur."
    }
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Informations sur les congés</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tout ce que vous devez savoir sur vos droits aux congés payés et RTT.
        </p>
      </div>
      
      {/* Types de congés */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Types de congés</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {infosConges.map((info, index) => (
            <div key={index} className="card">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCalendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{info.titre}</h3>
                  <p className="mt-2 text-sm text-gray-600">{info.description}</p>
                  <ul className="mt-4 space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="ml-3 text-sm text-gray-600">{detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bonnes pratiques */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Bonnes pratiques</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bonnesPratiques.map((pratique, index) => (
            <div key={index} className="card">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiInfo className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{pratique.titre}</h3>
                  <p className="mt-1 text-sm text-gray-600">{pratique.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Informations légales */}
      <div className="card">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Informations légales importantes</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                <strong>Code du travail :</strong> Les dispositions relatives aux congés payés sont définies 
                aux articles L3141-1 et suivants du Code du travail.
              </p>
              <p>
                <strong>Convention collective :</strong> Votre convention collective peut prévoir des 
                dispositions plus favorables que le Code du travail.
              </p>
              <p>
                <strong>Refus de congés :</strong> L'employeur peut refuser une demande de congés pour 
                des raisons de service, mais doit motiver sa décision.
              </p>
              <p>
                <strong>Congés imposés :</strong> L'employeur peut imposer la prise de congés pendant 
                certaines périodes (fermeture d'entreprise, pont, etc.).
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact RH */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiClock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-900">Besoin d'aide ?</h3>
            <p className="mt-2 text-sm text-blue-700">
              Pour toute question concernant vos droits aux congés ou pour des situations particulières, 
              n'hésitez pas à contacter le service des Ressources Humaines.
            </p>
            <div className="mt-4">
              <p className="text-sm text-blue-700">
                <strong>Email :</strong> rh@entreprise.fr<br />
                <strong>Téléphone :</strong> 01 23 45 67 89<br />
                <strong>Bureau :</strong> Bâtiment A, 2ème étage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfosConges
