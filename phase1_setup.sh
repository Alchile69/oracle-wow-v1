#!/bin/bash

# WOW V1 - Phase 1 Setup Script
# Configuration Oracle Portfolio V3 + Backtesting.py Integration

set -e  # Exit on any error

echo "🚀 WOW V1 - Phase 1 Setup Starting..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Step 1: Clone Oracle Portfolio V3
echo -e "\n${BLUE}📥 Step 1: Cloning Oracle Portfolio V3...${NC}"
if [ ! -d "oracle-portfolio-v3" ]; then
    git clone https://github.com/Alchile69/oracle-portfolio-v3.git
    print_status "Oracle Portfolio V3 cloned successfully"
else
    print_warning "Oracle Portfolio V3 directory already exists, pulling latest changes..."
    cd oracle-portfolio-v3
    git pull origin main
    cd ..
    print_status "Oracle Portfolio V3 updated"
fi

# Step 2: Install Frontend Dependencies
echo -e "\n${BLUE}📦 Step 2: Installing Frontend Dependencies...${NC}"
cd oracle-portfolio-v3

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in Oracle Portfolio V3"
    exit 1
fi

# Install existing dependencies
npm install
print_status "Existing dependencies installed"

# Install additional dependencies for WOW V1
echo -e "\n${BLUE}📦 Installing additional WOW V1 dependencies...${NC}"
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0 tween.js@^18.6.4 leaflet@^1.9.4 react-leaflet@^4.2.1
print_status "WOW V1 frontend dependencies installed"

# Step 3: Backend Setup (if backend directory exists)
echo -e "\n${BLUE}🐍 Step 3: Backend Setup...${NC}"
if [ -d "backend" ] || [ -d "STRUCTURE_2_MIGRATION/backend-python" ]; then
    BACKEND_DIR=""
    if [ -d "backend" ]; then
        BACKEND_DIR="backend"
    elif [ -d "STRUCTURE_2_MIGRATION/backend-python" ]; then
        BACKEND_DIR="STRUCTURE_2_MIGRATION/backend-python"
    fi
    
    if [ ! -z "$BACKEND_DIR" ]; then
        cd "$BACKEND_DIR"
        
        # Check if requirements.txt exists
        if [ -f "requirements.txt" ]; then
            print_info "Found requirements.txt, installing Python dependencies..."
            pip3 install -r requirements.txt
            print_status "Python dependencies installed"
        fi
        
        # Add Backtesting.py dependencies
        echo -e "\n${BLUE}📊 Installing Backtesting.py dependencies...${NC}"
        pip3 install backtesting==0.3.3 pandas>=1.5.0 numpy>=1.24.0
        print_status "Backtesting.py dependencies installed"
        
        cd ..
    fi
else
    print_warning "No backend directory found, skipping backend setup"
fi

# Step 4: Create WOW V1 specific files
echo -e "\n${BLUE}📝 Step 4: Creating WOW V1 specific files...${NC}"

# Create .env.local template
cat > .env.local.template << 'EOF'
# WOW V1 Environment Variables Template
# Copy this file to .env.local and fill in your values

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend URLs
VITE_BACKEND_URL=https://oracle-backend-railway.up.railway.app
VITE_BACKTEST_ENDPOINT=/api/backtest

# API Keys (Optional - for enhanced data sources)
VITE_FMP_API_KEY=your_fmp_api_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
EOF

print_status ".env.local template created"

