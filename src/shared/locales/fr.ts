import { createLocale } from './createLocale';

export const fr = createLocale({
  common: {
    loading: 'Chargement du coût par utilisation...', appName: 'Coût par utilisation', appSubTitle: 'Connaissez la vraie valeur avant d’acheter',
    autofilled: 'Informations du produit remplies depuis la page.', autofillBtn: 'Remplir', saveSuccess: 'Préférences enregistrées.',
    saveError: 'Impossible d’enregistrer les préférences.', yrShort: 'an', moShort: 'mois', productDefault: 'Produit',
  },
  tabs: { calculate: 'Calculer', compare: 'Comparer', history: 'Historique' },
  calculator: {
    placeholderProduct: 'Qu’achetez-vous ?', labelPrice: 'Saisir le prix', titlePrice: 'Prix du produit',
    labelDuration: 'Combien de temps le garderez-vous ?', labelUsage: 'À quelle fréquence l’utiliserez-vous ?',
    advancedToggle: 'Avancé (Revente, mensualités, salaire)', labelResale: 'Valeur de revente estimée',
    labelMaintenance: 'Coût d’entretien estimé', labelPayments: 'Nombre de paiements', labelTotalPaid: 'Montant total payé',
    labelHourlyWage: 'Salaire horaire net', btnCalculate: 'Calculer le coût par utilisation',
    errors: {
      priceRequired: 'Le prix doit être supérieur à zéro.', durationRequired: 'La durée doit être supérieure à zéro.',
      usesRequired: 'Les utilisations par semaine doivent être supérieures à zéro.', resaleLimit: 'La revente ne peut pas dépasser le coût total.',
      generic: 'Corrigez les erreurs du formulaire.', calculateFirst: 'Effectuez d’abord le calcul.',
    },
  },
  results: {
    title: 'Résultats', costPerUse: 'Coût par utilisation', valueRating: 'Évaluation', btnSave: 'Enregistrer le calcul',
    btnCompare: 'Ajouter à la comparaison', metrics: { perDay: 'Par jour', perMonth: 'Par mois', perYear: 'Par an', totalUses: 'Utilisations totales', netCost: 'Coût net' },
    ratingLabels: { excellent: 'Excellent', good: 'Bon', think_twice: 'À reconsidérer', expensive: 'Cher' },
    perUseLabel: '/ utilisation', disclaimer: 'Cette estimation repose sur vos données. La valeur réelle dépend de votre utilisation.',
    btnCompared: 'Ajouté', timesLabel: 'fois',
  },
  compare: {
    title: 'Comparaison de produits', btnRemove: 'Retirer', btnClear: 'Tout effacer', empty: 'Aucun produit à comparer.',
    bestBadge: 'Meilleur choix', alreadyAdded: 'Déjà ajouté à la comparaison.', addedSuccess: '{product} a été ajouté.', removed: 'Retiré de la comparaison.',
  },
  scraper: {
    systemPage: 'Impossible de lire les pages système.', injectFailed: 'Impossible de lancer le remplissage. Actualisez la page.',
    connectFailed: 'Impossible de se connecter à la page.', autofillSuccess: 'Informations du produit remplies.', noProductDetails: 'Aucune information produit trouvée.',
  },
  history: {
    title: 'Calculs enregistrés', empty: 'Aucun calcul enregistré.', recentTitle: 'Calculs récents', viewAll: 'Tout afficher ({count})',
    btnClear: 'Effacer l’historique', btnExport: 'Exporter JSON', btnImport: 'Importer JSON', deleteConfirm: 'Calcul supprimé.',
    clearConfirm: 'Historique effacé.', saveSuccess: 'Calcul enregistré localement.', tableProduct: 'Produit', tablePrice: 'Prix',
    tableNetCost: 'Coût net', tableDuration: 'Durée et utilisation', tableRating: 'Évaluation', tableCostUse: 'Coût / utilisation',
    tableActions: 'Actions', unnamedProduct: 'Produit sans nom', usesCount: '{count} utilisations',
  },
  settings: {
    title: 'Valeurs et options', subTitle: 'Paramètres et personnalisation', labelCurrency: 'Devise par défaut', customCurrencySymbol: 'Symbole personnalisé',
    labelDuration: 'Durée', labelDurationUnit: 'Unité', labelUsesPerWeek: 'Utilisations par semaine',
    labelEnableLabor: 'Activer l’équivalent en temps de travail', descEnableLabor: 'Afficher le coût en temps de travail',
    labelAutoFill: 'Activer le remplissage depuis les pages produit', descAutoFill: 'Lit localement le titre et le prix de la page active. Ces données ne sont jamais transmises.',
    labelTheme: 'Thème', labelLanguage: 'Langue', privacyTitle: 'Confidentialité',
    privacyDesc: 'Les données de page et les calculs restent dans le stockage local du navigateur.',
    privacyBadge1: 'Stockage local uniquement', privacyBadge2: 'Aucun traqueur', btnSave: 'Enregistrer les préférences',
    btnClearDb: 'Effacer la base', btnConfirmClearDb: 'Confirmer l’effacement', saveSuccess: 'Préférences enregistrées.',
  },
  support: {
    title: 'Soutenir cette extension', description: 'Cette extension est gratuite et open source. Vous pouvez soutenir son développement sur Patreon.',
    patreonBtn: 'Soutenir sur Patreon', freeBadge: 'Gratuit et open source', noAdsBadge: 'Sans publicité ni suivi',
  },
});
