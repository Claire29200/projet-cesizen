
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center"
      aria-label="Accueil"
    >
      <div className="w-10 h-10 rounded-full bg-ocean-500 flex items-center justify-center text-white font-semibold text-lg mr-2 shadow-md">
        <svg viewBox="0 0 100 100" width="24" height="24" className="fill-current">
          <path d="M50 10 C60 30, 80 40, 50 60 C20 40, 40 30, 50 10" strokeWidth="2" className="stroke-white"/>
        </svg>
      </div>
      <div className="font-semibold text-xl tracking-tight">
        <span className="text-ocean-500">CESI</span>
        <span className="text-aqua-400">ZEN</span>
      </div>
    </Link>
  );
}
