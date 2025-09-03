/**
 * @file App-final.jsx
 * @description Version finale fonctionnelle avec la Screening Table
 */

import React, { useState, useEffect } from 'react';

// Import des styles
import './App.css';
import './styles/responsive.css';
import './styles/glassmorphism.css';
import './styles/animations.css';
import './styles/screening-table.css';
import './styles/info-tooltip.css';

// Import du composant ScreeningTable
import ScreeningTable from './components/screening/ScreeningTable';

function App() {
  const [currentView, setCurrentView] = useState('analytics');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Gestionnaires d'événements
  const handleViewChange = (view) => {
    console.log(`🔄 Changement de vue: ${currentView} → ${view}`);
    setCurrentView(view);
  };

  const handleLoginClick = () => {
    console.log('🔐 Clic sur connexion');
    alert('Fonctionnalité de connexion en développement');
  };

  // Rendu du contenu principal
  const renderMainContent = () => {
    switch (currentView) {
      case 'analytics':
        return (
          <div className="analytics-view">
            <div style={{
              background: 'rgba(17, 24, 39, 0.95)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              margin: '20px',
              marginBottom: '10px'
            }}>
              <h2>📈 Analytics - Screening Table</h2>
              <p>Table de screening interactive avec 20 actifs internationaux</p>
            </div>
            
            {/* Composant ScreeningTable */}
            <ScreeningTable />
          </div>
        );
        
      case 'dashboard':
        return (
          <div style={{
            background: 'rgba(17, 24, 39, 0.95)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px'
          }}>
            <h2>📊 Dashboard</h2>
            <p>Vue dashboard principale</p>
            
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px'
            }}>
              <h3>🎯 Fonctionnalités disponibles :</h3>
              <ul>
                <li>✅ Screening Table (Analytics)</li>
                <li>🔄 Portfolio KPIs (en développement)</li>
                <li>🔄 Asset Allocation (en développement)</li>
                <li>🔄 Backtesting (en développement)</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return (
          <div style={{
            background: 'rgba(17, 24, 39, 0.95)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px'
          }}>
            <h2>🔮 Oracle Portfolio</h2>
            <p>Sélectionnez une vue dans la navigation</p>
          </div>
        );
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* En-tête */}
      <header style={{
        background: 'rgba(17, 24, 39, 0.95)',
        color: 'white',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>🔮</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px' }}>Oracle Portfolio</h1>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                v3.0.0 - Phase 3: Screening Table avec TanStack
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLoginClick}
            style={{
              background: 'rgba(0, 255, 136, 0.2)',
              border: '1px solid #00ff88',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 255, 136, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 255, 136, 0.2)';
            }}
          >
            {isAuthenticated ? '👤 Profil' : '🔐 Connexion'}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(31, 41, 55, 0.8)',
        padding: '12px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleViewChange('dashboard')}
            style={{
              background: currentView === 'dashboard' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
              border: currentView === 'dashboard' ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => handleViewChange('analytics')}
            style={{
              background: currentView === 'analytics' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
              border: currentView === 'analytics' ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📈 Analytics (Screening Table)
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {renderMainContent()}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(17, 24, 39, 0.95)',
        color: '#9ca3af',
        padding: '16px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        marginTop: '40px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontWeight: '600' }}>
          🔮 Oracle Portfolio v3.0 - Phase 3: Screening Table avec TanStack
        </div>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>
          © 2025 Scalabla Group. Tous droits réservés.
        </div>
        <div style={{ fontSize: '11px', marginTop: '8px', color: '#6b7280' }}>
          🎯 Fonctionnalités: Score composite pondéré • 20 actifs internationaux • Colonnes triables • Filtrage avancé
        </div>
      </footer>
    </div>
  );
}

export default App;

