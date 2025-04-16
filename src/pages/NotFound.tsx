
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <div className="text-8xl font-bold text-mental-800 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-mental-700 mb-4">Page non trouvée</h1>
          <p className="text-mental-600 mb-8 max-w-md mx-auto">
            Nous sommes désolés, mais la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
