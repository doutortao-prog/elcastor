import React, { useState, useEffect } from 'react';
import { User, CatalogType } from './types';
import { getCurrentUser, setCurrentUser } from './services/authService';
import Auth from './components/Auth';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import CatalogSelector from './components/CatalogSelector';
import ChatInterface from './components/ChatInterface';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [catalogType, setCatalogType] = useState<CatalogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCatalogType(null);
    setCurrentUser(null);
  };

  const handleCatalogSelect = (type: CatalogType) => {
      setCatalogType(type);
  };

  const handleSwitchCatalog = () => {
      setCatalogType(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spartan-blue"></div>
    </div>;
  }

  if (!user) {
    return <Auth onSuccess={handleLoginSuccess} />;
  }

  // Admin Dashboard bypasses catalog selection
  if (user.role === 'admin') {
      return (
        <Layout user={user} onLogout={handleLogout} title="Painel Administrativo">
            <AdminDashboard />
        </Layout>
      );
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout}
      title="Escolhendo a Ferramenta"
      catalogType={catalogType}
      onSwitchCatalog={handleSwitchCatalog}
    >
      {!catalogType ? (
          <CatalogSelector onSelect={handleCatalogSelect} />
      ) : (
        <ChatInterface user={user} catalogType={catalogType} />
      )}
    </Layout>
  );
}

export default App;