# Create WOW V1 README
cat > WOW_V1_README.md << 'EOF'
# WOW V1 - Development Setup

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local with your Firebase credentials
   ```

2. **Development Server**
   ```bash
   npm run dev
   # or
   npx vite --port 5173 --host
   ```

3. **Backend Testing**
   ```bash
   curl https://oracle-backend-railway.up.railway.app/health
   ```

## WOW V1 Specific Features

### New Components Added
- Portfolio KPI Cards with animations
- Interactive Asset Allocation Pie Chart
- Country Risk Heatmap (Leaflet)
- Backtesting Module (Backtesting.py)
- Forecast & Scenario Analysis
- Enhanced Alerts System

### Dependencies Added
- chart.js + react-chartjs-2 (Charts)
- tween.js (Animations)
- leaflet + react-leaflet (Maps)
- backtesting (Python backend)

## Development Phases

- **Phase 1** (3 days): Setup & Configuration ✅
- **Phase 2** (4 days): Portfolio KPIs + Pie Chart
- **Phase 3** (2 days): Screening Table
- **Phase 4** (3 days): Country Risk Heatmap
- **Phase 5** (4 days): Backtesting Integration
- **Phase 6** (3 days): Forecast & Scenario Tool
- **Phase 7** (2 days): Alerts System
- **Phase 8** (3 days): Testing & Polish

## Architecture

```
Frontend (Vite/React) → Railway Backend (FastAPI + Backtesting.py) → Firebase Firestore
```

## URLs

- **Frontend**: https://oracle-portfolio-v3-7p0jg50o5-alain-poncelas-projects.vercel.app
- **Backend**: https://oracle-backend-railway.up.railway.app
- **Repository**: https://github.com/Alchile69/oracle-portfolio-v3.git
EOF

print_status "WOW V1 README created"

# Step 5: Create Backtesting.py integration template
mkdir -p src/services
cat > src/services/backtestService.js << 'EOF'
// WOW V1 - Backtesting Service
// Integration with Railway Backend + Backtesting.py

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://oracle-backend-railway.up.railway.app';

export class BacktestService {
  /**
   * Run a backtest with the given parameters
   * @param {Object} params - Backtest parameters
   * @param {number} params.initialCapital - Starting capital
   * @param {Array} params.assets - Array of asset allocations
   * @param {string} params.strategy - Strategy name
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Backtest results
   */
  static async runBacktest(params) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Backtest failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backtest service error:', error);
      throw error;
    }
  }

  /**
   * Get available strategies
   * @returns {Promise<Array>} List of available strategies
   */
  static async getStrategies() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/strategies`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      return ['TopFiveStrategy']; // Fallback
    }
  }

  /**
   * Health check for backtest service
   * @returns {Promise<Object>} Service status
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/health`);
      return await response.json();
    } catch (error) {
      console.error('Backtest health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}
EOF

print_status "Backtesting service template created"

# Step 6: Create package.json scripts for WOW V1
echo -e "\n${BLUE}📜 Step 6: Updating package.json scripts...${NC}"

# Add WOW V1 specific scripts
npm pkg set scripts.wow:dev="vite --port 5173 --host"
npm pkg set scripts.wow:build="vite build"
npm pkg set scripts.wow:preview="vite preview"
npm pkg set scripts.wow:test="npm run test"

print_status "Package.json scripts updated"

# Step 7: Validation
echo -e "\n${BLUE}✅ Step 7: Validation...${NC}"

# Check if all required files exist
REQUIRED_FILES=("package.json" "src" "public" ".env.local.template" "WOW_V1_README.md")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file missing"
    fi
done

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status "Dependencies installed"
else
    print_error "Dependencies not installed"
fi

cd ..

echo -e "\n${GREEN}🎉 WOW V1 Phase 1 Setup Complete!${NC}"
echo "=================================================="
echo -e "${BLUE}Next Steps:${NC}"
echo "1. cd oracle-portfolio-v3"
echo "2. cp .env.local.template .env.local"
echo "3. Edit .env.local with your Firebase credentials"
echo "4. npm run wow:dev"
echo ""
echo -e "${BLUE}Backend URL:${NC} https://oracle-backend-railway.up.railway.app"
echo -e "${BLUE}Documentation:${NC} WOW_V1_README.md"
echo ""
echo -e "${GREEN}Ready for Phase 2 development! 🚀${NC}"

