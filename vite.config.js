import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔥 FORCER les variables d'environnement Firebase
  define: {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify('AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs'),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify('oracle-portfolio-wow-v1.firebaseapp.com'),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('oracle-portfolio-wow-v1'),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify('oracle-portfolio-wow-v1.firebasestorage.app'),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify('708589729285'),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify('1:708589729285:web:af06efb5793af1d9214e6c')
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimisations pour réduire la taille des bundles
    rollupOptions: {
      output: {
        // Code splitting automatique
        manualChunks: {
          // Séparer React et React DOM
          'react-vendor': ['react', 'react-dom'],
          // Séparer les librairies UI
          'ui-vendor': ['lucide-react'],
          // Séparer les utilitaires
          'utils-vendor': ['clsx', 'tailwind-merge'],
          // Séparer les composants par module
          'widgets': [
            './src/components/widgets/CountrySelector.jsx',
            './src/components/widgets/RegimeCard.jsx',
            './src/components/widgets/MarketStressCard.jsx',
            './src/components/widgets/AllocationsCard.jsx',
            './src/components/widgets/ETFPricesModule.jsx',
            './src/components/widgets/BacktestingCard.jsx',
            './src/components/widgets/PhysicalIndicatorsCard.jsx'
          ]
        },
        // Optimiser les noms de fichiers
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Compression et optimisation
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    // Limiter la taille des chunks
    chunkSizeWarningLimit: 500,
    // Source maps pour le debug
    sourcemap: false
  },
  // Optimisations de développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  },
  // Configuration du serveur
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5174-i25jmksazrl5jpgvweo9c-48c9de64.manusvm.computer',
      '5173-i25jmksazrl5jpgvweo9c-48c9de64.manusvm.computer',
      '5173-ifd0vm2tir9fieilqed3w-10979104.manusvm.computer'
    ]
  }
})
