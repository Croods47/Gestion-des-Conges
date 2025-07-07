# MesConges - Gestion des Congés Payés

Application moderne de gestion des congés payés pour les entreprises françaises avec système de paiement intégré.

## 🚀 Fonctionnalités

### Gestion des Congés
- ✅ **Authentification multi-rôles** (Employé, Manager, Admin)
- ✅ **Tableau de bord** avec statistiques et soldes
- ✅ **Demandes de congé** avec validation automatique
- ✅ **Historique complet** avec filtres et recherche
- ✅ **Approbation workflow** pour les managers
- ✅ **Conformité légale française** (congés payés, RTT, etc.)

### Système de Paiement
- 💳 **Paiements ponctuels** pour services supplémentaires
- 🔄 **Abonnements récurrents** (mensuel, trimestriel, annuel)
- 📊 **Plans tarifaires** flexibles (Basique, Pro, Entreprise)
- 💰 **Gestion des moyens de paiement**
- 📈 **Historique des transactions**
- 🔒 **Intégration Stripe** (prêt pour la production)

## 🛠️ Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Date Management**: date-fns
- **Icons**: React Icons (Feather)
- **Notifications**: React Toastify
- **Payments**: Stripe (configuration requise)
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🏃‍♂️ Démarrage Rapide

### Prérequis
- Node.js 18+
- pnpm (recommandé) ou npm

### Installation
```bash
# Cloner le projet
git clone <votre-repo>
cd gestion-conges

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev
```

### Comptes de Démonstration
- **Employé**: jean.dupont@entreprise.fr / demo
- **Manager**: sophie.martin@entreprise.fr / demo  
- **Admin**: pierre.durand@entreprise.fr / demo

## 🚀 Déploiement sur Vercel

### Méthode 1: Via l'interface Vercel
1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Vercel détectera automatiquement la configuration Vite
5. Cliquez sur "Deploy"

### Méthode 2: Via CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour les déploiements suivants
vercel --prod
```

### Configuration Stripe (Optionnel)
Pour activer les paiements réels, ajoutez vos clés Stripe dans les variables d'environnement Vercel:

```bash
# Dans le dashboard Vercel > Settings > Environment Variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout.tsx      # Layout principal avec navigation
│   └── CongeCard.tsx   # Carte d'affichage des demandes
├── pages/              # Pages de l'application
│   ├── Login.tsx       # Authentification
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── DemandeConge.tsx # Formulaire de demande
│   ├── Historique.tsx  # Historique des demandes
│   ├── Payments.tsx    # Système de paiement
│   ├── Administration.tsx # Panel admin
│   └── Informations.tsx # Infos légales
├── stores/             # State management (Zustand)
│   ├── authStore.ts    # Authentification
│   ├── congesStore.ts  # Gestion des congés
│   └── paymentStore.ts # Système de paiement
└── App.tsx            # Configuration des routes
```

## 🎨 Fonctionnalités Détaillées

### Gestion des Congés
- **Calcul automatique** des jours ouvrables
- **Validation des soldes** avant soumission
- **Workflow d'approbation** avec commentaires
- **Types de congés**: Payés, RTT, Maladie, Exceptionnels
- **Conformité légale** française

### Système de Paiement
- **Plans d'abonnement** avec fonctionnalités différenciées
- **Paiements ponctuels** pour formations, consultations
- **Gestion des cartes** de paiement
- **Historique détaillé** des transactions
- **Annulation d'abonnements**

### Interface Utilisateur
- **Design responsive** (mobile, tablet, desktop)
- **Interface moderne** avec Tailwind CSS
- **Navigation intuitive** avec sidebar
- **Notifications toast** pour les actions
- **Filtres et recherche** avancés

## 🔧 Configuration Avancée

### Variables d'Environnement
```bash
# .env.local (pour le développement)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000/api
```

### Personnalisation
- **Thème**: Modifiez `tailwind.config.js`
- **Plans tarifaires**: Éditez `src/stores/paymentStore.ts`
- **Types de congés**: Configurez dans `src/stores/congesStore.ts`

## 📊 Métriques et Analytics

L'application inclut un système de suivi des métriques:
- Nombre de demandes par statut
- Utilisation des différents types de congés
- Revenus par plan d'abonnement
- Taux de conversion des paiements

## 🔒 Sécurité

- **Authentification** basée sur les rôles
- **Validation côté client** et serveur
- **Gestion sécurisée** des paiements via Stripe
- **Protection CSRF** et XSS

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email**: support@mesconges.fr
- **Documentation**: [docs.mesconges.fr](https://docs.mesconges.fr)
- **Issues**: Utilisez les GitHub Issues pour reporter des bugs

---

Développé avec ❤️ pour simplifier la gestion des congés en entreprise.
