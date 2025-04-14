
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { BookOpen } from "lucide-react";
import { diagnosticController } from "@/controllers/diagnosticController";
import { useEffect, useState } from "react";
import { DiagnosticResult } from "@/models/diagnostic";

export const DiagnosticHistory = () => {
  const { user } = useAuthStore();
  const { getFeedbackForScore } = useDiagnosticStore();
  const [userResults, setUserResults] = useState<DiagnosticResult[]>([]);
  
  useEffect(() => {
    // Chargement des résultats via le contrôleur si l'utilisateur est connecté
    if (user) {
      const results = diagnosticController.getUserResults(user.id);
      setUserResults(results);
    }
  }, [user]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        {userResults.length > 0 ? (
          <div className="space-y-4">
            {userResults.map((result) => (
              <div key={result.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-mental-800">
                    Diagnostic de stress
                  </h3>
                  <span className="text-sm text-mental-500">
                    {new Date(result.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-mental-100 text-mental-700 text-sm rounded-full">
                    Score: {result.totalScore}
                  </span>
                  <span className="font-medium text-mental-700">
                    {result.feedbackProvided}
                  </span>
                </div>
                <p className="text-sm text-mental-600">
                  {result.feedbackDescription || getFeedbackForScore(result.totalScore).description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-mental-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-mental-700">
              Aucun diagnostic réalisé
            </h3>
            <p className="text-mental-500 mt-2 mb-6">
              Vous n'avez pas encore réalisé de diagnostic de stress.
            </p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.href = "/diagnostic"}>
              Faire un diagnostic
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
