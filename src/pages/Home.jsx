import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Briefcase } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard';
import Hero from '../components/Hero';

const CATEGORIES = ["Tout", "Emploi", "ANAPEC", "Alwadifa", "Immigration", "Sport", "Stage", "France"];

const Home = ({ posts }) => {
  const [activeCat, setActiveCat] = useState("Tout");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    let result = activeCat === "Tout" 
      ? posts 
      : posts.filter(p => p.category === activeCat);
    
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter(p => {
        const searchableText = [
          p.title,
          p.description || p.desc,
          p.requirements,
          p.location,
          p.category
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }
    return result;
  }, [activeCat, searchTerm, posts]);

  const trendingCount = posts.filter(p => p.trending).length;
  const totalJobs = posts.length;

  return (
    <main className="pb-12">
      <Hero featuredPost={posts[0]} />

      {/* Stats Section */}
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
                key={i}
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

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
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
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Catégories</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map(cat => (
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

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {searchTerm ? `Résultats pour "${searchTerm}"` : activeCat === "Tout" ? "Toutes les offres" : activeCat}
            </h2>
            <p className="text-slate-500 mt-1">{filteredPosts.length} opportunité{filteredPosts.length !== 1 ? 's' : ''} trouvée{filteredPosts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <OpportunityCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-500">Aucune offre trouvée</p>
            <p className="text-slate-400 mt-2">Essayez une autre recherche ou catégorie</p>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default Home;
