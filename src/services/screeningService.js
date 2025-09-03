// src/services/screeningService.js
// Service de screening avec cascade APIs et scoring composite

const SCREENING_ASSETS = [
  // US Tech Giants
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', country: 'US', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', country: 'US', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', country: 'US', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', country: 'US', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', country: 'US', exchange: 'NASDAQ' },
  
  // US Finance
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', country: 'US', exchange: 'NYSE' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financials', country: 'US', exchange: 'NYSE' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.', sector: 'Financials', country: 'US', exchange: 'NYSE' },
  
  // European
  { symbol: 'NESN.SW', name: 'Nestlé S.A.', sector: 'Consumer Staples', country: 'CH', exchange: 'SIX' },
  { symbol: 'NOVN.SW', name: 'Novartis AG', sector: 'Healthcare', country: 'CH', exchange: 'SIX' },
  { symbol: 'MC.PA', name: 'LVMH', sector: 'Consumer Discretionary', country: 'FR', exchange: 'EPA' },
  { symbol: 'OR.PA', name: "L'Oréal S.A.", sector: 'Consumer Staples', country: 'FR', exchange: 'EPA' },
  { symbol: 'BMW.DE', name: 'BMW AG', sector: 'Consumer Discretionary', country: 'DE', exchange: 'XETRA' },
  { symbol: 'SAP.DE', name: 'SAP SE', sector: 'Technology', country: 'DE', exchange: 'XETRA' },
  
  // Asian
  { symbol: 'TSM', name: 'Taiwan Semiconductor', sector: 'Technology', country: 'TW', exchange: 'NYSE' },
  { symbol: 'BABA', name: 'Alibaba Group', sector: 'Consumer Discretionary', country: 'CN', exchange: 'NYSE' },
  
  // Resources
  { symbol: 'BHP.AX', name: 'BHP Group Ltd.', sector: 'Materials', country: 'AU', exchange: 'ASX' },
  { symbol: 'RIO.L', name: 'Rio Tinto PLC', sector: 'Materials', country: 'GB', exchange: 'LSE' },
  
  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', country: 'US', exchange: 'NYSE' },
  { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy', country: 'US', exchange: 'NYSE' }
];

// Pondération du score composite
const SCORING_WEIGHTS = {
  fundamental: 0.40,  // P/E, ROE, Debt/Equity, etc.
  macro: 0.25,        // Country rating, GDP growth, inflation
  technical: 0.15,    // RSI, Moving averages, momentum
  sector: 0.20        // Sector performance, relative strength
};

// Ratings par pays (sur 100)
const COUNTRY_RATINGS = {
  'US': 85, 'CH': 95, 'FR': 80, 'DE': 88, 'TW': 75, 'CN': 65, 'AU': 82, 'GB': 78
};

// Performance sectorielle relative (sur 100)
const SECTOR_PERFORMANCE = {
  'Technology': 85,
  'Financials': 70,
  'Consumer Discretionary': 75,
  'Consumer Staples': 65,
  'Healthcare': 80,
  'Materials': 60,
  'Energy': 55
};

/**
 * Service principal de récupération des données de screening
 */
export const fetchScreeningData = async () => {
  console.log('📊 === SCREENING SERVICE - Démarrage ===');
  
  const data = [];
  
  for (const asset of SCREENING_ASSETS) {
    try {
      console.log(`🔍 Traitement de ${asset.symbol}...`);
      
      // Cascade API : FMP → Yahoo → Alpha Vantage → Fallback
      const assetData = await fetchAssetDataWithFallback(asset);
      const score = calculateCompositeScore(assetData, asset);
      
      const enrichedData = {
        ...asset,
        ...assetData,
        compositeScore: score,
        lastUpdated: new Date().toISOString()
      };
      
      data.push(enrichedData);
      console.log(`✅ ${asset.symbol}: Score ${score.toFixed(1)}`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${asset.symbol}:`, error);
      
      // Données de fallback en cas d'erreur
      const fallbackData = generateFallbackData(asset);
      data.push(fallbackData);
    }
  }
  
  // Tri par score décroissant
  const sortedData = data.sort((a, b) => b.compositeScore - a.compositeScore);
  
  console.log('📊 === SCREENING TERMINÉ ===');
  console.log(`📈 Top 3: ${sortedData.slice(0, 3).map(d => `${d.symbol} (${d.compositeScore.toFixed(1)})`).join(', ')}`);
  
  return sortedData;
};

/**
 * Récupération des données avec cascade d'APIs
 */
const fetchAssetDataWithFallback = async (asset) => {
  // Tentative 1: Financial Modeling Prep (FMP)
  try {
    console.log(`🔄 Tentative FMP pour ${asset.symbol}...`);
    return await fetchFromFMP(asset);
  } catch (error) {
    console.log(`⚠️ FMP échoué pour ${asset.symbol}, tentative Yahoo...`);
  }
  
  // Tentative 2: Yahoo Finance
  try {
    return await fetchFromYahoo(asset);
  } catch (error) {
    console.log(`⚠️ Yahoo échoué pour ${asset.symbol}, tentative Alpha Vantage...`);
  }
  
  // Tentative 3: Alpha Vantage
  try {
    return await fetchFromAlphaVantage(asset);
  } catch (error) {
    console.log(`⚠️ Alpha Vantage échoué pour ${asset.symbol}, utilisation fallback...`);
  }
  
  // Fallback: données simulées réalistes
  return generateRealisticFallbackData(asset);
};

/**
 * Fetch depuis Financial Modeling Prep (API principale)
 */
const fetchFromFMP = async (asset) => {
  // Simulation d'appel FMP (remplacer par vraie API)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Pour la démo, on simule des données réalistes
  throw new Error('FMP API not configured');
};

/**
 * Fetch depuis Yahoo Finance (API secondaire)
 */
const fetchFromYahoo = async (asset) => {
  // Simulation d'appel Yahoo (remplacer par vraie API)
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Pour la démo, on simule des données réalistes
  throw new Error('Yahoo API not configured');
};

/**
 * Fetch depuis Alpha Vantage (API tertiaire)
 */
const fetchFromAlphaVantage = async (asset) => {
  // Simulation d'appel Alpha Vantage (remplacer par vraie API)
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Pour la démo, on simule des données réalistes
  throw new Error('Alpha Vantage API not configured');
};

/**
 * Génération de données de fallback réalistes
 */
const generateRealisticFallbackData = (asset) => {
  const basePrice = Math.random() * 200 + 50; // Prix entre 50 et 250
  const volatility = Math.random() * 0.4 + 0.1; // Volatilité entre 10% et 50%
  
  return {
    price: basePrice,
    change: (Math.random() - 0.5) * 10, // Changement entre -5% et +5%
    changePercent: (Math.random() - 0.5) * 10,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    
    // Fondamentaux
    pe: Math.random() * 40 + 5, // P/E entre 5 et 45
    roe: Math.random() * 25 + 5, // ROE entre 5% et 30%
    debtToEquity: Math.random() * 2, // D/E entre 0 et 2
    dividendYield: Math.random() * 5, // Dividend yield entre 0% et 5%
    
    // Techniques
    rsi: Math.random() * 100, // RSI entre 0 et 100
    sma50: basePrice * (0.9 + Math.random() * 0.2), // SMA50 ±10% du prix
    sma200: basePrice * (0.8 + Math.random() * 0.4), // SMA200 ±20% du prix
    
    // Métadonnées
    marketCap: basePrice * (Math.random() * 1000000000 + 100000000),
    beta: Math.random() * 2 + 0.5, // Beta entre 0.5 et 2.5
    
    dataSource: 'fallback_realistic'
  };
};

/**
 * Génération de données de fallback simples en cas d'erreur totale
 */
const generateFallbackData = (asset) => {
  return {
    ...asset,
    price: 100,
    change: 0,
    changePercent: 0,
    pe: 20,
    roe: 15,
    rsi: 50,
    compositeScore: 50,
    dataSource: 'fallback_error',
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Calcul du score composite pondéré
 */
const calculateCompositeScore = (data, asset) => {
  console.log(`🧮 Calcul du score pour ${asset.symbol}...`);
  
  // Score fondamental (40%)
  const fundamentalScore = calculateFundamentalScore(data);
  
  // Score macro (25%)
  const macroScore = calculateMacroScore(asset);
  
  // Score technique (15%)
  const technicalScore = calculateTechnicalScore(data);
  
  // Score sectoriel (20%)
  const sectorScore = calculateSectorScore(asset);
  
  // Score composite pondéré
  const compositeScore = (
    fundamentalScore * SCORING_WEIGHTS.fundamental +
    macroScore * SCORING_WEIGHTS.macro +
    technicalScore * SCORING_WEIGHTS.technical +
    sectorScore * SCORING_WEIGHTS.sector
  );
  
  console.log(`📊 ${asset.symbol} - Scores: F:${fundamentalScore.toFixed(1)} M:${macroScore.toFixed(1)} T:${technicalScore.toFixed(1)} S:${sectorScore.toFixed(1)} = ${compositeScore.toFixed(1)}`);
  
  return Math.round(compositeScore * 10) / 10; // Arrondi à 1 décimale
};

/**
 * Score fondamental basé sur P/E, ROE, D/E
 */
const calculateFundamentalScore = (data) => {
  let score = 0;
  let factors = 0;
  
  // P/E Score (plus bas = mieux, optimal entre 10-20)
  if (data.pe && data.pe > 0) {
    if (data.pe <= 15) score += 100;
    else if (data.pe <= 25) score += 80 - ((data.pe - 15) * 4);
    else if (data.pe <= 40) score += 40 - ((data.pe - 25) * 2);
    else score += 10;
    factors++;
  }
  
  // ROE Score (plus haut = mieux)
  if (data.roe && data.roe > 0) {
    if (data.roe >= 20) score += 100;
    else if (data.roe >= 15) score += 80;
    else if (data.roe >= 10) score += 60;
    else if (data.roe >= 5) score += 40;
    else score += 20;
    factors++;
  }
  
  // Debt/Equity Score (plus bas = mieux)
  if (data.debtToEquity !== undefined) {
    if (data.debtToEquity <= 0.3) score += 100;
    else if (data.debtToEquity <= 0.6) score += 80;
    else if (data.debtToEquity <= 1.0) score += 60;
    else if (data.debtToEquity <= 1.5) score += 40;
    else score += 20;
    factors++;
  }
  
  return factors > 0 ? score / factors : 50;
};

/**
 * Score macro basé sur le rating du pays
 */
const calculateMacroScore = (asset) => {
  const countryRating = COUNTRY_RATINGS[asset.country] || 70;
  return countryRating;
};

/**
 * Score technique basé sur RSI et moyennes mobiles
 */
const calculateTechnicalScore = (data) => {
  let score = 0;
  let factors = 0;
  
  // RSI Score (optimal entre 30-70)
  if (data.rsi !== undefined) {
    if (data.rsi >= 30 && data.rsi <= 70) score += 100;
    else if (data.rsi >= 20 && data.rsi <= 80) score += 70;
    else if (data.rsi >= 10 && data.rsi <= 90) score += 40;
    else score += 20;
    factors++;
  }
  
  // Tendance des moyennes mobiles
  if (data.price && data.sma50 && data.sma200) {
    // Prix au-dessus des moyennes = positif
    if (data.price > data.sma50 && data.sma50 > data.sma200) score += 100;
    else if (data.price > data.sma50) score += 70;
    else if (data.price > data.sma200) score += 50;
    else score += 30;
    factors++;
  }
  
  return factors > 0 ? score / factors : 50;
};

/**
 * Score sectoriel basé sur la performance relative du secteur
 */
const calculateSectorScore = (asset) => {
  const sectorPerformance = SECTOR_PERFORMANCE[asset.sector] || 70;
  return sectorPerformance;
};

/**
 * Utilitaires pour le filtrage et le tri
 */
export const filterScreeningData = (data, filters) => {
  return data.filter(item => {
    if (filters.sector && item.sector !== filters.sector) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.minScore && item.compositeScore < filters.minScore) return false;
    if (filters.maxScore && item.compositeScore > filters.maxScore) return false;
    return true;
  });
};

export const getAvailableSectors = (data) => {
  return [...new Set(data.map(item => item.sector))].sort();
};

export const getAvailableCountries = (data) => {
  return [...new Set(data.map(item => item.country))].sort();
};

// Export des constantes pour utilisation dans les composants
export { SCORING_WEIGHTS, SCREENING_ASSETS, COUNTRY_RATINGS, SECTOR_PERFORMANCE };

export default {
  fetchScreeningData,
  filterScreeningData,
  getAvailableSectors,
  getAvailableCountries
};

