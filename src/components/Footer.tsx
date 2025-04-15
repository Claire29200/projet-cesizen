
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-mental-500 flex items-center justify-center text-white font-semibold text-lg mr-2">
                SM
              </div>
              <div className="font-semibold text-xl tracking-tight text-mental-800">
                Santé<span className="text-mental-500">Mentale</span>
              </div>
            </div>
            <p className="text-mental-600 text-sm leading-relaxed">
              Plateforme dédiée à la santé mentale, offrant des informations et des outils diagnostiques pour vous aider à prendre soin de votre bien-être psychologique.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-mental-800 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/informations" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Informations
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Diagnostic
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-mental-600 hover:text-mental-500 transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-mental-800 mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-mental-600 hover:text-mental-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/urgences" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Numéros d'urgence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-mental-800 mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mentions-legales" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/conditions" className="text-mental-600 hover:text-mental-500 transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-mental-600 text-sm">
            &copy; {currentYear} Claire Simonot. Tous droits réservés.
          </p>
          <p className="text-mental-600 text-sm flex items-center">
            Conçu avec <Heart className="h-3 w-3 mx-1 text-red-500" /> pour le bien-être mental
          </p>
        </div>
      </div>
    </footer>
  );
}
