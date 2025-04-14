
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { authController } from "@/controllers/authController";
import { ProfileUpdate } from "@/models/user";

export const PersonalInfoForm = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
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
    
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Utilisateur non identifié.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdatingProfile(true);
    
    try {
      // Utilisation du contrôleur pour la logique métier
      const profileData: ProfileUpdate = { name, email };
      const { success } = await authController.updateProfile(user.id, profileData);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Votre profil a été mis à jour avec succès.",
        });
      }
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
  
  return (
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
  );
};
