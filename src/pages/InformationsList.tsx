
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useContentStore } from "@/store/contentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowRight, ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";

const InformationsList = () => {
  const { infoPages } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPages = infoPages
    .filter(page => page.isPublished)
    .filter(page => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.sections.some(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-mental-100 text-mental-700 text-sm font-medium mb-4">
              Ressources
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-mental-800 mb-4">Centre d'information</h1>
            <p className="text-lg text-mental-600 mb-8">
              Explorez nos articles et ressources sur la santé mentale pour mieux comprendre et prendre soin de votre bien-être psychologique.
            </p>
            
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher des informations..."
                className="pl-10 py-6 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 text-mental-400 hover:text-mental-500"
                  onClick={() => setSearchQuery("")}
                >
                  Effacer
                </Button>
              )}
            </div>
          </motion.div>
          
          {filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Info className="h-12 w-12 text-mental-300" />
              </div>
              <h3 className="text-xl font-medium text-mental-700 mb-2">Aucun résultat trouvé</h3>
              <p className="text-mental-500 mb-6">
                Essayez de modifier vos termes de recherche ou explorez toutes nos ressources.
              </p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Voir toutes les ressources
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <div className="w-10 h-10 rounded-full bg-mental-100 flex items-center justify-center text-mental-500 group-hover:bg-mental-500 group-hover:text-white transition-colors">
                          <span className="text-xl font-light">{page.title.charAt(0)}</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-mental-800 mb-2 group-hover:text-mental-500 transition-colors">{page.title}</h2>
                      <p className="text-mental-600 mb-6 line-clamp-3 flex-grow">
                        {page.sections[0]?.content.substring(0, 120)}...
                      </p>
                      <Button asChild variant="ghost" className="justify-start p-0 text-mental-500 group-hover:text-mental-600">
                        <Link to={`/informations/${page.slug}`} className="flex items-center">
                          Lire l'article
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InformationsList;
