/**
 * @file App-minimal.jsx
 * @description Version minimale pour diagnostiquer l'erreur
 */

import React, { useState, useEffect } from 'react';
import { CountryProvider } from './contexts/CountryContext';
import Dashboard from './components/layout/Dashboard';
import LoginModal from './components/auth/LoginModal';
import ExtensibleConfigurationPanel from './components/admin/ExtensibleConfigurationPanel';
import PluginWizard from './components/admin/PluginWizard';
import SectorsModule from './components/sectors/SectorsModule';

// Import des composants portfolio
import PortfolioKPICards from './components/portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './components/portfolio/AssetAllocationPieChart';
import ScreeningTable from './components/screening/ScreeningTable';
import { ToastContainer, useToast } from './components/ui/ToastNotification';
import pluginSystem from './utils/PluginSystem';

// Import des styles globaux
import './App.css';
import './styles/responsive.css';
import './styles/responsive-enhanced.css';
import './styles/glassmorphism.css';
import './styles/animations.css';
import './styles/enhanced-animations.css';
import './styles/screening-table.css';

/**
 * Composant principal de l'application
 */
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPluginWizard, setShowPluginWizard] = useState(false);
  const [wizardType, setWizardType] = useState('');
  
  const toast = useToast();
  const appVersion = "Oracle Portfolio Real-time market data and portfolio analysis";

  // Initialisation des plugins
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        console.log('🔌 Initialisation du système de plugins...');
        await pluginSystem.initialize();
        console.log('🎉 Système de plugins initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des plugins:', error);
        if (toast && toast.error) {
          toast.error('Erreur lors de l\'initialisation des plugins');
        }
      }
    };

    initializePlugins();
  }, [toast]);

  // Gestionnaires d'événements
  const handleViewChange = (view) => {
    console.log(`🔄 Changement de vue: ${currentView} → ${view}`);
    setCurrentView(view);
  };

  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
    setShowLoginModal(false);
    
    if (authenticated && toast && toast.success) {
      toast.success('Connexion réussie !');
    } else if (!authenticated && toast && toast.info) {
      toast.info('Déconnexion effectuée');
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handlePluginWizard = (type) => {
    setWizardType(type);
    setShowPluginWizard(true);
  };

  // Rendu du contenu principal
  const renderMainContent = () => {
    try {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard />;
          
        case 'analytics':
          return (
            <div className="analytics-view">
              <PortfolioKPICards />
              <AssetAllocationPieChart />
              <ScreeningTable />
            </div>
          );
          
        case 'sectors':
          return <SectorsModule />;
          
        case 'configuration':
          return (
            <ExtensibleConfigurationPanel 
              onPluginWizard={handlePluginWizard}
            />
          );
          
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('❌ Erreur dans renderMainContent:', error);
      return (
        <div className="error-fallback">
          <h2>⚠️ Erreur de rendu</h2>
          <p>Une erreur s'est produite lors du rendu du contenu.</p>
          <pre>{error.message}</pre>
          <button onClick={() => window.location.reload()}>
            🔄 Recharger la page
          </button>
        </div>
      );
    }
  };

  return (
    <CountryProvider>
      <div className="App">
        {/* En-tête simplifié */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">🔮</div>
              <div className="app-info">
                <h1>Oracle Portfolio</h1>
                <div className="version">v3.0.0</div>
              </div>
            </div>
            
            <div className="header-description">
              {appVersion}
            </div>
            
            <div className="header-actions">
              <button 
                className="auth-button"
                onClick={handleLoginClick}
              >
                {isAuthenticated ? '👤 Profil' : '🔐 Connexion'}
              </button>
            </div>
          </div>
        </header>

        {/* Navigation principale */}
        <nav className="main-navigation">
          <div className="nav-container">
            <div className="nav-primary">
              <button 
                className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleViewChange('dashboard')}
              >
                📊 Dashboard
              </button>
              <button 
                className={`nav-button ${currentView === 'sectors' ? 'active' : ''}`}
                onClick={() => handleViewChange('sectors')}
              >
                🏢 Secteurs
              </button>
              <button 
                className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => handleViewChange('analytics')}
              >
                📈 Analytics
              </button>
              <button 
                className={`nav-button ${currentView === 'configuration' ? 'active' : ''}`}
                onClick={() => handleViewChange('configuration')}
              >
                ⚙️ Configuration
              </button>
            </div>
            
            <div className="nav-secondary">
              <button 
                className="premium-button"
                onClick={handleLoginClick}
              >
                Get Full Access
              </button>
            </div>
          </div>
        </nav>

        {/* Contenu principal avec gestion d'erreur */}
        <main className="main-content">
          {renderMainContent()}
        </main>

        {/* Footer simplifié */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">🔮</div>
              <div className="footer-info">
                <div className="footer-title">Oracle Portfolio v3.0</div>
                <div className="footer-subtitle">Système Extensible</div>
              </div>
            </div>
            
            <div className="footer-right">
              <div className="footer-stats">
                🔌 Plugins actifs: {pluginSystem ? pluginSystem.getActivePluginsCount() : 0}
              </div>
              <div className="footer-copyright">
                © 2025 Scalabla Group. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onAuthenticate={handleAuthentication}
          />
        )}

        {showPluginWizard && (
          <PluginWizard 
            type={wizardType}
            onClose={() => setShowPluginWizard(false)}
          />
        )}

        {/* Container pour les notifications toast */}
        <ToastContainer />
      </div>
    </CountryProvider>
  );
}

export default App;

