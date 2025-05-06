
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-mental-800 mb-6">À propos de CESIZen</h1>
            
            <div className="prose prose-lg dark:prose-invert">
              <p>
                CESIZen est une plateforme dédiée à la santé mentale et au bien-être, créée pour aider les personnes à prendre soin de leur équilibre psychologique au quotidien.
              </p>
              
              <h2>Notre mission</h2>
              <p>
                Notre mission est de rendre les ressources en santé mentale accessibles à tous, de favoriser la prévention et de contribuer à réduire la stigmatisation autour des troubles psychologiques.
              </p>
              
              <h2>Notre approche</h2>
              <p>
                Nous proposons des outils de diagnostic, des informations fiables et un accompagnement adapté aux besoins de chacun. Notre approche est centrée sur l'utilisateur, avec une attention particulière portée à la confidentialité et au respect de la vie privée.
              </p>
              
              <h2>L'équipe</h2>
              <p>
                CESIZen est soutenu par une équipe pluridisciplinaire comprenant des professionnels de la santé mentale, des développeurs et des experts en expérience utilisateur. Ensemble, nous travaillons pour créer une plateforme intuitive et bienveillante.
              </p>
              
              <h2>Nous contacter</h2>
              <p>
                Pour toute question ou suggestion, n'hésitez pas à nous contacter à l'adresse contact@cesizen.fr.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
