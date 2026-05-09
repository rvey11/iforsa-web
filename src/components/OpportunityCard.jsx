import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const OpportunityCard = ({ post, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="group bg-white rounded-3xl border-2 border-slate-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-500"
  >
    <Link to={`/opportunity/${post.id}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
          {post.category}
        </div>
        {post.trending && (
          <motion.div 
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs font-black"
          >
            <Zap size={12} />
            TRENDING
          </motion.div>
        )}
      </div>
      <div className="p-6 flex flex-col h-[200px]">
        <h2 dir="auto" className="text-lg font-bold leading-tight group-hover:text-emerald-600 transition-colors mb-3 line-clamp-3 flex-1">
          {post.title}
        </h2>
        <p dir="auto" className="text-sm text-slate-600 mb-4 line-clamp-2 hidden md:block">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-500 uppercase">
             <span className="flex items-center gap-1.5 text-slate-600"><MapPin size={14}/> {post.location}</span>
             <span className="flex items-center gap-1.5 text-slate-600"><Clock size={14}/> {post.date}</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-white transition-all shadow-md"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default OpportunityCard;
