import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          iForsa
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-bold text-slate-700 hover:text-emerald-600 transition duration-300 relative group">
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/#about" className="font-bold text-slate-700 hover:text-emerald-600 transition duration-300 relative group">
            A propos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/#contact" className="font-bold text-slate-700 hover:text-emerald-600 transition duration-300 relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/?filter=trending#opportunities"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2 rounded-full font-bold cursor-pointer hover:shadow-lg hover:shadow-emerald-200 transition-all"
            >
              <Zap size={16} />
              <span>TRENDING</span>
            </Link>
          </motion.div>
          <a
            href="mailto:contact@iforsa.ma"
            className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center transition"
            aria-label="Email iForsa"
          >
            <Mail size={18} />
          </a>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          aria-label="Open menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2 shadow-lg"
        >
          <Link to="/" onClick={() => setIsOpen(false)} className="block font-bold py-3 px-4 hover:bg-slate-100 rounded-lg text-emerald-600 transition">Accueil</Link>
          <Link to="/#about" onClick={() => setIsOpen(false)} className="block font-bold py-3 px-4 hover:bg-slate-100 rounded-lg text-slate-700 transition">A propos</Link>
          <Link to="/#contact" onClick={() => setIsOpen(false)} className="block font-bold py-3 px-4 hover:bg-slate-100 rounded-lg text-slate-700 transition">Contact</Link>
          <Link to="/?filter=trending#opportunities" onClick={() => setIsOpen(false)} className="block font-bold py-3 px-4 bg-emerald-50 rounded-lg text-emerald-700 transition">Trending</Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
