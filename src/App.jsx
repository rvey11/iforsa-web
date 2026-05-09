import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

    return parsedPosts.map(normalizePost);
  } catch {
    return INITIAL_POSTS;
  }
};

const loadInitialMessages = () => {
  const savedMessages = localStorage.getItem('iforsa_messages');

  if (!savedMessages) {
    return [];
  }

  try {
    const parsedMessages = JSON.parse(savedMessages);
    return Array.isArray(parsedMessages) ? parsedMessages : [];
  } catch {
    return [];
  }
};

function App() {
  // State to hold all posts. 
  // It tries to load from LocalStorage first, otherwise uses INITIAL_POSTS
  const [posts, setPosts] = useState(loadInitialPosts);
  const [messages, setMessages] = useState(loadInitialMessages);

  // Automatically save to LocalStorage whenever the 'posts' array changes
  useEffect(() => {
    localStorage.setItem('iforsa_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('iforsa_messages', JSON.stringify(messages));
  }, [messages]);

  const handleContactSubmit = (message) => {
    setMessages((currentMessages) => [
      {
        ...message,
        id: Date.now(),
        date: new Date().toLocaleString()
      },
      ...currentMessages
    ]);
  };

  return (
    <Router basename={routerBasename}>
      <div className="min-h-screen bg-white">
        {/* The Navbar stays visible on all pages */}
        <Navbar />
        
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<Home posts={posts} onContactSubmit={handleContactSubmit} />} />

          {/* Individual Article/Job Page */}
          <Route path="/opportunity/:id" element={<ArticleDetail posts={posts} />} />

          {/* Hidden Admin Dashboard */}
          <Route 
            path="/admin-panel-4587" 
            element={<AdminPanel posts={posts} setPosts={setPosts} messages={messages} setMessages={setMessages} />} 
          />
          
          {/* Redirect to Home if path doesn't exist */}
          <Route path="*" element={<Home posts={posts} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
