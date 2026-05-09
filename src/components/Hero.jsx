import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ featuredPost }) => {
  if (!featuredPost) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-20 pb-12">
      <div className="relative rounded-3xl overflow-hidden h-[550px] group">
        {/* Background with overlay */}
        <img 
          src={featuredPost.image} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={featuredPost.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
          {/* Top badges */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 w-fit"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-white">À LA UNE</span>
            </div>
            {featuredPost.trending && (
              <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Zap size={14} className="text-red-400" />
                <span className="text-xs font-bold text-red-300">TRENDING</span>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full mb-4">
                {featuredPost.category}
              </div>
              
              <h1 dir="auto" className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight max-w-3xl break-words">
                {featuredPost.title}
              </h1>
              
              <p dir="auto" className="text-slate-200 mb-6 max-w-2xl text-lg leading-relaxed">
                {featuredPost.description}
              </p>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin size={18} className="text-emerald-400" />
                  <span className="font-bold">{featuredPost.location}</span>
                </div>
                <div className="h-px bg-slate-600 hidden md:block flex-1 max-w-20"></div>
                <div className="text-slate-300 font-bold">{featuredPost.date}</div>
              </div>
              
              <Link 
                to={`/opportunity/${featuredPost.id}`}
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-white/25 transition-all w-fit group hover:bg-emerald-50"
              >
                Voir l'offre complète
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
