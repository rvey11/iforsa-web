import React from 'react';
import { Briefcase, Globe, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const categoryLinks = [
    { label: 'Emploi', to: '/?filter=Emploi#opportunities' },
    { label: 'Alwadifa', to: '/?filter=Alwadifa#opportunities' },
    { label: 'Immigration', to: '/?filter=Immigration#opportunities' },
    { label: 'France', to: '/?filter=France#opportunities' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">iForsa</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              La plateforme des offres d'emploi et opportunites au Maroc. Trouvez vite les annonces importantes et postulez depuis la source.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Globe, href: 'https://facebook.com' },
                { Icon: Send, href: 'https://x.com' },
                { Icon: Briefcase, href: 'https://linkedin.com' }
              ].map(({ Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Categories</h4>
            <ul className="space-y-3 text-sm">
              {categoryLinks.map((cat) => (
                <li key={cat.label}>
                  <Link to={cat.to} className="text-slate-400 hover:text-emerald-400 transition font-medium">{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Ressources</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'A propos', to: '/#about' },
                { label: 'Trending', to: '/?filter=trending#opportunities' },
                { label: 'Toutes les offres', to: '/#opportunities' },
                { label: 'Admin', to: '/admin-panel-4587' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-400 hover:text-emerald-400 transition font-medium">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase text-sm text-emerald-400">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:contact@iforsa.ma" className="text-slate-400 hover:text-emerald-400 transition font-medium inline-flex items-center gap-2">
                  <Mail size={16} />
                  contact@iforsa.ma
                </a>
              </li>
              <li><Link to="/#contact" className="text-slate-400 hover:text-emerald-400 transition font-medium">Formulaire rapide</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">
            2026 iForsa. Tous droits reserves.
          </p>
          <p className="text-slate-500 text-xs mt-4 md:mt-0">
            Derniere mise a jour: Mai 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
