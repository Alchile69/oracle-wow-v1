from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
from typing import Dict, List, Optional

app = FastAPI(
    title="Oracle WOW V1 Backend",
    description="Backend API pour Oracle Portfolio WOW V1 avec données financières réelles",
    version="1.0.0"
)

# Configuration CORS pour permettre l'accès depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Données de test pour le portfolio
DEFAULT_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX']

@app.get("/")
async def root():
    return {
        "message": "Oracle WOW V1 Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/health",
            "/api/portfolio/metrics",
            "/api/portfolio/backtest",
            "/api/market/data"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Oracle WOW V1 Backend"
    }

@app.get("/api/portfolio/metrics")
async def get_portfolio_metrics():
    """
    Récupère les métriques de performance du portfolio avec données réelles
    """
    try:
        # Récupérer les données des derniers 6 mois
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        # Télécharger les données pour un portfolio diversifié
        tickers = DEFAULT_TICKERS[:5]  # Limiter à 5 pour la performance
        data = yf.download(tickers, start=start_date, end=end_date, progress=False)
        
        if data.empty:
            # Données de fallback si Yahoo Finance échoue
            return {
                "returns": 12.5,
                "volatility": 15.3,
                "sharpe": 1.85,
                "drawdown": -8.2,
                "winRate": 67.5,
                "beta": 0.85,
                "source": "fallback_data",
                "timestamp": datetime.now().isoformat()
            }
        
        # Calculer les rendements du portfolio (moyenne pondérée égale)
        closes = data['Close']
        portfolio_returns = closes.pct_change().mean(axis=1).dropna()
        
        # Calculer les métriques
        annual_return = (portfolio_returns.mean() * 252) * 100  # Annualisé
        annual_volatility = (portfolio_returns.std() * np.sqrt(252)) * 100
        sharpe_ratio = annual_return / annual_volatility if annual_volatility > 0 else 0
        
        # Calcul du drawdown
        cumulative_returns = (1 + portfolio_returns).cumprod()
        rolling_max = cumulative_returns.expanding().max()
        drawdown = ((cumulative_returns - rolling_max) / rolling_max * 100).min()
        
        # Calcul du win rate (approximation)
        positive_days = (portfolio_returns > 0).sum()
        total_days = len(portfolio_returns)
        win_rate = (positive_days / total_days * 100) if total_days > 0 else 50
        
        # Calcul du beta (vs SPY)
        try:
            spy_data = yf.download('SPY', start=start_date, end=end_date, progress=False)
            spy_returns = spy_data['Close'].pct_change().dropna()
            
            # Aligner les dates
            aligned_data = pd.concat([portfolio_returns, spy_returns], axis=1, join='inner')
            aligned_data.columns = ['portfolio', 'spy']
            
            beta = aligned_data.cov().iloc[0, 1] / aligned_data['spy'].var()
        except:
            beta = 0.85  # Valeur par défaut
        
        return {
            "returns": round(annual_return, 2),
            "volatility": round(annual_volatility, 2),
            "sharpe": round(sharpe_ratio, 2),
            "drawdown": round(drawdown, 2),
            "winRate": round(win_rate, 1),
            "beta": round(beta, 2),
            "source": "yahoo_finance",
            "timestamp": datetime.now().isoformat(),
            "period": "6_months",
            "tickers": tickers
        }
        
    except Exception as e:
        # En cas d'erreur, retourner des données de test
        return {
            "returns": 12.5,
            "volatility": 15.3,
            "sharpe": 1.85,
            "drawdown": -8.2,
            "winRate": 67.5,
            "beta": 0.85,
            "source": "error_fallback",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/portfolio/backtest")
async def run_backtest(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    initial_cash: Optional[float] = 10000
):
    """
    Exécute un backtest simple du portfolio
    """
    try:
        # Dates par défaut
        if not end_date:
            end_date = datetime.now()
        else:
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
            
        if not start_date:
            start_date = end_date - timedelta(days=365)
        else:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
        
        # Récupérer les données
        tickers = DEFAULT_TICKERS[:4]
        data = yf.download(tickers, start=start_date, end=end_date, progress=False)
        
        if data.empty:
            raise HTTPException(status_code=500, detail="Impossible de récupérer les données")
        
        # Simulation simple d'un portfolio équipondéré
        closes = data['Close']
        portfolio_value = initial_cash
        daily_values = []
        
        for date, prices in closes.iterrows():
            # Allocation équipondérée
            allocation_per_stock = portfolio_value / len(tickers)
            shares = allocation_per_stock / prices
            portfolio_value = (shares * prices).sum()
            daily_values.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(portfolio_value, 2)
            })
        
        final_value = daily_values[-1]["value"]
        total_return = ((final_value - initial_cash) / initial_cash) * 100
        
        return {
            "initial_cash": initial_cash,
            "final_value": final_value,
            "total_return": round(total_return, 2),
            "daily_values": daily_values[-30:],  # Derniers 30 jours
            "tickers": tickers,
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur backtest: {str(e)}")

@app.get("/api/market/data")
async def get_market_data(tickers: Optional[str] = None):
    """
    Récupère les données de marché pour les tickers spécifiés
    """
    try:
        if not tickers:
            tickers = ",".join(DEFAULT_TICKERS[:5])
        
        ticker_list = [t.strip().upper() for t in tickers.split(",")]
        
        market_data = []
        for ticker in ticker_list:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                hist = stock.history(period="5d")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    prev_price = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                    change_pct = ((current_price - prev_price) / prev_price) * 100
                    
                    market_data.append({
                        "ticker": ticker,
                        "name": info.get("longName", ticker),
                        "price": round(current_price, 2),
                        "change_pct": round(change_pct, 2),
                        "volume": info.get("volume", 0),
                        "market_cap": info.get("marketCap", 0)
                    })
            except:
                continue
        
        return {
            "data": market_data,
            "timestamp": datetime.now().isoformat(),
            "source": "yahoo_finance"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur données marché: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

