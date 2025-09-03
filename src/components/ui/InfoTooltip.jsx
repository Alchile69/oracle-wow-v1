// src/components/ui/InfoTooltip.jsx
// Composant tooltip informatif pour les indicateurs

import React, { useState } from 'react';

/**
 * Composant InfoTooltip - Affiche une info-bulle au survol
 * @param {string} content - Contenu du tooltip
 * @param {string} position - Position du tooltip (top, bottom, left, right)
 * @param {string} className - Classes CSS additionnelles
 */
const InfoTooltip = ({ 
  content, 
  position = 'top', 
  className = '',
  size = 'small'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const tooltipStyles = {
    container: {
      position: 'relative',
      display: 'inline-block',
      cursor: 'help'
    },
    
    icon: {
      width: size === 'small' ? '14px' : '16px',
      height: size === 'small' ? '14px' : '16px',
      borderRadius: '50%',
      background: 'rgba(156, 163, 175, 0.3)',
      border: '1px solid rgba(156, 163, 175, 0.5)',
      color: '#9ca3af',
      fontSize: size === 'small' ? '10px' : '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      marginLeft: '4px'
    },
    
    iconHover: {
      background: 'rgba(0, 255, 136, 0.2)',
      borderColor: '#00ff88',
      color: '#00ff88'
    },
    
    tooltip: {
      position: 'absolute',
      zIndex: 1000,
      padding: '8px 12px',
      background: 'rgba(17, 24, 39, 0.95)',
      border: '1px solid rgba(0, 255, 136, 0.3)',
      borderRadius: '6px',
      color: '#ffffff',
      fontSize: '12px',
      lineHeight: '1.4',
      maxWidth: '250px',
      whiteSpace: 'pre-wrap',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'all 0.2s ease',
      pointerEvents: 'none'
    }
  };
  
  // Positionnement du tooltip
  const getTooltipPosition = () => {
    const basePosition = {
      ...tooltipStyles.tooltip
    };
    
    switch (position) {
      case 'top':
        return {
          ...basePosition,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '4px'
        };
      case 'bottom':
        return {
          ...basePosition,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '4px'
        };
      case 'left':
        return {
          ...basePosition,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '4px'
        };
      case 'right':
        return {
          ...basePosition,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '4px'
        };
      default:
        return basePosition;
    }
  };
  
  return (
    <div 
      className={`info-tooltip-container ${className}`}
      style={tooltipStyles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div 
        style={{
          ...tooltipStyles.icon,
          ...(isVisible ? tooltipStyles.iconHover : {})
        }}
      >
        ?
      </div>
      
      <div style={getTooltipPosition()}>
        {content}
      </div>
    </div>
  );
};

/**
 * Définitions des tooltips pour les indicateurs financiers
 */
export const INDICATOR_TOOLTIPS = {
  pe: `P/E Ratio (Price-to-Earnings)
  
Mesure la valorisation d'une action par rapport à ses bénéfices.

• Calcul: Prix de l'action ÷ Bénéfice par action
• Interprétation:
  - P/E < 15: Potentiellement sous-évalué
  - P/E 15-25: Valorisation raisonnable
  - P/E > 25: Potentiellement surévalué

Plus le P/E est bas, plus l'action peut être attractive.`,

  roe: `ROE (Return on Equity)
  
Mesure l'efficacité avec laquelle une entreprise génère des profits à partir des capitaux propres.

• Calcul: Bénéfice net ÷ Capitaux propres × 100
• Interprétation:
  - ROE > 20%: Excellent
  - ROE 15-20%: Bon
  - ROE 10-15%: Moyen
  - ROE < 10%: Faible

Un ROE élevé indique une gestion efficace du capital.`,

  rsi: `RSI (Relative Strength Index)
  
Indicateur technique qui mesure la vitesse et l'ampleur des mouvements de prix.

• Échelle: 0 à 100
• Interprétation:
  - RSI > 70: Zone de surachat (potentielle vente)
  - RSI 30-70: Zone neutre
  - RSI < 30: Zone de survente (potentiel achat)

Aide à identifier les points d'entrée et de sortie.`,

  score: `Score Composite Pondéré
  
Score global calculé à partir de 4 dimensions:

• Fondamental (40%): P/E, ROE, Debt/Equity
• Macro (25%): Rating du pays, stabilité économique
• Technique (15%): RSI, moyennes mobiles
• Sectoriel (20%): Performance relative du secteur

• Échelle: 0 à 100
• Classification:
  - 80-100: Excellent
  - 70-79: Bon
  - 60-69: Moyen
  - 40-59: Faible
  - 0-39: Très faible`,

  price: `Prix et Variation
  
Prix actuel de l'action et sa variation sur la période.

• Prix: Cours de clôture le plus récent
• Variation: Changement en pourcentage depuis la dernière séance

• Couleurs:
  - Vert: Variation positive (+)
  - Rouge: Variation négative (-)

Indicateur de la performance récente de l'action.`,

  sector: `Secteur d'Activité
  
Classification de l'entreprise selon son activité principale.

• Secteurs représentés:
  - Technology: Technologie et innovation
  - Financials: Services financiers et banques
  - Healthcare: Santé et pharmaceutique
  - Consumer Discretionary: Biens de consommation non essentiels
  - Consumer Staples: Biens de consommation essentiels
  - Materials: Matières premières et mining
  - Energy: Énergie et pétrole

Permet de diversifier et comparer les performances sectorielles.`,

  country: `Pays et Rating
  
Pays de domiciliation de l'entreprise avec son rating économique.

• Rating pays (sur 100):
  - 90-100: Très stable (Suisse, Allemagne)
  - 80-89: Stable (États-Unis, Australie)
  - 70-79: Modéré (France, Royaume-Uni)
  - 60-69: Risqué (Chine, Taiwan)

Le rating pays influence le score macro de l'actif.`
};

export default InfoTooltip;

