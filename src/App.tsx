import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { ProjectDetail } from './pages/ProjectDetail';
import { Dashboard } from './pages/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';

import { seedFirestore } from './lib/seedData';

export default function App() {
  React.useEffect(() => {
    seedFirestore();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 selection:text-blue-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookmarks" element={<Dashboard />} />
          </Routes>
          <ChatAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}
