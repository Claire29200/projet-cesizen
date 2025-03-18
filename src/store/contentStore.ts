
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for our content
export interface ContentSection {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface InfoPage {
  id: string;
  title: string;
  slug: string;
  sections: ContentSection[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentState {
  infoPages: InfoPage[];
  getInfoPageBySlug: (slug: string) => InfoPage | undefined;
  updateInfoPage: (pageId: string, data: Partial<InfoPage>) => void;
  updateSection: (pageId: string, sectionId: string, data: Partial<ContentSection>) => void;
  addSection: (pageId: string, section: Omit<ContentSection, 'id' | 'updatedAt'>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  addInfoPage: (page: Omit<InfoPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeInfoPage: (pageId: string) => void;
}

// Initial content for the website
const initialInfoPages: InfoPage[] = [
  {
    id: '1',
    title: 'Comprendre la santé mentale',
    slug: 'comprendre',
    isPublished: true,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-10'),
    sections: [
      {
        id: '1-1',
        title: 'Qu\'est-ce que la santé mentale ?',
        content: "La santé mentale est un état de bien-être dans lequel une personne peut se réaliser, surmonter les tensions normales de la vie, accomplir un travail productif et contribuer à la vie de sa communauté. Dans ce sens positif, la santé mentale est le fondement du bien-être d'un individu et du bon fonctionnement d'une communauté.\n\nLa santé mentale ne se définit pas seulement par l'absence de troubles mentaux. Une personne peut éprouver une détresse psychologique sans nécessairement répondre aux critères d'un trouble mental spécifique.\n\nLa santé mentale est influencée par une multitude de facteurs sociaux, psychologiques et biologiques qui interagissent de façon complexe.",
        updatedAt: new Date('2023-06-01'),
      },
      {
        id: '1-2',
        title: 'Facteurs de risque et de protection',
        content: "Plusieurs facteurs peuvent affecter notre santé mentale positivement ou négativement :\n\n**Facteurs de risque** :\n- Stress chronique\n- Traumatismes\n- Isolement social\n- Précarité économique\n- Discrimination\n- Violence\n- Antécédents familiaux de troubles mentaux\n\n**Facteurs de protection** :\n- Bonnes relations sociales\n- Exercice physique régulier\n- Sommeil suffisant\n- Alimentation équilibrée\n- Techniques de gestion du stress\n- Environnement familial stable\n- Accès aux soins de santé",
        updatedAt: new Date('2023-06-01'),
      },
      {
        id: '1-3',
        title: 'Stigmatisation et préjugés',
        content: "La stigmatisation liée aux troubles mentaux reste un obstacle majeur à l'accès aux soins. Beaucoup de personnes souffrant de troubles mentaux sont confrontées à des préjugés qui peuvent aggraver leur situation.\n\nLa lutte contre la stigmatisation passe par une meilleure information sur la santé mentale, sur les troubles mentaux et leur traitement. C'est pourquoi il est essentiel de parler ouvertement de santé mentale et de promouvoir une vision positive et inclusive du bien-être psychologique.",
        updatedAt: new Date('2023-06-10'),
      }
    ]
  },
  {
    id: '2',
    title: 'Gérer le stress au quotidien',
    slug: 'stress',
    isPublished: true,
    createdAt: new Date('2023-06-02'),
    updatedAt: new Date('2023-06-11'),
    sections: [
      {
        id: '2-1',
        title: 'Le mécanisme du stress',
        content: "Le stress est une réaction naturelle de l'organisme face à une menace ou un défi. Cette réaction met en jeu des mécanismes physiologiques, cognitifs et comportementaux visant à nous préparer à l'action.\n\nLe stress aigu est une réponse normale et adaptative qui nous permet de faire face aux situations d'urgence. Cependant, lorsque le stress devient chronique, il peut avoir des effets néfastes sur notre santé physique et mentale.",
        updatedAt: new Date('2023-06-02'),
      },
      {
        id: '2-2',
        title: 'Techniques de gestion du stress',
        content: "De nombreuses techniques peuvent vous aider à mieux gérer votre stress au quotidien :\n\n- **La respiration profonde** : Inspirez lentement par le nez en comptant jusqu'à 4, retenez votre souffle en comptant jusqu'à 2, puis expirez lentement par la bouche en comptant jusqu'à 6.\n\n- **La méditation de pleine conscience** : Portez votre attention sur le moment présent, sans jugement, en observant vos pensées, vos émotions et vos sensations corporelles.\n\n- **L'activité physique régulière** : L'exercice libère des endorphines, les hormones du bien-être, et permet de réduire les tensions physiques et mentales.\n\n- **Une alimentation équilibrée** : Certains aliments peuvent influencer votre niveau de stress (caféine, sucre, alcool) tandis que d'autres peuvent avoir un effet apaisant (aliments riches en magnésium, oméga-3, vitamines B).\n\n- **Un sommeil suffisant et de qualité** : Le manque de sommeil augmente la sensibilité au stress.",
        updatedAt: new Date('2023-06-11'),
      },
      {
        id: '2-3',
        title: 'Quand consulter un professionnel',
        content: "Si malgré ces techniques, votre stress reste difficile à gérer et affecte votre qualité de vie, il peut être utile de consulter un professionnel de la santé mentale. N'hésitez pas à en parler à votre médecin qui pourra vous orienter vers un psychologue ou un psychiatre.\n\nDes signes comme des troubles du sommeil persistants, une irritabilité constante, des difficultés de concentration, des douleurs physiques inexpliquées ou des pensées anxieuses envahissantes peuvent indiquer qu'une aide professionnelle serait bénéfique.",
        updatedAt: new Date('2023-06-02'),
      }
    ]
  },
  {
    id: '3',
    title: 'Troubles anxieux',
    slug: 'anxiete',
    isPublished: true,
    createdAt: new Date('2023-06-03'),
    updatedAt: new Date('2023-06-12'),
    sections: [
      {
        id: '3-1',
        title: 'Qu\'est-ce que l\'anxiété ?',
        content: "L'anxiété est une émotion caractérisée par un sentiment d'inquiétude, de nervosité ou de peur. C'est une réaction normale face à des situations stressantes ou menaçantes. Cependant, lorsque l'anxiété devient excessive, persistante et qu'elle interfère avec les activités quotidiennes, on parle alors de trouble anxieux.\n\nLes troubles anxieux sont parmi les problèmes de santé mentale les plus courants. Ils peuvent prendre plusieurs formes : trouble d'anxiété généralisée, trouble panique, phobies, trouble d'anxiété sociale, etc.",
        updatedAt: new Date('2023-06-03'),
      },
      {
        id: '3-2',
        title: 'Symptômes des troubles anxieux',
        content: "Les troubles anxieux se manifestent à travers divers symptômes physiques et psychologiques :\n\n**Symptômes physiques** :\n- Accélération du rythme cardiaque\n- Respiration rapide et superficielle\n- Tensions musculaires\n- Tremblements\n- Sueurs\n- Troubles digestifs\n- Vertiges\n- Fatigue\n\n**Symptômes psychologiques** :\n- Inquiétude excessive et incontrôlable\n- Irritabilité\n- Difficultés de concentration\n- Anticipation anxieuse\n- Évitement des situations anxiogènes\n- Pensées catastrophiques\n- Troubles du sommeil",
        updatedAt: new Date('2023-06-12'),
      },
      {
        id: '3-3',
        title: 'Traitement des troubles anxieux',
        content: "Les troubles anxieux peuvent être traités efficacement grâce à une approche combinant plusieurs interventions :\n\n**Psychothérapie** : La thérapie cognitivo-comportementale (TCC) est particulièrement efficace pour traiter les troubles anxieux. Elle aide à identifier et modifier les schémas de pensée et les comportements qui alimentent l'anxiété.\n\n**Médicaments** : Différents types de médicaments peuvent être prescrits pour soulager les symptômes d'anxiété : antidépresseurs, anxiolytiques, bêta-bloquants. Ces médicaments doivent être prescrits et suivis par un médecin.\n\n**Techniques de relaxation** : Méditation, yoga, relaxation musculaire progressive, respiration diaphragmatique.\n\n**Hygiène de vie** : Activité physique régulière, alimentation équilibrée, sommeil suffisant, limitation des substances excitantes (caféine, alcool).\n\nLa combinaison de ces approches, adaptée à chaque individu, permet généralement d'obtenir des résultats significatifs.",
        updatedAt: new Date('2023-06-12'),
      }
    ]
  },
  {
    id: '4',
    title: 'Dépression',
    slug: 'depression',
    isPublished: true,
    createdAt: new Date('2023-06-04'),
    updatedAt: new Date('2023-06-13'),
    sections: [
      {
        id: '4-1',
        title: 'Comprendre la dépression',
        content: "La dépression est bien plus qu'une simple tristesse passagère. C'est un trouble de l'humeur caractérisé par une tristesse persistante, une perte d'intérêt pour les activités habituellement plaisantes et une incapacité à accomplir les activités quotidiennes, durant au moins deux semaines.\n\nLa dépression affecte les pensées, les émotions, les comportements et peut causer divers problèmes physiques. Il s'agit d'une maladie complexe qui résulte de l'interaction de facteurs biologiques, psychologiques et sociaux.",
        updatedAt: new Date('2023-06-04'),
      },
      {
        id: '4-2',
        title: 'Signes et symptômes',
        content: "La dépression se manifeste à travers divers symptômes qui peuvent varier d'une personne à l'autre :\n\n- Humeur triste, vide ou anxieuse persistante\n- Perte d'intérêt ou de plaisir pour presque toutes les activités\n- Fatigue et manque d'énergie\n- Insomnie ou hypersomnie\n- Diminution ou augmentation de l'appétit et du poids\n- Agitation ou ralentissement psychomoteur\n- Sentiments de dévalorisation ou de culpabilité excessive\n- Difficultés à se concentrer et à prendre des décisions\n- Pensées de mort ou idées suicidaires\n\nPour parler de dépression, ces symptômes doivent être présents presque tous les jours, pendant au moins deux semaines, et représenter un changement par rapport au fonctionnement antérieur.",
        updatedAt: new Date('2023-06-13'),
      },
      {
        id: '4-3',
        title: 'Traitement et soutien',
        content: "La dépression est une maladie traitable. Les approches thérapeutiques comprennent :\n\n**Psychothérapie** : Différentes formes de psychothérapie sont efficaces, notamment la thérapie cognitivo-comportementale (TCC), la thérapie interpersonnelle (TIP) et la psychothérapie psychodynamique.\n\n**Médication** : Les antidépresseurs peuvent aider à soulager les symptômes en agissant sur les neurotransmetteurs cérébraux. Il existe différentes classes d'antidépresseurs, et le choix du médicament dépend de nombreux facteurs individuels.\n\n**Traitement combiné** : La combinaison de psychothérapie et de médication est souvent plus efficace que l'une ou l'autre approche utilisée seule, surtout dans les cas de dépression modérée à sévère.\n\n**Modifications du mode de vie** : L'activité physique régulière, une alimentation équilibrée, un sommeil suffisant et la réduction du stress peuvent compléter efficacement les autres formes de traitement.\n\n**Soutien social** : Le soutien de la famille, des amis et des groupes d'entraide peut jouer un rôle crucial dans le rétablissement.\n\nSi vous présentez des symptômes de dépression, n'hésitez pas à consulter un médecin. Un diagnostic précoce et un traitement adapté peuvent considérablement améliorer le pronostic.",
        updatedAt: new Date('2023-06-13'),
      }
    ]
  }
];

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      infoPages: initialInfoPages,
      
      getInfoPageBySlug: (slug) => {
        return get().infoPages.find(page => page.slug === slug);
      },
      
      updateInfoPage: (pageId, data) => {
        set(state => ({
          infoPages: state.infoPages.map(page => 
            page.id === pageId 
              ? { ...page, ...data, updatedAt: new Date() } 
              : page
          )
        }));
      },
      
      updateSection: (pageId, sectionId, data) => {
        set(state => ({
          infoPages: state.infoPages.map(page => 
            page.id === pageId 
              ? { 
                  ...page, 
                  updatedAt: new Date(),
                  sections: page.sections.map(section => 
                    section.id === sectionId 
                      ? { ...section, ...data, updatedAt: new Date() } 
                      : section
                  ) 
                } 
              : page
          )
        }));
      },
      
      addSection: (pageId, sectionData) => {
        const newSection: ContentSection = {
          id: Math.random().toString(36).substr(2, 9),
          ...sectionData,
          updatedAt: new Date()
        };
        
        set(state => ({
          infoPages: state.infoPages.map(page => 
            page.id === pageId 
              ? { 
                  ...page, 
                  updatedAt: new Date(),
                  sections: [...page.sections, newSection] 
                } 
              : page
          )
        }));
      },
      
      removeSection: (pageId, sectionId) => {
        set(state => ({
          infoPages: state.infoPages.map(page => 
            page.id === pageId 
              ? { 
                  ...page, 
                  updatedAt: new Date(),
                  sections: page.sections.filter(section => section.id !== sectionId) 
                } 
              : page
          )
        }));
      },
      
      addInfoPage: (pageData) => {
        const newPage: InfoPage = {
          id: Math.random().toString(36).substr(2, 9),
          ...pageData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          infoPages: [...state.infoPages, newPage]
        }));
      },
      
      removeInfoPage: (pageId) => {
        set(state => ({
          infoPages: state.infoPages.filter(page => page.id !== pageId)
        }));
      }
    }),
    {
      name: 'content-storage',
    }
  )
);
