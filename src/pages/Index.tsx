
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, Info, HeartPulse, Brain, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { useContentStore } from "@/store/contentStore";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { infoPages } = useContentStore();
  
  // Featured articles
  const featuredArticles = infoPages
    .filter(page => page.isPublished)
    .slice(0, 3);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-mental-50 to-mental-100"></div>
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTE2IDBoMlYwSDE2djM0em0tNCAwaDJWMGgtMnYzNHptLTE2IDBoMlYwSC0xNHYzNHptOCAwaC0yVjBoMnYzNHptLTggMGgySDBIMTZ2LTJIMHYyem0zNiAwaC0yVjBoMnYzNHptLTIgMGgyVjBoLTJ2MzR6TTQ2IDBoMnYxNGgtMlYwem0wIDE4aDJ2MTZoLTJWMTh6TTIgMGgydjE0SDJWMHptMCAxOGgydjE2SDJWMTh6TTMyIDB2MThoMlYwaDJ2MThoMnYySDE2di0yaDE2em0wIDE4aC0ydi0yaDJ2MnptMi0yMEgxNnY0aDJWMGgxNHY0aDJWMHpNMzQgMnYyaC0yVjJoMnptMCAwaC0xNnYyaDJ2LTJoMTR6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-mental-200 text-mental-800 text-sm font-medium mb-4">
                  Votre bien-être est notre priorité
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-mental-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Prenez soin de votre <span className="text-mental-500">santé mentale</span> au quotidien
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-mental-700 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Des ressources, des outils et un accompagnement pour vous aider à comprendre et améliorer votre bien-être psychologique.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button asChild size="lg" className="font-medium">
                  <Link to="/diagnostic">
                    Faire un diagnostic
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/informations">
                    Découvrir nos ressources
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl p-6 shadow-sm border border-mental-100 hover:shadow-md transition-shadow"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-mental-100 text-mental-500 mb-4">
                  <Info className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-mental-800">Ressources fiables</h3>
                <p className="text-mental-600">Accédez à des informations vérifiées sur la santé mentale, les troubles et les traitements existants.</p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl p-6 shadow-sm border border-mental-100 hover:shadow-md transition-shadow"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-mental-100 text-mental-500 mb-4">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-mental-800">Diagnostic de stress</h3>
                <p className="text-mental-600">Évaluez votre niveau de stress et recevez des conseils personnalisés pour mieux le gérer.</p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl p-6 shadow-sm border border-mental-100 hover:shadow-md transition-shadow"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-mental-100 text-mental-500 mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-mental-800">Accompagnement</h3>
                <p className="text-mental-600">Trouvez des ressources pour vous orienter vers les professionnels adaptés à vos besoins.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Personalized Section */}
        {isAuthenticated && (
          <section className="py-12 bg-mental-50">
            <div className="container">
              <motion.div 
                className="bg-white rounded-xl p-8 border border-mental-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-mental-800">Bonjour, {user?.name}</h2>
                <p className="text-mental-600 mb-6">Voici votre espace personnalisé pour suivre votre bien-être mental.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-mental-700 mb-2">Diagnostic de stress</h3>
                      <p className="text-sm text-mental-500 mb-4">
                        Faites le test pour évaluer votre niveau de stress actuel
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/diagnostic">Commencer</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-mental-700 mb-2">Votre profil</h3>
                      <p className="text-sm text-mental-500 mb-4">
                        Accédez à vos informations et historique de diagnostic
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/profil">Voir mon profil</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-mental-700 mb-2">Ressources recommandées</h3>
                      <p className="text-sm text-mental-500 mb-4">
                        Explorer nos articles sur la gestion du stress
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/informations/stress">Découvrir</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>
        )}
        
        {/* Articles Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-mental-100 text-mental-700 text-sm font-medium mb-4">
                Ressources
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-mental-800 mb-4">Articles en vedette</h2>
              <p className="text-lg text-mental-600">
                Des informations fiables pour mieux comprendre et prendre soin de votre santé mentale.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="group"
                >
                  <div className="bg-mental-50 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-mental-400 text-5xl font-light group-hover:scale-110 transition-transform duration-300">
                      {article.title.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-mental-800 group-hover:text-mental-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-mental-600 mb-4 line-clamp-3">
                    {article.sections[0]?.content.substring(0, 120)}...
                  </p>
                  <Link 
                    to={`/informations/${article.slug}`}
                    className="inline-flex items-center text-mental-500 hover:text-mental-600 font-medium"
                  >
                    Lire plus <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/informations">
                  Voir toutes nos ressources
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-mental-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'aide immédiate ?</h2>
                <p className="text-mental-200 text-lg mb-8">
                  Si vous traversez une crise ou avez besoin d'un soutien urgent, n'hésitez pas à contacter les services d'aide spécialisés.
                </p>
                <div className="bg-mental-800/60 p-6 rounded-lg inline-block">
                  <div className="flex items-center justify-center mb-2">
                    <Phone className="h-6 w-6 mr-2 text-mental-300" />
                    <span className="text-2xl font-semibold">3114</span>
                  </div>
                  <p className="text-mental-300 text-sm">
                    Numéro national de prévention du suicide (24/7, gratuit)
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild variant="outline" className="bg-transparent border-white/30 hover:bg-white/10 text-white">
                    <Link to="/urgences">
                      Voir tous les numéros d'urgence
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
