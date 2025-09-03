// src/components/screening/ScoreBar.jsx
// Composant de barre de score visuelle avec gradient coloré

import React from 'react';

/**
 * Composant ScoreBar - Affiche une barre de score colorée avec gradient
 * @param {number} score - Score entre 0 et 100
 * @param {number} width - Largeur de la barre en pixels (défaut: 100)
 * @param {number} height - Hauteur de la barre en pixels (défaut: 20)
 * @param {boolean} showValue - Afficher la valeur numérique (défaut: true)
 * @param {string} className - Classes CSS additionnelles
 */
const ScoreBar = ({ 
  score, 
  width = 100, 
  height = 20, 
  showValue = true, 
  className = '',
  animated = true 
}) => {
  // Normalisation du score entre 0 et 100
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  
  // Détermination de la couleur basée sur le score
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#10b981', text: '#ffffff' }; // Vert excellent
    if (score >= 70) return { bg: '#84cc16', text: '#ffffff' }; // Vert lime bon
    if (score >= 60) return { bg: '#eab308', text: '#000000' }; // Jaune moyen
    if (score >= 40) return { bg: '#f97316', text: '#ffffff' }; // Orange faible
    return { bg: '#ef4444', text: '#ffffff' }; // Rouge très faible
  };
  
  // Génération du gradient basé sur le score
  const getGradientColor = (score) => {
    if (score >= 80) return 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
    if (score >= 70) return 'linear-gradient(90deg, #84cc16 0%, #a3e635 100%)';
    if (score >= 60) return 'linear-gradient(90deg, #eab308 0%, #fbbf24 100%)';
    if (score >= 40) return 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)';
  };
  
  const colors = getScoreColor(normalizedScore);
  const gradient = getGradientColor(normalizedScore);
  
  // Styles pour la barre
  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#1f2937', // Fond sombre
    borderRadius: `${height / 2}px`,
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };
  
  const barStyle = {
    width: `${normalizedScore}%`,
    height: '100%',
    background: gradient,
    borderRadius: `${height / 2}px`,
    transition: animated ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
    position: 'relative',
    boxShadow: normalizedScore > 0 ? `0 0 ${height / 2}px ${colors.bg}40` : 'none'
  };
  
  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: `${Math.max(10, height * 0.6)}px`,
    fontWeight: '600',
    color: normalizedScore > 50 ? colors.text : '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    whiteSpace: 'nowrap'
  };
  
  // Effet de brillance pour les scores élevés
  const shineStyle = normalizedScore >= 70 ? {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    animation: animated ? 'shine 2s infinite' : 'none'
  } : {};
  
  return (
    <div className={`score-bar-container ${className}`}>
      <div style={containerStyle}>
        {/* Barre de score */}
        <div style={barStyle}>
          {/* Effet de brillance */}
          {normalizedScore >= 70 && <div style={shineStyle} />}
        </div>
        
        {/* Valeur numérique */}
        {showValue && (
          <div style={textStyle}>
            {normalizedScore.toFixed(1)}
          </div>
        )}
      </div>
      
      {/* Styles CSS pour l'animation */}
      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        
        .score-bar-container {
          display: inline-block;
        }
        
        .score-bar-container:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

/**
 * Composant ScoreBarMini - Version compacte pour les tableaux
 */
export const ScoreBarMini = ({ score, className = '' }) => {
  return (
    <ScoreBar 
      score={score}
      width={60}
      height={12}
      showValue={false}
      className={`score-bar-mini ${className}`}
      animated={false}
    />
  );
};

/**
 * Composant ScoreBarLarge - Version étendue pour les détails
 */
export const ScoreBarLarge = ({ score, label, className = '' }) => {
  return (
    <div className={`score-bar-large ${className}`}>
      {label && (
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#9ca3af',
          marginBottom: '4px'
        }}>
          {label}
        </div>
      )}
      <ScoreBar 
        score={score}
        width={200}
        height={24}
        showValue={true}
        className="score-bar-large-bar"
      />
    </div>
  );
};

/**
 * Composant ScoreBreakdown - Affiche la décomposition des scores
 */
export const ScoreBreakdown = ({ scores, weights, className = '' }) => {
  const breakdownItems = [
    { key: 'fundamental', label: 'Fondamental', weight: weights.fundamental },
    { key: 'macro', label: 'Macro', weight: weights.macro },
    { key: 'technical', label: 'Technique', weight: weights.technical },
    { key: 'sector', label: 'Sectoriel', weight: weights.sector }
  ];
  
  return (
    <div className={`score-breakdown ${className}`}>
      <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
        Décomposition du Score
      </div>
      
      {breakdownItems.map(item => (
        <div key={item.key} style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2px'
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {item.label} ({(item.weight * 100).toFixed(0)}%)
            </span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
              {(scores[item.key] || 0).toFixed(1)}
            </span>
          </div>
          <ScoreBar 
            score={scores[item.key] || 0}
            width={150}
            height={8}
            showValue={false}
            animated={false}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Utilitaire pour obtenir la classe CSS basée sur le score
 */
export const getScoreClass = (score) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 70) return 'score-good';
  if (score >= 60) return 'score-average';
  if (score >= 40) return 'score-poor';
  return 'score-very-poor';
};

/**
 * Utilitaire pour obtenir le label textuel du score
 */
export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Bon';
  if (score >= 60) return 'Moyen';
  if (score >= 40) return 'Faible';
  return 'Très Faible';
};

export default ScoreBar;

