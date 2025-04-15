
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useContentStore } from "@/store/contentStore";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { motion } from "framer-motion";
import { Users, FileText, Activity, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { infoPages } = useContentStore();
  const { getAllResults, questions } = useDiagnosticStore();
  
  // Get stats for dashboard
  const allDiagnosticResults = getAllResults();
  const publishedInfoPages = infoPages.filter(page => page.isPublished);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-mental-800 mb-2">
                    Tableau de bord
                  </h1>
                  <p className="text-lg text-mental-600">
                    Bienvenue, {user?.name}. Voici un aperçu de votre site.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pages d'informations
                      </CardTitle>
                      <FileText className="h-4 w-4 text-mental-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{publishedInfoPages.length}</div>
                      <p className="text-xs text-mental-500 mt-1">
                        {infoPages.length - publishedInfoPages.length} brouillons
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Diagnostics
                      </CardTitle>
                      <Activity className="h-4 w-4 text-mental-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allDiagnosticResults.length}</div>
                      <p className="text-xs text-mental-500 mt-1">
                        {questions.length} questions configurées
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                      <CardDescription>
                        Les derniers diagnostics réalisés
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {allDiagnosticResults.length > 0 ? (
                        <div className="space-y-4">
                          {allDiagnosticResults
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((result) => (
                              <div key={result.id} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium text-mental-800">
                                    Diagnostic #{result.id.slice(0, 8)}
                                  </div>
                                  <div className="text-sm text-mental-500">
                                    {result.userId ? `Utilisateur ID: ${result.userId}` : "Utilisateur anonyme"}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-mental-700">
                                    Score: {result.totalScore}
                                  </div>
                                  <div className="text-sm text-mental-500">
                                    {new Date(result.date).toLocaleDateString('fr-FR', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="h-12 w-12 text-mental-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-mental-700">
                            Aucun diagnostic réalisé
                          </h3>
                          <p className="text-mental-500 mt-2">
                            Les diagnostics réalisés apparaîtront ici.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
