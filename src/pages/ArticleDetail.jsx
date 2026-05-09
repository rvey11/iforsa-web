import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, ExternalLink, Share2, Heart, Briefcase, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ArticleDetail = ({ posts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === parseInt(id));
  const [isFavorite, setIsFavorite] = useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-bold"
        >
          <ArrowLeft size={20} />
          Retour
        </button>
        <div className="text-center py-12">
          <p className="text-2xl font-bold text-slate-400">Article non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 pt-24 pb-12"
    >
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-bold transition group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
        Retour aux offres
      </button>

      <article>
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="inline-block bg-emerald-100 px-4 py-2 rounded-full">
                <span className="text-xs font-black uppercase text-emerald-700">{post.category}</span>
              </div>
              {post.trending && (
                <div className="inline-block bg-red-100 px-4 py-2 rounded-full">
                  <span className="text-xs font-black uppercase text-red-700">🔥 Trending</span>
                </div>
              )}
            </div>

            <h1 dir="auto" className="text-3xl md:text-5xl font-black mb-4 leading-tight text-slate-900 break-words">
              {post.title}
            </h1>

            <div className="flex flex-col gap-3 text-slate-600 mb-6">
              <div className="flex items-center gap-2 font-bold">
                <MapPin size={20} className="text-emerald-600" />
                {post.location}
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Clock size={20} className="text-emerald-600" />
                {post.date}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition ${
                isFavorite 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>

        {/* Image */}
        <motion.img 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          src={post.image} 
          className="w-full h-96 object-cover rounded-3xl mb-12 shadow-xl"
          alt={post.title}
        />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black mb-4 text-slate-900">À propos de cette offre</h2>
              <p dir="auto" className="text-lg text-slate-700 leading-relaxed mb-8">
                {post.description}
              </p>

              <h2 className="text-3xl font-black mb-4 text-slate-900 mt-10">Ce que nous recherchons</h2>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 mb-8">
                <p dir="auto" className="text-slate-700 leading-relaxed mb-4">
                  {post.requirements}
                </p>
                <div className="space-y-3 mt-6 pt-6 border-t border-slate-300">
                  {['Professionnel(le)', 'Motivé(e)', 'Flexible'].map((trait, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                      <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                      {trait}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-3xl border-2 border-emerald-200 h-fit sticky top-24"
          >
            <div className="mb-6">
              <p className="text-sm uppercase font-black text-slate-600 mb-2">Catégorie</p>
              <p className="text-2xl font-black text-slate-900">{post.category}</p>
            </div>
            
            <div className="mb-8 pb-8 border-b-2 border-slate-200">
              <p className="text-sm uppercase font-black text-slate-600 mb-2">Localisation</p>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-600" />
                {post.location}
              </p>
            </div>
            
            <a 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-emerald-200 transition-all transform hover:-translate-y-1 mb-4"
            >
              <Briefcase size={20} />
              Postuler maintenant
            </a>
            
            <a 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold border-2 border-emerald-200 hover:bg-emerald-50 transition-all"
            >
              <ExternalLink size={18} />
              Voir l'annonce
            </a>
          </motion.div>
        </div>
      </article>
    </motion.div>
  );
};

export default ArticleDetail;
