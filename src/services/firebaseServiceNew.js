// 🔍 NOUVEAU SERVICE FIREBASE AVEC LOGS ULTRA-DÉTAILLÉS
// Pour traquer la clé mystérieuse AIzaSyAtS1J5UxqUAEBdixiTuCtfY-VZ5ecRUfE

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// 🔍 LOGS ULTRA-DÉTAILLÉS DES VARIABLES D'ENVIRONNEMENT
console.log('🔍 === DIAGNOSTIC COMPLET VARIABLES ENV ===');
console.log('🔍 import.meta.env:', import.meta.env);
console.log('🔍 VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('🔍 VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('🔍 VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('🔍 VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log('🔍 VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log('🔍 VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID);

// 🔥 CONFIGURATION FIREBASE AVEC LOGS DÉTAILLÉS
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 === CONFIGURATION FIREBASE FINALE ===');
console.log('🔥 firebaseConfig:', firebaseConfig);
console.log('🔥 apiKey COMPLET:', firebaseConfig.apiKey);
console.log('🔥 projectId:', firebaseConfig.projectId);
console.log('🔥 authDomain:', firebaseConfig.authDomain);

// Vérification de la configuration
const isConfigValid = Object.values(firebaseConfig).every(value => value && value !== 'undefined' && value !== undefined);

console.log('✅ Configuration valide:', isConfigValid);

if (!isConfigValid) {
  console.error('❌ CONFIGURATION FIREBASE INVALIDE !');
  console.error('❌ Valeurs manquantes:', Object.entries(firebaseConfig).filter(([key, value]) => !value || value === 'undefined'));
}

// Initialisation Firebase
let app, db, auth;

try {
  console.log('🚀 Initialisation Firebase avec config:', firebaseConfig);
  app = initializeApp(firebaseConfig);
  console.log('✅ App Firebase initialisée:', app);
  
  db = getFirestore(app);
  console.log('✅ Firestore initialisé:', db);
  
  auth = getAuth(app);
  console.log('✅ Auth Firebase initialisé:', auth);
  console.log('✅ Auth config:', auth.config);
  
  console.log('🎉 Firebase complètement initialisé !');
} catch (error) {
  console.error('❌ ERREUR INITIALISATION FIREBASE:', error);
}

// Service Firebase avec logs détaillés
export class FirebaseServiceNew {
  
  /**
   * Teste la connectivité Firebase
   */
  static async testConnection() {
    console.log('🔍 === TEST CONNECTION ===');
    
    if (!isConfigValid) {
      console.warn('⚠️ Configuration invalide');
      return false;
    }
    
    if (!app || !db || !auth) {
      console.error('❌ Services non initialisés');
      return false;
    }
    
    console.log('✅ Firebase configuré et initialisé');
    return true;
  }
  
  /**
   * Initialise l'authentification anonyme avec logs détaillés
   */
  static async initAuth() {
    console.log('🔐 === INIT AUTH ===');
    console.log('🔐 Auth object:', auth);
    console.log('🔐 Auth config:', auth?.config);
    
    if (!auth) {
      throw new Error('Auth non initialisé');
    }
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          console.log('🔐 Utilisateur déjà connecté:', user.uid);
          resolve(user);
        } else {
          try {
            console.log('🔐 Tentative connexion anonyme...');
            console.log('🔐 Auth avant signIn:', auth);
            
            const userCredential = await signInAnonymously(auth);
            console.log('✅ Connexion anonyme réussie:', userCredential.user.uid);
            resolve(userCredential.user);
          } catch (error) {
            console.error('❌ ERREUR CONNEXION ANONYME:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            console.error('❌ Auth utilisé:', auth);
            reject(error);
          }
        }
      });
    });
  }
  
  /**
   * Sauvegarde avec logs détaillés
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO ===');
    console.log('💾 Allocations à sauvegarder:', allocations);
    
    try {
      if (!isConfigValid) {
        console.warn('⚠️ Configuration invalide, sauvegarde ignorée');
        return false;
      }
      
      console.log('💾 Initialisation auth...');
      const user = await this.initAuth();
      console.log('💾 User obtenu:', user.uid);
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: user.uid,
        version: '1.0'
      };
      
      console.log('💾 Données à sauvegarder:', portfolioData);
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      console.log('💾 Document ref:', docRef);
      
      await setDoc(docRef, portfolioData);
      console.log('✅ Sauvegarde réussie !');
      
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE:', error);
      return false;
    }
  }
}

export default FirebaseServiceNew;

