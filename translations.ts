
import { Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  [Language.EN]: {
    common: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      poweredBy: 'Powered by',
      secure: 'Secure Session',
      loading: 'Loading...',
      hrPanel: 'HR Panel',
      candidatePortal: 'Candidate Portal'
    },
    login: {
      title: 'Professional Hiring,',
      titleHighlight: 'Redefined.',
      description: "Our AI-powered platform helps the world's leading companies identify top talent.",
      features: [
        "Instant AI Evaluation",
        "Global Recruitment Standards",
        "Verified Domain Expertise"
      ],
      portalTitle: 'Candidate Portal',
      portalSub: 'Please enter your registration details to proceed.',
      fields: {
        name: 'Full Name',
        phone: 'Phone Number',
        id: 'Registration / ID Number'
      },
      button: 'Proceed to Domain Selection'
    },
    domains: {
      welcome: 'Welcome,',
      selectionTitle: 'Domain Selection Portal',
      sub: 'Select your expertise sector to begin the high-fidelity technical evaluation.',
      initializing: 'Initializing Neural Map',
      constructing: 'Constructing {domain} Architecture...',
      cardLabel: 'Domain Name'
    },
    onboarding: {
      title: 'Profile Calibration',
      experience: 'What is your professional experience level?',
      fresher: 'Fresher',
      experienced: 'Experienced',
      education: 'Select your primary educational field:',
      otherField: 'Please specify your educational field:',
      gradYear: 'Enter your graduation year:',
      confirm: 'Confirm Profile',
      fields: [
        'Computer Science Engineering',
        'Electronics Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Others'
      ]
    },
    interview: {
      status: 'Retrieving Domain Matrix',
      inquiry: 'Inquiry',
      inputArea: 'Response Input Area',
      placeholder: 'Structure your professional response here...',
      minChars: 'Min 6 characters to validate',
      inputSecure: 'Input Secure',
      nextInquiry: 'Next Inquiry',
      finalize: 'Finalize Dossier',
      processing: 'Neural Registration',
      integrating: 'Integrating Lexical Data...',
      aiThinking: [
        "Analyzing technical response depth...",
        "Generating next context-aware question...",
        "Evaluating domain-specific competencies...",
        "Synchronizing encrypted response telemetry...",
        "Calibrating neural assessment weights...",
        "Drafting real-time performance summary...",
        "Mapping response to global industry benchmarks..."
      ]
    },
    success: {
      synthesis: [
        'Synthesizing technical lexicon...',
        'Mapping domain competencies...',
        'Calibrating professional vectors...',
        'Finalizing neural dossier...'
      ],
      title: 'Analysis Complete.',
      description: 'Your technical profile has been successfully integrated into the EliteHire evaluation matrix.',
      timelineTitle: 'Results Timeline',
      timelineDesc: 'Official ranking will be released within 24 hours.',
      storageTitle: 'Secure Storage',
      storageDesc: 'All performance telemetry is encrypted and archived.',
      button: 'Return to Hub'
    },
    dashboard: {
      title: 'Recruitment Dashboard',
      sub: 'Review candidate performances and AI recommendations.',
      total: 'Total Candidates',
      avg: 'Avg. Performance',
      search: 'Search candidates...',
      filterAll: 'All Dossiers',
      filterRecommended: 'Recommended',
      filterNotRecommended: 'Not Recommended',
      export: 'Export to Excel',
      table: {
        details: 'Candidate Details',
        domain: 'Domain',
        score: 'AI Score',
        status: 'Status',
        analysis: 'Technical Analysis'
      }
    }
  },
  [Language.ES]: {
    common: {
      back: 'Volver',
      next: 'Siguiente',
      submit: 'Enviar',
      poweredBy: 'Impulsado por',
      secure: 'Sesión Segura',
      loading: 'Cargando...',
      hrPanel: 'Panel de RR.HH.',
      candidatePortal: 'Portal del Candidato'
    },
    login: {
      title: 'Contratación Profesional,',
      titleHighlight: 'Redefinida.',
      description: "Nuestra plataforma impulsada por IA ayuda a las empresas líderes del mundo a identificar el mejor talento.",
      features: [
        "Evaluación Instantánea por IA",
        "Estándares de Reclutamiento Globales",
        "Experiencia en Dominios Verificada"
      ],
      portalTitle: 'Portal del Candidato',
      portalSub: 'Por favor, ingrese sus datos de registro para continuar.',
      fields: {
        name: 'Nombre Completo',
        phone: 'Número de Teléfono',
        id: 'Número de Registro / ID'
      },
      button: 'Continuar a Selección de Dominio'
    },
    domains: {
      welcome: 'Bienvenido,',
      selectionTitle: 'Portal de Selección de Dominio',
      sub: 'Seleccione su sector de especialización para comenzar la evaluación técnica de alta fidelidad.',
      initializing: 'Iniciando Mapa Neuronal',
      constructing: 'Construyendo Arquitectura de {domain}...',
      cardLabel: 'Nombre del Dominio'
    },
    onboarding: {
      title: 'Calibración de Perfil',
      experience: '¿Cuál es su nivel de experiencia profesional?',
      fresher: 'Recién graduado',
      experienced: 'Con experiencia',
      education: 'Seleccione su campo educativo principal:',
      otherField: 'Especifique su campo educativo:',
      gradYear: 'Ingrese su año de graduación:',
      confirm: 'Confirmar Perfil',
      fields: [
        'Ingeniería Informática',
        'Ingeniería Electrónica',
        'Ingeniería Eléctrica',
        'Ingeniería Mecánica',
        'Ingeniería Civil',
        'Otros'
      ]
    },
    interview: {
      status: 'Recuperando Matriz de Dominio',
      inquiry: 'Consulta',
      inputArea: 'Área de Entrada de Respuesta',
      placeholder: 'Estructure su respuesta profesional aquí...',
      minChars: 'Mín. 6 caracteres para validar',
      inputSecure: 'Entrada Segura',
      nextInquiry: 'Siguiente Consulta',
      finalize: 'Finalizar Expediente',
      processing: 'Registro Neuronal',
      integrating: 'Integrating Lexical Data...',
      aiThinking: [
        "Analizando profundidad de respuesta técnica...",
        "Generando siguiente pregunta contextual...",
        "Evaluando competencias específicas del dominio...",
        "Sincronizando telemetría de respuesta cifrada...",
        "Calibrando pesos de evaluación neuronal...",
        "Redactando resumen de desempeño en tiempo real..."
      ]
    },
    success: {
      synthesis: [
        'Sintetizando léxico técnico...',
        'Mapeando competencias de dominio...',
        'Calibrando vectores profesionales...',
        'Finalizando expediente neuronal...'
      ],
      title: 'Análisis Completado.',
      description: 'Su perfil técnico ha sido integrado exitosamente en la matriz de evaluación de EliteHire.',
      timelineTitle: 'Cronograma de Resultados',
      timelineDesc: 'La clasificación oficial se publicará en 24 horas.',
      storageTitle: 'Almacenamiento Seguro',
      storageDesc: 'Toda la telemetría de rendimiento está cifrada y archivada.',
      button: 'Volver al Inicio'
    },
    dashboard: {
      title: 'Panel de Reclutamiento',
      sub: 'Revise el desempeño de los candidatos y las recomendaciones de IA.',
      total: 'Total de Candidatos',
      avg: 'Promedio de Desempeño',
      search: 'Buscar candidatos...',
      filterAll: 'Todos los Expedientes',
      filterRecommended: 'Recomendados',
      filterNotRecommended: 'No Recomendados',
      export: 'Exportar a Excel',
      table: {
        details: 'Detalles del Candidato',
        domain: 'Dominio',
        score: 'Puntaje IA',
        status: 'Estado',
        analysis: 'Análisis Técnico'
      }
    }
  },
  [Language.FR]: {
    common: {
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      poweredBy: 'Propulsé par',
      secure: 'Session Sécurisée',
      loading: 'Chargement...',
      hrPanel: 'Espace RH',
      candidatePortal: 'Portail Candidat'
    },
    login: {
      title: 'Recrutement Professionnel,',
      titleHighlight: 'Redéfini.',
      description: "Notre plateforme basée sur l'IA aide les leaders mondiaux à identifier les meilleurs talents.",
      features: [
        "Évaluation IA Instantanée",
        "Standards de Recrutement Mondiaux",
        "Expertise de Domaine Vérifiée"
      ],
      portalTitle: 'Portail Candidat',
      portalSub: 'Veuillez saisir vos informations pour continuer.',
      fields: {
        name: 'Nom Complet',
        phone: 'Numéro de Téléphone',
        id: "Numéro d'Identification / ID"
      },
      button: 'Passer à la Sélection du Domaine'
    },
    domains: {
      welcome: 'Bienvenue,',
      selectionTitle: 'Portail de Sélection du Domaine',
      sub: "Sélectionnez votre secteur d'expertise pour commencer l'évaluation technique.",
      initializing: 'Initialisation du Plan Neuronal',
      constructing: 'Construction de l\'Architecture {domain}...',
      cardLabel: 'Nom du Domaine'
    },
    onboarding: {
      title: 'Calibration du Profil',
      experience: 'Quel est votre niveau d\'expérience professionnelle ?',
      fresher: 'Débutant',
      experienced: 'Expérimenté',
      education: 'Sélectionnez votre domaine d\'études principal :',
      otherField: 'Veuillez préciser votre domaine d\'études :',
      gradYear: 'Entrez votre année de remise des diplômes :',
      confirm: 'Confirmer le Profil',
      fields: [
        'Génie Informatique',
        'Génie Électronique',
        'Génie Électrique',
        'Génie Mécanique',
        'Génie Civil',
        'Autres'
      ]
    },
    interview: {
      status: 'Récupération de la Matrice',
      inquiry: 'Question',
      inputArea: 'Zone de Saisie des Réponses',
      placeholder: 'Structurez votre réponse professionnelle ici...',
      minChars: 'Min. 6 caractères pour valider',
      inputSecure: 'Saisie Sécurisée',
      nextInquiry: 'Question Suivante',
      finalize: 'Finaliser le Dossier',
      processing: 'Enregistrement Neuronal',
      integrating: 'Intégration des Données Lexicales...',
      aiThinking: [
        "Analyse de la profondeur technique...",
        "Génération de la question suivante...",
        "Évaluation des compétences métier...",
        "Synchronisation des données chiffrées...",
        "Calibrage des poids neuronaux...",
        "Rédaction du diagnostic de performance..."
      ]
    },
    success: {
      synthesis: [
        'Synthèse du lexique technique...',
        'Cartographie des compétences...',
        'Calibrage des vecteurs professionnels...',
        'Finalisation du dossier neuronal...'
      ],
      title: 'Analyse Terminée.',
      description: 'Votre profil technique a été intégré avec succès dans la matrice EliteHire.',
      timelineTitle: 'Calendrier des Résultats',
      timelineDesc: 'Le classement officiel sera publié d\'ici 24 heures.',
      storageTitle: 'Stockage Sécurisé',
      storageDesc: 'Toutes les données de performance sont cryptées et archivées.',
      button: 'Retour au Hub'
    },
    dashboard: {
      title: 'Tableau de Bord Recrutement',
      sub: 'Consultez les performances et les recommandations IA.',
      total: 'Total Candidats',
      avg: 'Performance Moyenne',
      search: 'Rechercher des candidats...',
      filterAll: 'Tous les Dossiers',
      filterRecommended: 'Recommandés',
      filterNotRecommended: 'Non Recommandés',
      export: 'Exporter vers Excel',
      table: {
        details: 'Déails du Candidat',
        domain: 'Domaine',
        score: 'Score IA',
        status: 'Statut',
        analysis: 'Analyse Technique'
      }
    }
  }
};
