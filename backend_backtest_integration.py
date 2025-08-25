"""
WOW V1 - Backtesting.py Integration Module
FastAPI endpoints for backtesting functionality
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

# Backtesting.py imports
try:
    from backtesting import Backtest, Strategy
    from backtesting.lib import crossover
    from backtesting.test import SMA, GOOG
    BACKTESTING_AVAILABLE = True
except ImportError:
    BACKTESTING_AVAILABLE = False
    logging.warning("Backtesting.py not installed. Install with: pip install backtesting")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Router for backtest endpoints
backtest_router = APIRouter(prefix="/api/backtest", tags=["backtest"])

# Pydantic models for request/response
class AssetAllocation(BaseModel):
    symbol: str
    weight: float
    name: Optional[str] = None

class BacktestRequest(BaseModel):
    initial_capital: float = 10000
    assets: List[AssetAllocation]
    strategy: str = "TopFiveStrategy"
    start_date: str
    end_date: str
    rebalance_frequency: str = "monthly"  # daily, weekly, monthly, quarterly

class BacktestResult(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None

# Sample strategies
class TopFiveStrategy(Strategy):
    """
    Simple Top 5 strategy for WOW V1 MVP
    Buys and holds the top 5 assets with equal weighting
    """
    
    def init(self):
        # Initialize strategy parameters
        self.rebalance_frequency = getattr(self, 'rebalance_frequency', 'monthly')
        self.last_rebalance = None
        
    def next(self):
        # Simple buy and hold strategy
        if len(self.data) < 20:  # Wait for enough data
            return
            
        # Check if we need to rebalance
        current_date = self.data.index[-1]
        
        if self.last_rebalance is None or self._should_rebalance(current_date):
            if not self.position:
                # Initial buy - equal weight allocation
                self.buy(size=1.0)  # Buy with all available capital
                self.last_rebalance = current_date
                
    def _should_rebalance(self, current_date):
        """Check if rebalancing is needed based on frequency"""
        if self.last_rebalance is None:
            return True
            
        if self.rebalance_frequency == 'daily':
            return True
        elif self.rebalance_frequency == 'weekly':
            return (current_date - self.last_rebalance).days >= 7
        elif self.rebalance_frequency == 'monthly':
            return (current_date - self.last_rebalance).days >= 30
        elif self.rebalance_frequency == 'quarterly':
            return (current_date - self.last_rebalance).days >= 90
        
        return False

class MovingAverageCrossStrategy(Strategy):
    """
    Moving Average Crossover Strategy
    Buy when short MA crosses above long MA, sell when opposite
    """
    
    # Strategy parameters
    short_window = 20
    long_window = 50
    
    def init(self):
        # Calculate moving averages
        close = self.data.Close
        self.ma_short = self.I(SMA, close, self.short_window)
        self.ma_long = self.I(SMA, close, self.long_window)
        
    def next(self):
        # Buy signal: short MA crosses above long MA
        if crossover(self.ma_short, self.ma_long):
            self.buy()
        # Sell signal: short MA crosses below long MA
        elif crossover(self.ma_long, self.ma_short):
            self.sell()

# Strategy registry
STRATEGIES = {
    "TopFiveStrategy": TopFiveStrategy,
    "MovingAverageCrossStrategy": MovingAverageCrossStrategy,
}

def get_sample_data(symbol: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Get sample data for backtesting
    In production, this would fetch real market data
    """
    try:
        # For MVP, use sample data similar to GOOG
        # In production, integrate with your data sources (Yahoo Finance, Alpha Vantage, etc.)
        
        start = pd.to_datetime(start_date)
        end = pd.to_datetime(end_date)
        
        # Generate sample data with realistic price movements
        dates = pd.date_range(start=start, end=end, freq='D')
        dates = dates[dates.weekday < 5]  # Remove weekends
        
        # Generate realistic OHLCV data
        np.random.seed(42)  # For reproducible results
        
        initial_price = 100.0
        returns = np.random.normal(0.0005, 0.02, len(dates))  # Daily returns
        
        prices = [initial_price]
        for ret in returns[1:]:
            prices.append(prices[-1] * (1 + ret))
        
        # Create OHLCV data
        data = []
        for i, (date, price) in enumerate(zip(dates, prices)):
            # Generate realistic OHLC from close price
            volatility = 0.01
            high = price * (1 + np.random.uniform(0, volatility))
            low = price * (1 - np.random.uniform(0, volatility))
            open_price = prices[i-1] if i > 0 else price
            volume = np.random.randint(1000000, 5000000)
            
            data.append({
                'Open': open_price,
                'High': high,
                'Low': low,
                'Close': price,
                'Volume': volume
            })
        
        df = pd.DataFrame(data, index=dates)
        return df
        
    except Exception as e:
        logger.error(f"Error generating sample data: {e}")
        # Fallback to backtesting.py test data
        return GOOG.copy()

