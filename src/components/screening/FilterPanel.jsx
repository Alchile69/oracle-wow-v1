// src/components/screening/FilterPanel.jsx
// Panneau de filtres avancés pour la table de screening

import React, { useState } from 'react';

/**
 * Composant FilterPanel - Panneau de filtres avancés
 */
const FilterPanel = ({ 
  onFiltersChange, 
  availableSectors = [], 
  availableCountries = [],
  className = '' 
}) => {
  const [filters, setFilters] = useState({
    sector: '',
    country: '',
    minScore: 0,
    maxScore: 100,
    minPE: '',
    maxPE: '',
    minROE: '',
    maxROE: ''
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Gestionnaire de changement de filtre
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  // Réinitialisation des filtres
  const resetFilters = () => {
    const defaultFilters = {
      sector: '',
      country: '',
      minScore: 0,
      maxScore: 100,
      minPE: '',
      maxPE: '',
      minROE: '',
      maxROE: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };
  
  return (
    <div className={`filter-panel ${className}`}>
      <div className="filter-header">
        <h3>🔍 Filtres Avancés</h3>
        <button 
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-grid">
            {/* Filtres de base */}
            <div className="filter-group">
              <label>Secteur</label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
              >
                <option value="">Tous les secteurs</option>
                {availableSectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Pays</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option value="">Tous les pays</option>
                {availableCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            {/* Plage de score */}
            <div className="filter-group range-group">
              <label>Score Composite</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange('minScore', Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxScore}
                  onChange={(e) => handleFilterChange('maxScore', Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            {/* Filtres fondamentaux */}
            <div className="filter-group range-group">
              <label>P/E Ratio</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPE}
                  onChange={(e) => handleFilterChange('minPE', e.target.value)}
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPE}
                  onChange={(e) => handleFilterChange('maxPE', e.target.value)}
                  min="0"
                />
              </div>
            </div>
            
            <div className="filter-group range-group">
              <label>ROE (%)</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minROE}
                  onChange={(e) => handleFilterChange('minROE', e.target.value)}
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxROE}
                  onChange={(e) => handleFilterChange('maxROE', e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button 
              className="reset-button"
              onClick={resetFilters}
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

