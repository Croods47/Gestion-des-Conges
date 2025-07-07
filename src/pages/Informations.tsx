import { FiBook, FiCalendar, FiClock, FiInfo, FiAlertCircle } from 'react-icons/fi'

export default function Informations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Informations légales
        </h1>
        <p className="text-gray-600">
          Tout ce que vous devez savoir sur vos droits aux congés payés
        </p>
      </div>
      
      {/* Congés payés */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiCalendar className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Congés payés</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Acquisition des congés</h3>
            <p className="text-gray-600">
              Vous acquérez 2,5 jours ouvrables de congés payés par mois de travail effectif, 
              soit 30 jours ouvrables (5 semaines) par an pour une année complète de travail.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Période de référence</h3>
            <p className="text-gray-600">
              La période de référence s'étend du 1er juin de l'année précédente au 31 mai de l'année en cours.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Prise des congés</h3>
            <p className="text-gray-600">
              Les congés peuvent être pris entre le 1er mai et le 31 octobre, sauf accord d'entreprise 
              ou convention collective prévoyant d'autres modalités.
            </p>
          </div>
        </div>
      </div>
      
      {/* RTT */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiClock className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Réduction du Temps de Travail (RTT)</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Principe</h3>
            <p className="text-gray-600">
              Les jours de RTT compensent les heures travaillées au-delà de la durée légale de 35 heures par semaine.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Attribution</h3>
            <p className="text-gray-600">
              Le nombre de jours RTT dépend de votre temps de travail et des accords d'entreprise. 
              Généralement, il varie entre 10 et 25 jours par an.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Utilisation</h3>
            <p className="text-gray-600">
              Les RTT peuvent généralement être pris tout au long de l'année, sous réserve des contraintes 
              de service et de l'accord de votre manager.
            </p>
          </div>
        </div>
      </div>
      
      {/* Congés spéciaux */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiBook className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Congés spéciaux</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Congé maternité</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 16 semaines pour les 2 premiers enfants</li>
                <li>• 26 semaines à partir du 3ème enfant</li>
                <li>• Congé prénatal et postnatal</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Congé paternité</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 25 jours calendaires (28 en cas de naissances multiples)</li>
                <li>• À prendre dans les 4 mois suivant la naissance</li>
                <li>• Dont 4 jours obligatoires</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Congé maladie</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sur prescription médicale</li>
                <li>• Indemnisation par la Sécurité sociale</li>
                <li>• Complément employeur selon convention</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Congé formation</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Droit individuel à la formation</li>
                <li>• Compte personnel de formation (CPF)</li>
                <li>• Accord préalable de l'employeur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Procédures */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FiInfo className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Procédures de demande</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Délai de demande</h3>
            <p className="text-gray-600">
              Les demandes de congés doivent être formulées au moins 1 mois à l'avance pour les congés 
              de plus de 2 semaines consécutives, et 2 semaines à l'avance pour les autres congés.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Validation</h3>
            <p className="text-gray-600">
              Votre manager dispose de 2 semaines pour valider ou refuser votre demande. 
              En l'absence de réponse, la demande est considérée comme acceptée.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Modification ou annulation</h3>
            <p className="text-gray-600">
              Vous pouvez modifier ou annuler votre demande tant qu'elle n'a pas été validée. 
              Après validation, toute modification nécessite l'accord de votre manager.
            </p>
          </div>
        </div>
      </div>
      
      {/* Avertissement */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <FiAlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">Important</h3>
            <p className="text-yellow-700 text-sm">
              Ces informations sont données à titre indicatif et peuvent varier selon votre convention collective 
              ou les accords d'entreprise. Pour toute question spécifique, n'hésitez pas à contacter le service RH.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
