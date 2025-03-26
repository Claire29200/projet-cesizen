
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { DiagnosticQuestion } from "@/components/diagnostic/DiagnosticQuestion";
import { DiagnosticResultView } from "@/components/diagnostic/DiagnosticResult";

const DiagnosticPage = () => {
  const { questions, saveResult, getFeedbackForScore } = useDiagnosticStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [feedback, setFeedback] = useState<{ label: string; description: string } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Filtrer les questions actives uniquement
  const activeQuestions = questions
    .filter(q => q.isActive)
    .sort((a, b) => a.order - b.order);
  
  const currentQuestion = activeQuestions[currentStep];
  const progress = (currentStep / activeQuestions.length) * 100;
  
  const handleAnswer = (value: number) => {
    if (isAnimating) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    if (currentStep < activeQuestions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      calculateResults();
    }
  };
  
  const handlePrevious = () => {
    if (isAnimating) return;
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  const calculateResults = () => {
    let score = 0;
    const formattedAnswers = [];
    
    for (const question of activeQuestions) {
      const answer = answers[question.id];
      if (answer !== undefined) {
        score += question.points[answer];
        formattedAnswers.push({
          questionId: question.id,
          answer: answer
        });
      }
    }
    
    const result = {
      userId: isAuthenticated ? user?.id : null,
      totalScore: score,
      answers: formattedAnswers,
      feedbackProvided: getFeedbackForScore(score).label
    };
    
    const id = saveResult(result);
    setResultId(id);
    setTotalScore(score);
    setFeedback(getFeedbackForScore(score));
    setShowResults(true);
    
    // Afficher un toast de confirmation
    toast({
      title: "Diagnostic terminé",
      description: "Votre diagnostic de stress a été complété avec succès.",
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setResultId(null);
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
                  <span className="inline-block py-1 px-3 rounded-full bg-mental-100 text-mental-700 text-sm font-medium mb-4">
                    Diagnostic
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-mental-800 mb-4">
                    Évaluation du niveau de stress
                  </h1>
                  <p className="text-lg text-mental-600 mb-6">
                    Répondez à ces questions pour évaluer votre niveau de stress et recevoir des conseils personnalisés.
                  </p>
                  
                  <div className="w-full bg-mental-100 rounded-full h-2 mb-1">
                    <div
                      className="bg-mental-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-mental-500 mb-8">
                    Question {currentStep + 1} sur {activeQuestions.length}
                  </p>
                </div>
                
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                      {currentQuestion && (
                        <DiagnosticQuestion
                          question={currentQuestion}
                          currentAnswer={answers[currentQuestion.id]}
                          onAnswer={handleAnswer}
                        />
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={currentStep === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQuestion?.id] === undefined}
                  >
                    {currentStep < activeQuestions.length - 1 ? (
                      <>
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Voir les résultats"
                    )}
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
                {feedback && (
                  <DiagnosticResultView
                    totalScore={totalScore}
                    maxScore={activeQuestions.length * 4}
                    feedback={feedback}
                    resultId={resultId}
                    onStartOver={handleStartOver}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiagnosticPage;
