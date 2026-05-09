import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, CheckCircle, Mail, Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import Hero from '../components/Hero';

const CATEGORIES = ['Tout', 'Trending', 'Emploi', 'ANAPEC', 'Alwadifa', 'Immigration', 'Sport', 'Stage', 'France'];

const Home = ({ posts, onContactSubmit }) => {
  const [activeCat, setActiveCat] = useState('Tout');
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const filter = params.get('filter');
    const matchingCategory = CATEGORIES.find((category) => category.toLowerCase() === filter?.toLowerCase());

    if (matchingCategory) {
      setActiveCat(matchingCategory);
    }

    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCat === 'Trending') {
      result = posts.filter((post) => post.trending);
    } else if (activeCat !== 'Tout') {
      result = posts.filter((post) => post.category === activeCat);
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((post) => {
        const searchableText = [
          post.title,
          post.description || post.desc,
          post.requirements,
          post.location,
          post.category
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    return result;
  }, [activeCat, searchTerm, posts]);

  const trendingCount = posts.filter((post) => post.trending).length;
  const totalJobs = posts.length;

  const handleContactSubmit = (event) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus('Remplis tous les champs avant envoyer.');
      return;
    }

    onContactSubmit(contactForm);
    setContactForm({ name: '', email: '', message: '' });
    setContactStatus('Message enregistre dans cette version demo. Pour recevoir les vrais messages visiteurs, il faut connecter une base de donnees.');
  };

  return (
    <main className="pb-12">
      <Hero featuredPost={posts[0]} />

      <section className="max-w-7xl mx-auto px-4 mt-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: 'Offres', value: totalJobs },
            { icon: TrendingUp, label: 'Trending', value: trendingCount },
            { icon: Users, label: 'Candidats', value: '1.2K+' },
            { icon: Users, label: 'Entreprises', value: '150+' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200"
              >
                <Icon className="text-emerald-600 mb-3" size={24} />
                <p className="text-slate-600 text-sm font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="opportunities" className="max-w-7xl mx-auto px-4 mb-8 scroll-mt-24">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une offre d'emploi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeCat === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {searchTerm ? `Resultats pour "${searchTerm}"` : activeCat === 'Tout' ? 'Toutes les offres' : activeCat}
            </h2>
            <p className="text-slate-500 mt-1">{filteredPosts.length} opportunite{filteredPosts.length !== 1 ? 's' : ''} trouvee{filteredPosts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <OpportunityCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-500">Aucune offre trouvee</p>
            <p className="text-slate-400 mt-2">Essayez une autre recherche ou categorie</p>
          </motion.div>
        )}
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 mt-20 scroll-mt-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
          <div className="rounded-3xl bg-slate-950 text-white p-8 md:p-10">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 text-emerald-300 px-4 py-2 rounded-full text-xs font-black uppercase mb-6">
              <Sparkles size={15} />
              Pourquoi iForsa
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Des opportunites utiles, rapides a parcourir.</h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              iForsa rassemble les offres d'emploi, concours, stages et opportunites importantes au Maroc dans une interface simple a consulter chaque jour.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {['Offres triees', 'Recherche rapide', 'Liens directs'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <CheckCircle size={18} className="text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50 p-8 md:p-10">
            <Bell className="text-emerald-700 mb-5" size={34} />
            <h3 className="text-2xl font-black text-slate-900 mb-3">Astuce</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              Utilise le filtre Trending pour voir rapidement les annonces urgentes ou populaires, puis ouvre chaque article pour postuler depuis la source officielle.
            </p>
            <button
              onClick={() => {
                setActiveCat('Trending');
                document.querySelector('#opportunities')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-black transition"
            >
              <TrendingUp size={18} />
              Voir les tendances
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-4 mt-16 scroll-mt-24">
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-8 md:p-10 shadow-sm grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Contact</h2>
            <p className="text-slate-600 leading-relaxed mb-6">Une question, une offre a publier, ou une correction a demander ? Le formulaire est pret; il faudra connecter une base de donnees pour recevoir les vrais messages visiteurs dans l'admin.</p>
            <a href="mailto:contact@iforsa.ma" className="inline-flex items-center gap-3 text-emerald-700 font-black">
              <Mail size={18} />
              contact@iforsa.ma
            </a>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full p-4 border rounded-xl focus:outline-none focus:border-emerald-500"
                placeholder="Nom"
              />
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full p-4 border rounded-xl focus:outline-none focus:border-emerald-500"
                placeholder="Gmail / Email"
              />
            </div>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full p-4 border rounded-xl h-32 focus:outline-none focus:border-emerald-500"
              placeholder="Message"
            />
            <button className="inline-flex items-center justify-center gap-3 bg-slate-950 text-white px-7 py-4 rounded-full font-black hover:bg-emerald-700 transition">
              <Mail size={18} />
              Envoyer le message
            </button>
            {contactStatus && <p className="text-sm font-bold text-emerald-700">{contactStatus}</p>}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
