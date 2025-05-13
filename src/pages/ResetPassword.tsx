
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, Check, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema avec zod
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Vérifier si le token est présent dans l'URL
  useEffect(() => {
    // Le token et type sont automatiquement extraits de l'URL par Supabase dans le SDK
    const checkParams = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      
      // Si pas de session active et pas d'erreur, c'est probablement
      // parce que l'utilisateur vient d'arriver sur cette page
      if (!session && !error) {
        // On ne fait rien, l'utilisateur va remplir le formulaire
      } else if (error) {
        setError("Lien invalide ou expiré. Veuillez demander une nouvelle réinitialisation de mot de passe.");
        toast.error("Lien invalide ou expiré");
      }
    };

    checkParams();
  }, [location]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mise à jour du mot de passe
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // Réinitialisation réussie
      setIsSuccess(true);
      toast.success("Mot de passe mis à jour avec succès");
      
      // Redirection à la page de connexion après un délai
      setTimeout(() => {
        navigate("/connexion");
      }, 3000);
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", err);
      setError(err.message || "Une erreur est survenue lors de la réinitialisation du mot de passe");
      toast.error("Échec de la réinitialisation du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-mental-100"
          >
            {isSuccess ? (
              // Affichage après réinitialisation réussie
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-mental-800 mb-2">
                  Mot de passe réinitialisé !
                </h2>
                <p className="text-mental-600 mb-6">
                  Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
                </p>
              </div>
            ) : error ? (
              // Affichage en cas d'erreur
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <KeyRound className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-mental-800 mb-2">
                  Lien invalide
                </h2>
                <p className="text-mental-600 mb-6">
                  {error}
                </p>
                <Button asChild>
                  <a href="/mot-de-passe-oublie">Demander un nouveau lien</a>
                </Button>
              </div>
            ) : (
              // Formulaire de réinitialisation
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-mental-800 mb-2">
                    Nouveau mot de passe
                  </h1>
                  <p className="text-mental-600">
                    Veuillez entrer votre nouveau mot de passe
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mental-400" />
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mental-400" />
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
