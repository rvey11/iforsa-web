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

const imageSuggestions = {
  Emploi: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200',
  ANAPEC: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1200',
  France: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200',
  Alwadifa: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200',
  Immigration: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200',
  Sport: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200',
  Stage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200'
};

const AdminPanel = ({ posts, setPosts, messages = [], setMessages }) => {
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

  const handleDraftHelp = () => {
    const locationText = form.location || 'Maroc';
    const categoryText = form.category || 'Emploi';
    const titleBase = form.title || `Nouvelle opportunite ${categoryText} a ${locationText}`;

    setForm({
      ...form,
      title: titleBase.includes('2026') ? titleBase : `${titleBase} - Postulez maintenant`,
      image: form.image || imageSuggestions[categoryText] || imageSuggestions.Emploi,
      description: form.description || `Une nouvelle opportunite ${categoryText.toLowerCase()} est disponible a ${locationText}. Cette annonce s'adresse aux candidats motives qui souhaitent rejoindre une structure serieuse et developper leur carriere.`,
      requirements: form.requirements || "Profil motive, bon sens de l'organisation, capacite d'apprentissage, respect des delais et envie d'evoluer dans un environnement professionnel.",
      link: form.link || '#'
    });
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

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter((message) => message.id !== messageId));
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
          <button onClick={handleDraftHelp} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black hover:bg-slate-700 transition">
            AIDE IA: AMELIORER LE TEXTE + IMAGE
          </button>
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
          <h2 className="text-3xl font-black">Messages contact</h2>
          <span className="text-sm font-bold text-slate-500">{messages.length} messages</span>
        </div>

        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-xl p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="font-black text-slate-900">{message.name}</p>
                    <a href={`mailto:${message.email}`} className="text-sm font-bold text-emerald-700">{message.email}</a>
                    <p className="text-xs text-slate-400 mt-1">{message.date}</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(message.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-black transition">
                    Archiver
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4 whitespace-pre-wrap">{message.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-xl p-8 bg-slate-50 text-center">
            <p className="font-bold text-slate-500">Aucun message pour le moment.</p>
          </div>
        )}
      </section>

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
