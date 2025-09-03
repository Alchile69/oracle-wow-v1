/**
 * @file App-debug.jsx
 * @description Version ultra-minimale pour diagnostiquer l'erreur
 */

import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>🔮 Oracle Portfolio Debug</h1>
      <p>Version de test pour diagnostiquer l'erreur</p>
      <div style={{
        background: 'rgba(17, 24, 39, 0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2>✅ Application chargée avec succès !</h2>
        <p>Si vous voyez ce message, React fonctionne correctement.</p>
      </div>
    </div>
  );
}

export default App;

