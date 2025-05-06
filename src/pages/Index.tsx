
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/store/auth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MigrateContentHome } from "@/components/MigrateContentHome";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated) {
      setShowLoginOptions(true);
    } else {
      setShowLoginOptions(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 content-section depth-effect"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Bienvenue sur CESIZen
            </h1>
            <p className="text-xl text-mental-600 max-w-3xl mx-auto">
              Votre espace pour évaluer et améliorer votre bien-être mental au quotidien.
            </p>
          </motion.div>
          
          {isAuthenticated && <MigrateContentHome />}
          
          {showLoginOptions && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-12 content-section wave-animation"
            >
              <p className="text-lg mb-8">
                N'hésitez pas à parcourir nos ressources sur la santé mentale dans la page Informations.
              </p>
              <div className="space-x-4">
                <Button asChild variant="outline" className="backdrop-blur-sm bg-white/40 border-white/30 hover:bg-white/60">
                  <Link to="/connexion">Se connecter</Link>
                </Button>
                <Button asChild className="turquoise-glow bg-gradient-to-r from-ocean-500 to-aqua-400 hover:from-ocean-600 hover:to-aqua-500">
                  <Link to="/inscription">S'inscrire</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
