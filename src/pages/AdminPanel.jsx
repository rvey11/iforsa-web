import React, { useState } from 'react';
import ViralPoster from '../components/ViralPosterGenerator';

const emptyForm = {
  title: '',
  category: 'Emploi',
  image: '',
  location: '',
  description: '',
  requirements: '',
  link: ''
};

const AdminPanel = ({ posts, setPosts }) => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('Ajoute un titre avant de publier.');
      return;
    }

    if (editingId) {
      setPosts(posts.map((post) => (
        post.id === editingId
          ? {
              ...post,
              ...form,
              image: form.image || 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800',
              requirements: form.requirements || "Consultez l'annonce pour les criteres detailles.",
              link: form.link || '#'
            }
          : post
      )));
      resetForm();
      alert('Article modifie !');
      return;
    }

    const newPost = {
      ...form,
      id: Date.now(),
      date: "A l'instant",
      trending: true,
      image: form.image || 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800',
      requirements: form.requirements || "Consultez l'annonce pour les criteres detailles.",
      link: form.link || '#'
    };

    setPosts([newPost, ...posts]);
    resetForm();
    alert('Publie !');
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      category: post.category || 'Emploi',
      image: post.image || '',
      location: post.location || '',
      description: post.description || '',
      requirements: post.requirements || '',
      link: post.link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (postId, postTitle) => {
    const confirmed = window.confirm(`Supprimer "${postTitle}" ?`);

    if (!confirmed) {
      return;
    }

    setPosts(posts.filter((post) => post.id !== postId));

    if (editingId === postId) {
      resetForm();
    }
  };

  if (!auth) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-black mb-6">Admin Access</h1>
          <input
            type="password"
            className="w-full p-4 bg-slate-100 rounded-xl mb-4"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
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

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Admin iForsa</p>
          <h1 className="text-4xl font-black">{editingId ? 'Modifier article' : 'Nouvel article'}</h1>
        </div>
        {editingId && (
          <button onClick={resetForm} className="self-start sm:self-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition">
            Annuler
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <input value={form.title} className="w-full p-4 border rounded-xl" placeholder="Titre" onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select value={form.category} className="w-full p-4 border rounded-xl" onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Emploi</option>
            <option>ANAPEC</option>
            <option>France</option>
            <option>Alwadifa</option>
            <option>Immigration</option>
            <option>Sport</option>
            <option>Stage</option>
          </select>
          <input value={form.image} className="w-full p-4 border rounded-xl" placeholder="Image URL" onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input value={form.location} className="w-full p-4 border rounded-xl" placeholder="Ville" onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input value={form.link} className="w-full p-4 border rounded-xl" placeholder="Lien de candidature" onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <textarea value={form.description} className="w-full p-4 border rounded-xl h-32" placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea value={form.requirements} className="w-full p-4 border rounded-xl h-28" placeholder="Criteres / profil recherche" onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <button onClick={handleSubmit} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition">
            {editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'PUBLIER SUR IFORSA'}
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">Apercu Miniature</h3>
          <ViralPoster title={form.title || "Titre de l'offre"} image={form.image || 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800'} category={form.category} />
        </div>
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-black">Articles publies</h2>
          <span className="text-sm font-bold text-slate-500">{posts.length} articles</span>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 bg-white">
              <div className="min-w-0">
                <p className="font-black text-slate-900 truncate">{post.title}</p>
                <p className="text-sm font-semibold text-slate-500">{post.category} - {post.location || 'Maroc'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(post)}
                  className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-black transition"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-black transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
