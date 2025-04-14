
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { User, Lock, History, BookOpen, Eye, EyeOff, LogOut } from "lucide-react";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";

const Profile = () => {
  const { user, updateProfile, logout, changePassword } = useAuthStore();
  const { getUserResults, getFeedbackForScore } = useDiagnosticStore();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Get user's diagnostic results if they exist
  const userResults = user ? getUserResults(user.id) : [];
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      updateProfile({ name, email });
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const success = await changePassword(currentPassword, newPassword);
      
      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Succès",
          description: "Votre mot de passe a été changé avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement de mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };
  
  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-mental-800 mb-6">Mon profil</h1>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Historique diagnostics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isUpdatingProfile}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isUpdatingProfile}
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isUpdatingProfile}
                        >
                          {isUpdatingProfile ? "Mise à jour..." : "Mettre à jour"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Actions du compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Changer le mot de passe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 text-mental-400 hover:text-mental-500"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 text-mental-400 hover:text-mental-500"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 text-mental-400 hover:text-mental-500"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? "Modification..." : "Modifier le mot de passe"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="diagnostics" className="space-y-6">
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
                              {getFeedbackForScore(result.totalScore).description}
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
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      <LogoutConfirmDialog 
        isOpen={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)} 
        onConfirm={confirmLogout} 
      />
    </div>
  );
};

export default Profile;
