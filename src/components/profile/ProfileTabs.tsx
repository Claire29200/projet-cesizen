
import { TabsContent } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { AccountActions } from "@/components/profile/AccountActions";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { DiagnosticHistory } from "@/components/profile/DiagnosticHistory";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const ProfileTabs = () => {
  const { user } = useAuthStore();

  return (
    <>
      <TabsContent value="profile" className="space-y-6">
        <PersonalInfoForm />
        <AccountActions />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-6">
        <PasswordChangeForm />
      </TabsContent>
      
      <TabsContent value="resources" className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-mental-800 dark:text-white mb-2">Mes ressources personnelles</h2>
              <p className="text-mental-600 dark:text-gray-300">
                Créez et gérez vos ressources sur la santé mentale
              </p>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link to="/mes-ressources">
                <Plus className="h-4 w-4 mr-2" />
                Gérer mes ressources
              </Link>
            </Button>
          </div>
          
          <p className="text-mental-700 dark:text-gray-300">
            Accédez à toutes vos ressources créées et partagez votre expertise en santé mentale. 
            Vous pouvez créer de nouvelles ressources, modifier vos ressources existantes ou les supprimer.
          </p>
          
          {user && (
            <div className="mt-4">
              <Button variant="outline" asChild className="mt-4">
                <Link to="/mes-ressources">
                  Voir toutes mes ressources
                </Link>
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="diagnostics" className="space-y-6">
        <DiagnosticHistory />
      </TabsContent>
    </>
  );
};
