import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">iForsa</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              La plateforme #1 des offres d'emploi et opportunités au Maroc. Connectez-vous avec les meilleures entreprises.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Catégories</h4>
            <ul className="space-y-3 text-sm">
              {['Emploi', 'Alwadifa', 'Immigration', 'France'].map((cat, i) => (
                <li key={i}><a href="#" className="text-slate-400 hover:text-emerald-400 transition font-medium">{cat}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Ressources</h4>
            <ul className="space-y-3 text-sm">
              {['Conseils CV', 'Guides', 'Blog', 'FAQ'].map((item, i) => (
                <li key={i}><a href="#" className="text-slate-400 hover:text-emerald-400 transition font-medium">{item}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Légal</h4>
            <ul className="space-y-3 text-sm">
              {['Conditions', 'Confidentialité', 'Cookies', 'Contact'].map((item, i) => (
                <li key={i}><a href="#" className="text-slate-400 hover:text-emerald-400 transition font-medium">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-12 mb-8">
          <div className="mb-8">
            <h4 className="font-bold mb-4 text-emerald-400">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition">
                S'abonner
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-2">Recevez les meilleures offres directement dans votre boîte mail.</p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">
            © 2026 iForsa. Tous droits réservés. | Fait avec ❤️ au Maroc
          </p>
          <p className="text-slate-500 text-xs mt-4 md:mt-0">
            Version 1.0 | Dernière mise à jour: Mai 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
