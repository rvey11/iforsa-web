import React, { useState } from 'react';
import ViralPoster from '../components/ViralPosterGenerator';

const AdminPanel = ({ posts, setPosts }) => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Emploi',
    image: '',
    location: '',
    description: '',
    requirements: '',
    link: ''
  });

  if (!auth) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-black mb-6">Admin Access</h1>
          <input 
            type="password" 
            className="w-full p-4 bg-slate-100 rounded-xl mb-4" 
            placeholder="Password"
            onChange={e => setPass(e.target.value)}
          />
          <button 
            onClick={() => pass === 'forsa2026' && setAuth(true)}
            className="w-full bg-black text-white p-4 rounded-xl font-bold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    const newPost = {
      ...form,
      id: Date.now(),
      date: 'À l\'instant',
      trending: true,
      image: form.image || 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800',
      requirements: form.requirements || "Consultez l'annonce pour les critères détaillés.",
      link: form.link || '#'
    };
    setPosts([newPost, ...posts]);
    alert("Publié !");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-4xl font-black mb-8">Nouvel article</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <input className="w-full p-4 border rounded-xl" placeholder="Titre" onChange={e => setForm({...form, title: e.target.value})} />
          <select className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, category: e.target.value})}>
             <option>Emploi</option><option>ANAPEC</option><option>France</option><option>Alwadifa</option>
          </select>
          <input className="w-full p-4 border rounded-xl" placeholder="Image URL" onChange={e => setForm({...form, image: e.target.value})} />
          <input className="w-full p-4 border rounded-xl" placeholder="Ville" onChange={e => setForm({...form, location: e.target.value})} />
          <input className="w-full p-4 border rounded-xl" placeholder="Lien de candidature" onChange={e => setForm({...form, link: e.target.value})} />
          <textarea className="w-full p-4 border rounded-xl h-32" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
          <textarea className="w-full p-4 border rounded-xl h-28" placeholder="Critères / profil recherché" onChange={e => setForm({...form, requirements: e.target.value})} />
          <button onClick={handlePublish} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-black shadow-lg shadow-emerald-200">
            PUBLIER SUR IFORSA
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">Aperçu Miniature (TikTok Style)</h3>
          <ViralPoster title={form.title || "Titre de l'offre"} image={form.image || "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800"} category={form.category} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
