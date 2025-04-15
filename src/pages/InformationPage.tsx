
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { contentController } from "@/controllers/contentController";
import { InfoPage } from "@/models/content";

const InformationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<InfoPage | null>(null);
  const [prevPage, setPrevPage] = useState<InfoPage | null>(null);
  const [nextPage, setNextPage] = useState<InfoPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Utilisation du contrôleur pour récupérer les données
        const pageData = await contentController.getInfoPageBySlug(slug);
        if (!pageData) {
          navigate("/not-found");
          return;
        }
        
        setPage(pageData);
        
        // Récupération de toutes les pages pour la navigation précédente/suivante
        const allPages = await contentController.getInfoPages();
        const currentIndex = allPages.findIndex(p => p.slug === slug);
        
        if (currentIndex > 0) {
          setPrevPage(allPages[currentIndex - 1]);
        } else {
          setPrevPage(null);
        }
        
        if (currentIndex < allPages.length - 1) {
          setNextPage(allPages[currentIndex + 1]);
        } else {
          setNextPage(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la page:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
      
      window.scrollTo(0, 0);
    };
    
    fetchPage();
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mental-600 mx-auto"></div>
            <p className="text-mental-600 mt-4">Chargement de la page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!page) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-mental-500"
              asChild
            >
              <Link to="/informations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux informations
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-mental-800 mb-6">{page.title}</h1>
            
            <div className="flex items-center text-sm text-mental-500 mb-8 space-x-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(page.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Mise à jour: {new Date(page.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {page.sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-semibold text-mental-800 mb-4">{section.title}</h2>
                  {section.content.split('\n\n').map((paragraph, i) => (
                    <div key={i} className="mb-4">
                      {paragraph.includes('**') ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: paragraph
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />') 
                        }} />
                      ) : (
                        <p className="text-mental-700 leading-relaxed">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
            
            <Separator className="my-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center">
              {prevPage ? (
                <Button variant="outline" asChild>
                  <Link to={`/informations/${prevPage.slug}`} className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {prevPage.title}
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
              
              {nextPage && (
                <Button variant="outline" asChild className="mt-4 sm:mt-0">
                  <Link to={`/informations/${nextPage.slug}`} className="flex items-center">
                    {nextPage.title}
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InformationPage;
