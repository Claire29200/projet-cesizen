
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { useAuthStore } from "@/store/authStore";
import { AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

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
  
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  
  const currentQuestion = sortedQuestions[currentStep];
  const progress = (currentStep / sortedQuestions.length) * 100;
  
  const handleAnswer = (value: number) => {
    if (isAnimating) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    if (currentStep < sortedQuestions.length - 1) {
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
    
    for (const question of sortedQuestions) {
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
                    Question {currentStep + 1} sur {sortedQuestions.length}
                  </p>
                </div>
                
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion?.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-medium text-mental-800 mb-6">
                          {currentQuestion?.question}
                        </h2>
                        
                        <RadioGroup
                          value={answers[currentQuestion?.id]?.toString()}
                          onValueChange={(value) => handleAnswer(parseInt(value))}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option1" />
                            <Label htmlFor="option1">Jamais</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option2" />
                            <Label htmlFor="option2">Rarement</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="option3" />
                            <Label htmlFor="option3">Parfois</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="option4" />
                            <Label htmlFor="option4">Souvent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="option5" />
                            <Label htmlFor="option5">Très souvent</Label>
                          </div>
                        </RadioGroup>
                      </motion.div>
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
                    {currentStep < sortedQuestions.length - 1 ? (
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
                        Votre niveau de stress : {feedback?.label}
                      </h2>
                      <p className="text-sm text-mental-500 mb-4">
                        Score : {totalScore} sur {sortedQuestions.length * 4}
                      </p>
                      
                      <Progress 
                        value={(totalScore / (sortedQuestions.length * 4)) * 100} 
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
                      <p className="text-mental-700">{feedback?.description}</p>
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
                  <Button variant="outline" onClick={handleStartOver}>
                    Refaire le diagnostic
                  </Button>
                  <Button onClick={() => navigate('/informations/stress')}>
                    Consulter nos ressources sur le stress
                  </Button>
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

export default DiagnosticPage;
