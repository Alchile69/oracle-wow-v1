// src/components/screening/ScreeningTable.jsx
// Table de screening interactive avec TanStack Table

import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';

import ScoreBar, { ScoreBarMini, getScoreClass, getScoreLabel } from './ScoreBar';
import InfoTooltip, { INDICATOR_TOOLTIPS } from '../ui/InfoTooltip';
import { fetchScreeningData, filterScreeningData, getAvailableSectors, getAvailableCountries } from '../../services/screeningService';

const columnHelper = createColumnHelper();

/**
 * Composant principal ScreeningTable
 */
const ScreeningTable = ({ className = '' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([{ id: 'compositeScore', desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  // Filtres avancés
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [scoreRange, setScoreRange] = useState([0, 100]);
  
  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('📊 Chargement des données de screening...');
        const screeningData = await fetchScreeningData();
        setData(screeningData);
        console.log('✅ Données chargées:', screeningData.length, 'actifs');
      } catch (err) {
        console.error('❌ Erreur lors du chargement:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Définition des colonnes
  const columns = useMemo(() => [
    columnHelper.accessor('symbol', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Symbole
          <InfoTooltip 
            content="Symbole boursier de l'action et place de cotation (NASDAQ, NYSE, etc.)"
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="symbol-cell">
          <div className="symbol-main">{info.getValue()}</div>
          <div className="symbol-exchange">{info.row.original.exchange}</div>
        </div>
      ),
      size: 80
    }),
    
    columnHelper.accessor('name', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Nom
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.country}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="name-cell">
          <div className="name-main">{info.getValue()}</div>
          <div className="name-country">
            {getCountryFlag(info.row.original.country)} {info.row.original.country}
          </div>
        </div>
      ),
      size: 200
    }),
    
    columnHelper.accessor('sector', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Secteur
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.sector}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className={`sector-badge sector-${info.getValue().toLowerCase().replace(/\s+/g, '-')}`}>
          {info.getValue()}
        </div>
      ),
      size: 150
    }),
    
    columnHelper.accessor('price', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Prix
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.price}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="price-cell">
          <div className="price-main">${info.getValue()?.toFixed(2) || 'N/A'}</div>
          <div className={`price-change ${info.row.original.changePercent >= 0 ? 'positive' : 'negative'}`}>
            {info.row.original.changePercent >= 0 ? '+' : ''}{info.row.original.changePercent?.toFixed(2) || '0.00'}%
          </div>
        </div>
      ),
      size: 100
    }),
    
    columnHelper.accessor('pe', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          P/E
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.pe}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="metric-cell">
          {info.getValue()?.toFixed(1) || 'N/A'}
        </div>
      ),
      size: 70
    }),
    
    columnHelper.accessor('roe', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          ROE
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.roe}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="metric-cell">
          {info.getValue()?.toFixed(1) || 'N/A'}%
        </div>
      ),
      size: 70
    }),
    
    columnHelper.accessor('rsi', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          RSI
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.rsi}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className={`rsi-cell ${getRSIClass(info.getValue())}`}>
          {info.getValue()?.toFixed(0) || 'N/A'}
        </div>
      ),
      size: 70
    }),
    
    columnHelper.accessor('compositeScore', {
      header: () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Score
          <InfoTooltip 
            content={INDICATOR_TOOLTIPS.score}
            position="top"
          />
        </div>
      ),
      cell: info => (
        <div className="score-cell">
          <ScoreBarMini score={info.getValue()} />
          <div className={`score-value ${getScoreClass(info.getValue())}`}>
            {info.getValue()?.toFixed(1) || '0.0'}
          </div>
          <div className="score-label">
            {getScoreLabel(info.getValue())}
          </div>
        </div>
      ),
      size: 120,
      sortingFn: 'basic'
    })
  ], []);
  
  // Configuration de la table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false
  });
  
  // Données filtrées pour les statistiques
  const filteredData = useMemo(() => {
    return filterScreeningData(data, {
      sector: sectorFilter,
      country: countryFilter,
      minScore: scoreRange[0],
      maxScore: scoreRange[1]
    });
  }, [data, sectorFilter, countryFilter, scoreRange]);
  
  // Listes pour les filtres
  const availableSectors = useMemo(() => getAvailableSectors(data), [data]);
  const availableCountries = useMemo(() => getAvailableCountries(data), [data]);
  
  if (loading) {
    return (
      <div className="screening-table-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Chargement des données de screening...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="screening-table-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">Erreur lors du chargement: {error}</div>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className={`screening-table-container ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="screening-header">
        <div className="screening-title">
          <h2>📊 Screening Table</h2>
          <div className="screening-subtitle">
            {data.length} actifs internationaux • Score composite pondéré
          </div>
        </div>
        
        <div className="screening-stats">
          <div className="stat-item">
            <div className="stat-value">{data.filter(d => d.compositeScore >= 80).length}</div>
            <div className="stat-label">Excellents</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{data.filter(d => d.compositeScore >= 70 && d.compositeScore < 80).length}</div>
            <div className="stat-label">Bons</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{data.filter(d => d.compositeScore < 60).length}</div>
            <div className="stat-label">Faibles</div>
          </div>
        </div>
      </div>
      
      {/* Contrôles et filtres */}
      <div className="screening-controls">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Rechercher un actif..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les secteurs</option>
            {availableSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les pays</option>
            {availableCountries.map(country => (
              <option key={country} value={country}>
                {getCountryFlag(country)} {country}
              </option>
            ))}
          </select>
        </div>
        
        <div className="pagination-info">
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </div>
      </div>
      
      {/* Table principale */}
      <div className="table-wrapper">
        <table className="screening-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div
                      className="header-content"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="sort-indicator">
                          {header.column.getIsSorted() === 'asc' ? ' ↑' : 
                           header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Contrôles de pagination */}
      <div className="pagination-controls">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          {'>>'}
        </button>
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="page-size-select"
        >
          {[5, 10, 20, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Afficher {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Utilitaires
const getCountryFlag = (countryCode) => {
  const flags = {
    'US': '🇺🇸', 'CH': '🇨🇭', 'FR': '🇫🇷', 'DE': '🇩🇪',
    'TW': '🇹🇼', 'CN': '🇨🇳', 'AU': '🇦🇺', 'GB': '🇬🇧'
  };
  return flags[countryCode] || '🏳️';
};

const getRSIClass = (rsi) => {
  if (rsi >= 70) return 'rsi-overbought';
  if (rsi <= 30) return 'rsi-oversold';
  return 'rsi-neutral';
};

export default ScreeningTable;

