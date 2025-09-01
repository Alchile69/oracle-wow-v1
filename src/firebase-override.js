// OVERRIDE FORCÉ - À mettre EN PREMIER dans main.jsx
console.log('🔄 FIREBASE OVERRIDE ACTIVÉ !');

// Configuration FORCÉE
window.FIREBASE_CONFIG_OVERRIDE = {
  apiKey: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  authDomain: "oracle-portfolio-wow-v1.firebaseapp.com",
  projectId: "oracle-portfolio-wow-v1",
  storageBucket: "oracle-portfolio-wow-v1.firebasestorage.app",
  messagingSenderId: "708589729285",
  appId: "1:708589729285:web:af06efb5793af1d9214e6c"
};

console.log('🔄 Configuration OVERRIDE:', window.FIREBASE_CONFIG_OVERRIDE);

// Override des variables d'environnement
Object.defineProperty(import.meta.env, 'VITE_FIREBASE_API_KEY', {
  value: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  writable: false,
  configurable: false
});

Object.defineProperty(import.meta.env, 'VITE_FIREBASE_PROJECT_ID', {
  value: "oracle-portfolio-wow-v1",
  writable: false,
  configurable: false
});

Object.defineProperty(import.meta.env, 'VITE_FIREBASE_AUTH_DOMAIN', {
  value: "oracle-portfolio-wow-v1.firebaseapp.com",
  writable: false,
  configurable: false
});

Object.defineProperty(import.meta.env, 'VITE_FIREBASE_STORAGE_BUCKET', {
  value: "oracle-portfolio-wow-v1.firebasestorage.app",
  writable: false,
  configurable: false
});

Object.defineProperty(import.meta.env, 'VITE_FIREBASE_MESSAGING_SENDER_ID', {
  value: "708589729285",
  writable: false,
  configurable: false
});

Object.defineProperty(import.meta.env, 'VITE_FIREBASE_APP_ID', {
  value: "1:708589729285:web:af06efb5793af1d9214e6c",
  writable: false,
  configurable: false
});

console.log('✅ Variables d\'environnement OVERRIDE appliquées !');
console.log('🔑 API Key forcée:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('🏗️ Project ID forcé:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

