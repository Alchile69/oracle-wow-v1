// firebase-forced.js - REMPLACER TOUT LE CODE FIREBASE EXISTANT

import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuration UNIQUE et FORCÉE
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  authDomain: "oracle-portfolio-wow-v1.firebaseapp.com",
  projectId: "oracle-portfolio-wow-v1",
  storageBucket: "oracle-portfolio-wow-v1.firebasestorage.app",
  messagingSenderId: "708589729285",
  appId: "1:708589729285:web:af06efb5793af1d9214e6c"
};

// 1. NETTOYER toutes les instances existantes
const existingApps = getApps();
console.log('🧹 Apps existantes:', existingApps.length);
existingApps.forEach(app => {
  console.log('🗑️ Suppression app:', app.name);
  deleteApp(app);
});

// 2. Créer UNE SEULE instance
let app, db, auth;

try {
  // Initialisation SANS nom (instance par défaut)
  app = initializeApp(FIREBASE_CONFIG);
  console.log('✅ Firebase initialisé avec projectId:', FIREBASE_CONFIG.projectId);
  
  // Services
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Vérification
  console.log('✅ Services actifs:', {
    app: app.name || '[DEFAULT]',
    projectId: app.options.projectId,
    apiKey: app.options.apiKey.substring(0, 10) + '...'
  });
  
} catch (error) {
  console.error('❌ Erreur Firebase:', error.message);
  
  // Si l'app existe déjà, la récupérer
  if (error.code === 'app/duplicate-app') {
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('⚠️ App existante récupérée');
  }
}

// 3. EXPORT UNIQUE - Utiliser UNIQUEMENT ces exports partout
export { db, auth };
export default app;

