
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useDiagnosticStore } from "@/store/diagnostic";
import { useAuthStore } from "@/store/auth";
import { HolmesRaheEvent } from "@/models/diagnostic";

const HolmesRaheScalePage = () => {
  const { holmesRaheEvents, saveHolmesRaheResult, getHolmesRaheResultCategory } = useDiagnosticStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [resultCategory, setResultCategory] = useState<{ label: string; description: string } | null>(null);

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const calculateScore = () => {
    const score = selectedEvents.reduce((total, eventId) => {
      const event = holmesRaheEvents.find(e => e.id === eventId);
      return total + (event?.points || 0);
    }, 0);

    setTotalScore(score);
    const category = getHolmesRaheResultCategory(score);
    setResultCategory(category);

    const result = {
      userId: isAuthenticated ? user?.id : null,
      totalScore: score,
      stressScore: score,
      answers: selectedEvents.map(id => ({ questionId: id, answer: 1 })),
      riskCategory: category.label as 'Faible' | 'Moyen' | 'Élevé',
      feedbackProvided: category.label,
      feedbackDescription: category.description
    };

    saveHolmesRaheResult(result);

    toast({
      title: "Diagnostic Holmes et Rahe terminé",
      description: "Votre évaluation du stress lié aux événements de vie est complète."
    });

    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setSelectedEvents([]);
    setShowResults(false);
    setTotalScore(0);
    setResultCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="diagnostic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-mental-800 mb-4">
                    Échelle de Holmes et Rahe
                  </h1>
                  <p className="text-lg text-mental-600 mb-6">
                    Sélectionnez les événements stressants que vous avez vécus dans la dernière année.
                  </p>
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {holmesRaheEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedEvents.includes(event.id) 
                              ? 'bg-mental-100 text-mental-800' 
                              : 'hover:bg-mental-50'
                          }`}
                          onClick={() => toggleEvent(event.id)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{event.event}</span>
                            <span className="text-sm text-mental-500">
                              {event.points} points
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center mt-6">
                  <Button 
                    onClick={calculateScore}
                    disabled={selectedEvents.length === 0}
                  >
                    Calculer mon score de stress
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-mental-800 mb-4">
                    Résultats de votre diagnostic
                  </h2>
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xl font-semibold text-mental-700">
                            Score total : {totalScore} points
                          </p>
                        </div>
                        {resultCategory && (
                          <div>
                            <p className="font-medium text-mental-700">
                              Catégorie de risque : {resultCategory.label}
                            </p>
                            <p className="text-mental-600">
                              {resultCategory.description}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-mental-500 italic">
                            Rappel : Ce test est un indicateur, pas un diagnostic médical.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-x-4">
                    <Button onClick={handleStartOver} variant="outline">
                      Recommencer
                    </Button>
                    <Button onClick={() => window.location.href = '/diagnostic'}>
                      Retour aux diagnostics
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HolmesRaheScalePage;
