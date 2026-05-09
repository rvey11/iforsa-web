import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/Navbar';
import { INITIAL_POSTS } from './data/mockData';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const normalizePost = (post) => ({
  ...post,
  description: post.description || post.desc || '',
  requirements: post.requirements || "Consultez l'annonce pour les critères détaillés.",
  link: post.link || '#'
});

const loadInitialPosts = () => {
  const savedPosts = localStorage.getItem('iforsa_posts');

  if (!savedPosts) {
    return INITIAL_POSTS;
  }

  try {
    const parsedPosts = JSON.parse(savedPosts);

    if (!Array.isArray(parsedPosts)) {
      return INITIAL_POSTS;
    }

    const seededIds = new Set(INITIAL_POSTS.map((post) => post.id));
    const seededTitles = new Set(INITIAL_POSTS.map((post) => post.title));
    const customPosts = parsedPosts
      .map(normalizePost)
      .filter((post) => !seededIds.has(post.id) && !seededTitles.has(post.title));

    return [...INITIAL_POSTS, ...customPosts];
  } catch {
    return INITIAL_POSTS;
  }
};

function App() {
  // State to hold all posts. 
  // It tries to load from LocalStorage first, otherwise uses INITIAL_POSTS
  const [posts, setPosts] = useState(loadInitialPosts);

  // Automatically save to LocalStorage whenever the 'posts' array changes
  useEffect(() => {
    localStorage.setItem('iforsa_posts', JSON.stringify(posts));
  }, [posts]);

  return (
    <Router basename={routerBasename}>
      <div className="min-h-screen bg-white">
        {/* The Navbar stays visible on all pages */}
        <Navbar />
        
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<Home posts={posts} />} />

          {/* Individual Article/Job Page */}
          <Route path="/opportunity/:id" element={<ArticleDetail posts={posts} />} />

          {/* Hidden Admin Dashboard */}
          <Route 
            path="/admin-panel-4587" 
            element={<AdminPanel posts={posts} setPosts={setPosts} />} 
          />
          
          {/* Redirect to Home if path doesn't exist */}
          <Route path="*" element={<Home posts={posts} />} />
        </Routes>

        {/* Footer could be added here later */}
      </div>
    </Router>
  );
}

export default App;
