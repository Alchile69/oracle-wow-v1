/**
 * @file App.jsx
 * @description Composant principal de l'application Oracle Portfolio V3.
 * Gère la navigation, l'authentification, les plugins et l'affichage des vues.
 * @version 3.0.0
 * @date 2025-08-25
 */

import React, { useState, useEffect } from 'react';
import { CountryProvider } from './contexts/CountryContext';
import Dashboard from './components/layout/Dashboard';
import LoginModal from './components/auth/LoginModal';
import ExtensibleConfigurationPanel from './components/admin/ExtensibleConfigurationPanel';
import PluginWizard from './components/admin/PluginWizard';
import SectorsModule from './components/sectors/SectorsModule';
import EssentialsModule from './components/essentials/EssentialsModule';

// Import des composants
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
 * @returns {JSX.Element}
 */
function App() {
  // ===== ÉTATS =====
  const [currentView, setCurrentView] = useState('dashboard'); // Vue actuelle (dashboard, analytics, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Statut d'authentification
  const [showLoginModal, setShowLoginModal] = useState(false); // Affichage du modal de connexion
  const [showPluginWizard, setShowPluginWizard] = useState(false); // Affichage de l'assistant de plugins
  const [wizardType, setWizardType] = useState(''); // Type de plugin à créer
  
  // Hook pour les notifications toast
  const toast = useToast();

  // Version de l'application
  const appVersion = "Oracle Portfolio Real-time market data and portfolio analysis";

  // ===== EFFETS =====
  // Initialisation du système de plugins au chargement de l'application
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        console.log('🔌 Initialisation du système de plugins...');
        await pluginSystem.initialize();
        console.log('🎉 Système de plugins initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des plugins:', error);
        toast.error('Erreur lors de l\'initialisation des plugins');
      }
    };

    initializePlugins();
  }, [toast]);

  // ===== GESTIONNAIRES D'ÉVÉNEMENTS =====
  
  /**
   * Gestionnaire de changement de vue
   * @param {string} view - Nouvelle vue à afficher
   */
  const handleViewChange = (view) => {
    console.log(`🔄 Changement de vue: ${currentView} → ${view}`);
    setCurrentView(view);
  };

  /**
   * Gestionnaire d'authentification
   * @param {boolean} authenticated - Statut d'authentification
   */
  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
    setShowLoginModal(false);
    
    if (authenticated) {
      toast.success('Connexion réussie !');
    } else {
      toast.info('Déconnexion effectuée');
    }
  };

  /**
   * Gestionnaire d'ouverture du modal de connexion
   */
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  /**
   * Gestionnaire d'ouverture de l'assistant de plugins
   * @param {string} type - Type de plugin à créer
   */
  const handlePluginWizard = (type) => {
    setWizardType(type);
    setShowPluginWizard(true);
  };

  // ===== RENDU DES VUES =====
  
  /**
   * Rendu du contenu principal selon la vue actuelle
   * @returns {JSX.Element}
   */
  const renderMainContent = () => {
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
        
      case 'essentials':
        return <EssentialsModule />;
        
      case 'configuration':
        return (
          <ExtensibleConfigurationPanel 
            onPluginWizard={handlePluginWizard}
          />
        );
        
      default:
        return <Dashboard />;
    }
  };

  // ===== RENDU PRINCIPAL =====
  return (
    <CountryProvider>
      <div className="App">
        {/* En-tête de l'application */}
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
                className={`nav-button ${currentView === 'essentials' ? 'active' : ''}`}
                onClick={() => handleViewChange('essentials')}
              >
                🚀 Essentiels
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

        {/* Navigation mobile */}
        <nav className="mobile-navigation">
          <button 
            className={`mobile-nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`mobile-nav-button ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => handleViewChange('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`mobile-nav-button ${currentView === 'configuration' ? 'active' : ''}`}
            onClick={() => handleViewChange('configuration')}
          >
            ⚙️ Configuration
          </button>
          <button 
            className="mobile-nav-button premium"
            onClick={handleLoginClick}
          >
            Get Full Access
          </button>
        </nav>

        {/* Contenu principal */}
        <main className="main-content">
          {renderMainContent()}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">🔮</div>
              <div className="footer-info">
                <div className="footer-title">Oracle Portfolio v3.0</div>
                <div className="footer-subtitle">Système Extensible - Real-time market data and portfolio analysis</div>
              </div>
            </div>
            
            <div className="footer-right">
              <div className="footer-stats">
                🔌 Plugins actifs: {pluginSystem.getActivePluginsCount()}
              </div>
              <div className="footer-copyright">
                © 2025 Scalabla Group. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>

        {/* Modals et overlays */}
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

