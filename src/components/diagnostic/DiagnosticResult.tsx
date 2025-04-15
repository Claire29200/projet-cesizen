import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticResult, FeedbackLevel } from "@/store/diagnosticStore";
import { useAuthStore } from '@/store/auth';

interface DiagnosticResultProps {
  totalScore: number;
  maxScore: number;
  feedback: { label: string; description: string };
  resultId: string | null;
  onStartOver: () => void;
}

export function DiagnosticResultView({
  totalScore,
  maxScore,
  feedback,
  resultId,
  onStartOver
}: DiagnosticResultProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const recommendations = {
    "Stress faible": [
      "Continuez à pratiquer des activités relaxantes comme la méditation ou le yoga",
      "Maintenez une alimentation équilibrée et une bonne hydratation",
      "Préservez vos bonnes habitudes de sommeil",
      "Restez actif physiquement avec une activité régulière"
    ],
    "Stress modéré": [
      "Essayez des techniques de respiration profonde plusieurs fois par jour",
      "Limitez votre consommation de caféine et d'alcool",
      "Pratiquez une activité physique au moins 3 fois par semaine",
      "Considérez tenir un journal pour identifier les déclencheurs de stress"
    ],
    "Stress élevé": [
      "Consultez un professionnel de santé mentale pour un soutien personnalisé",
      "Intégrez des pauses de respiration dans votre emploi du temps quotidien",
      "Réduisez les sources de stress évitables dans votre environnement",
      "Essayez des applications de méditation guidée ou de relaxation"
    ]
  };

  const stressRecommendations = recommendations[feedback.label as keyof typeof recommendations] || recommendations["Stress modéré"];

  return (
    <>
      <div className="text-center mb-12">
        <CheckCircle2 className="h-16 w-16 text-mental-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-mental-800 mb-4">
          Votre évaluation est terminée
        </h1>
        <p className="text-lg text-mental-600">
          Voici les résultats de votre évaluation de stress.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-mental-800 mb-2">
              Votre niveau de stress : {feedback.label}
            </h2>
            <p className="text-sm text-mental-500 mb-4">
              Score : {totalScore} sur {maxScore}
            </p>
            
            <Progress 
              value={(totalScore / maxScore) * 100} 
              className="h-3 mb-6" 
            />
            
            <div className="flex justify-between text-xs text-mental-500 px-1 mb-8">
              <span>Faible</span>
              <span>Modéré</span>
              <span>Élevé</span>
            </div>
          </div>
          
          <div className="p-6 bg-mental-50 rounded-lg mb-6">
            <h3 className="font-medium text-mental-800 mb-4">Interprétation</h3>
            <p className="text-mental-700 mb-6">{feedback.description}</p>
            
            <h3 className="font-medium text-mental-800 mb-4">Recommandations personnalisées</h3>
            <ul className="list-disc pl-5 space-y-2 text-mental-700">
              {stressRecommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
          
          {!isAuthenticated && (
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-mental-800 mb-1">Créez un compte pour suivre vos résultats</h4>
                <p className="text-sm text-mental-600 mb-3">
                  Vous n'êtes pas connecté. Créez un compte pour enregistrer vos résultats et suivre votre évolution au fil du temps.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate('/inscription')}
                  >
                    Créer un compte
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => navigate('/connexion')}
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onStartOver}>
          Refaire le diagnostic
        </Button>
        <Button onClick={() => navigate('/informations/stress')}>
          Consulter nos ressources sur le stress
        </Button>
      </div>
    </>
  );
}