@backtest_router.get("/health")
async def health_check():
    """Health check endpoint for backtest service"""
    return {
        "status": "healthy",
        "backtesting_available": BACKTESTING_AVAILABLE,
        "timestamp": datetime.now().isoformat(),
        "strategies": list(STRATEGIES.keys())
    }

@backtest_router.get("/strategies")
async def get_strategies():
    """Get list of available strategies"""
    return {
        "strategies": [
            {
                "name": name,
                "description": strategy.__doc__ or f"{name} strategy"
            }
            for name, strategy in STRATEGIES.items()
        ]
    }

@backtest_router.post("/run", response_model=BacktestResult)
async def run_backtest(request: BacktestRequest):
    """
    Run a backtest with the specified parameters
    """
    if not BACKTESTING_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Backtesting service unavailable. Please install backtesting.py"
        )
    
    start_time = datetime.now()
    
    try:
        # Validate strategy
        if request.strategy not in STRATEGIES:
            raise HTTPException(
                status_code=400,
                detail=f"Strategy '{request.strategy}' not found. Available: {list(STRATEGIES.keys())}"
            )
        
        # Validate assets
        if not request.assets:
            raise HTTPException(status_code=400, detail="At least one asset is required")
        
        total_weight = sum(asset.weight for asset in request.assets)
        if abs(total_weight - 1.0) > 0.01:
            raise HTTPException(
                status_code=400,
                detail=f"Asset weights must sum to 1.0, got {total_weight}"
            )
        
        # For MVP, use the first asset for backtesting
        # In production, implement portfolio-level backtesting
        primary_asset = request.assets[0]
        
        # Get market data
        data = get_sample_data(
            symbol=primary_asset.symbol,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        if data.empty:
            raise HTTPException(status_code=400, detail="No data available for the specified period")
        
        # Initialize strategy
        strategy_class = STRATEGIES[request.strategy]
        
        # Run backtest
        bt = Backtest(
            data,
            strategy_class,
            cash=request.initial_capital,
            commission=0.002,  # 0.2% commission
            exclusive_orders=True
        )
        
        # Add strategy parameters
        result = bt.run(rebalance_frequency=request.rebalance_frequency)
        
        # Calculate execution time
        execution_time = (datetime.now() - start_time).total_seconds()
        
        # Format results for frontend
        formatted_result = {
            "summary": {
                "start_date": request.start_date,
                "end_date": request.end_date,
                "initial_capital": request.initial_capital,
                "final_value": float(result['End']),
                "total_return_pct": float(result['Return [%]']),
                "annual_return_pct": float(result.get('Return (Ann.) [%]', 0)),
                "volatility_pct": float(result.get('Volatility (Ann.) [%]', 0)),
                "sharpe_ratio": float(result.get('Sharpe Ratio', 0)),
                "max_drawdown_pct": float(result['Max. Drawdown [%]']),
                "win_rate_pct": float(result.get('Win Rate [%]', 0)),
                "num_trades": int(result.get('# Trades', 0))
            },
            "equity_curve": {
                "dates": [date.isoformat() for date in result._equity_curve.index],
                "values": result._equity_curve['Equity'].tolist(),
                "drawdown": result._equity_curve['DrawdownPct'].tolist()
            },
            "trades": [
                {
                    "entry_date": trade.entry_time.isoformat() if hasattr(trade, 'entry_time') else None,
                    "exit_date": trade.exit_time.isoformat() if hasattr(trade, 'exit_time') else None,
                    "size": float(trade.size) if hasattr(trade, 'size') else 0,
                    "entry_price": float(trade.entry_price) if hasattr(trade, 'entry_price') else 0,
                    "exit_price": float(trade.exit_price) if hasattr(trade, 'exit_price') else 0,
                    "pnl": float(trade.pnl) if hasattr(trade, 'pnl') else 0,
                    "return_pct": float(trade.pnl_pct) if hasattr(trade, 'pnl_pct') else 0
                }
                for trade in result._trades
            ] if hasattr(result, '_trades') else []
        }
        
        logger.info(f"Backtest completed successfully in {execution_time:.2f}s")
        
        return BacktestResult(
            success=True,
            data=formatted_result,
            execution_time=execution_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Backtest error: {e}")
        execution_time = (datetime.now() - start_time).total_seconds()
        
        return BacktestResult(
            success=False,
            error=str(e),
            execution_time=execution_time
        )

@backtest_router.post("/optimize")
async def optimize_strategy(request: BacktestRequest):
    """
    Optimize strategy parameters (placeholder for future implementation)
    """
    return {
        "message": "Strategy optimization not yet implemented",
        "status": "coming_soon"
    }

# Export router for inclusion in main FastAPI app
__all__ = ["backtest_router"]

