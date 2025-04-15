
import { StressQuestion, FeedbackLevel } from './types';

// Initial questions for stress diagnostic
export const initialQuestions: StressQuestion[] = [
  {
    id: 'q1',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti nerveux ou stressé ?",
    category: "Perception du stress",
    points: [0, 1, 2, 3, 4],
    order: 1,
    isActive: true
  },
  {
    id: 'q2',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous eu l'impression de ne pas pouvoir contrôler les choses importantes de votre vie ?",
    category: "Contrôle",
    points: [0, 1, 2, 3, 4],
    order: 2,
    isActive: true
  },
  {
    id: 'q3',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti confiant dans votre capacité à gérer vos problèmes personnels ?",
    category: "Confiance",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 3,
    isActive: true
  },
  {
    id: 'q4',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous senti que les choses allaient comme vous le vouliez ?",
    category: "Satisfaction",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 4,
    isActive: true
  },
  {
    id: 'q5',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous senti que les difficultés s'accumulaient à tel point que vous ne pouviez pas les surmonter ?",
    category: "Surcharge",
    points: [0, 1, 2, 3, 4],
    order: 5,
    isActive: true
  },
  {
    id: 'q6',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous eu des difficultés à vous endormir ou à rester endormi ?",
    category: "Sommeil",
    points: [0, 1, 2, 3, 4],
    order: 6,
    isActive: true
  },
  {
    id: 'q7',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti irritable ou facilement agacé ?",
    category: "Irritabilité",
    points: [0, 1, 2, 3, 4],
    order: 7,
    isActive: true
  },
  {
    id: 'q8',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti débordé par tout ce que vous aviez à faire ?",
    category: "Surcharge",
    points: [0, 1, 2, 3, 4],
    order: 8,
    isActive: true
  },
  {
    id: 'q9',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous été capable de contrôler votre irritation ?",
    category: "Contrôle émotionnel",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 9,
    isActive: true
  },
  {
    id: 'q10',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous ressenti des tensions ou douleurs physiques (maux de tête, tensions musculaires, etc.) ?",
    category: "Manifestations physiques",
    points: [0, 1, 2, 3, 4],
    order: 10,
    isActive: true
  }
];

// Initial feedback levels for stress diagnostic
export const initialFeedbacks: FeedbackLevel[] = [
  {
    minScore: 0,
    maxScore: 13,
    label: "Stress faible",
    description: "Votre niveau de stress est faible. Continuez à prendre soin de vous et à maintenir vos bonnes habitudes de gestion du stress."
  },
  {
    minScore: 14,
    maxScore: 26,
    label: "Stress modéré",
    description: "Votre niveau de stress est modéré. Même si vous semblez gérer votre stress raisonnablement bien, il serait bénéfique d'explorer de nouvelles stratégies de gestion du stress pour améliorer votre bien-être."
  },
  {
    minScore: 27,
    maxScore: 40,
    label: "Stress élevé",
    description: "Votre niveau de stress est élevé. Il est recommandé de mettre en place des stratégies de gestion du stress plus efficaces et d'envisager de consulter un professionnel si ce niveau de stress persiste."
  }
];
