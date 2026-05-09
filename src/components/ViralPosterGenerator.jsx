import React from 'react';

const ViralPosterGenerator = ({ title, image, category }) => {
  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
      <img src={image} className="w-full h-full object-cover" alt="Poster BG" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      
      {/* Social Style Overlays */}
      <div className="absolute top-4 left-4">
        <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
          IFORSA.MA
        </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded mb-2 inline-block">
          OFFRE DISPONIBLE 🇲🇦
        </div>
        <h2 className="text-white text-3xl font-black leading-tight uppercase drop-shadow-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/90 text-xs font-bold">Postulez maintenant</span>
        </div>
      </div>
    </div>
  );
};

export default ViralPosterGenerator;