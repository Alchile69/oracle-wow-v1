// 🚀 SERVICE FIREBASE AVEC CONFIGURATION FORCÉE
// Pour éliminer définitivement la clé mystérieuse

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// 🔥 CONFIGURATION FIREBASE FORCÉE AVEC VOS VRAIES VARIABLES
const FORCED_CONFIG = {
  apiKey: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  authDomain: "oracle-portfolio-wow-v1.firebaseapp.com",
  projectId: "oracle-portfolio-wow-v1",
  storageBucket: "oracle-portfolio-wow-v1.firebasestorage.app",
  messagingSenderId: "708589729285",
  appId: "1:708589729285:web:af06efb5793af1d9214e6c"
};

console.log('🚀 === CONFIGURATION FIREBASE FORCÉE ===');
console.log('🚀 FORCED_CONFIG:', FORCED_CONFIG);
console.log('🚀 apiKey FORCÉ:', FORCED_CONFIG.apiKey);
console.log('🚀 projectId FORCÉ:', FORCED_CONFIG.projectId);

// Initialisation Firebase avec configuration forcée
let app, db, auth;

try {
  console.log('🚀 Initialisation Firebase avec config FORCÉE...');
  app = initializeApp(FORCED_CONFIG, 'oracle-wow-v1-forced');
  console.log('✅ App Firebase FORCÉE initialisée:', app.name);
  
  db = getFirestore(app);
  console.log('✅ Firestore FORCÉ initialisé');
  
  auth = getAuth(app);
  console.log('✅ Auth Firebase FORCÉ initialisé');
  console.log('✅ Auth config FORCÉ:', auth.config);
  
  console.log('🎉 Firebase FORCÉ complètement initialisé !');
} catch (error) {
  console.error('❌ ERREUR INITIALISATION FIREBASE FORCÉ:', error);
}

// Service Firebase avec configuration forcée
export class FirebaseServiceForced {
  
  /**
   * Teste la connectivité Firebase
   */
  static async testConnection() {
    console.log('🔍 === TEST CONNECTION FORCÉ ===');
    
    if (!app || !db || !auth) {
      console.error('❌ Services FORCÉS non initialisés');
      return false;
    }
    
    console.log('✅ Firebase FORCÉ configuré et initialisé');
    return true;
  }
  
  /**
   * Initialise l'authentification anonyme FORCÉE
   */
  static async initAuth() {
    console.log('🔐 === INIT AUTH FORCÉ ===');
    console.log('🔐 Auth FORCÉ object:', auth);
    console.log('🔐 Auth FORCÉ config:', auth?.config);
    
    if (!auth) {
      throw new Error('Auth FORCÉ non initialisé');
    }
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          console.log('🔐 Utilisateur FORCÉ déjà connecté:', user.uid);
          resolve(user);
        } else {
          try {
            console.log('🔐 Tentative connexion anonyme FORCÉE...');
            console.log('🔐 Auth FORCÉ avant signIn:', auth);
            
            const userCredential = await signInAnonymously(auth);
            console.log('✅ Connexion anonyme FORCÉE réussie:', userCredential.user.uid);
            resolve(userCredential.user);
          } catch (error) {
            console.error('❌ ERREUR CONNEXION ANONYME FORCÉE:', error);
            console.error('❌ Error code FORCÉ:', error.code);
            console.error('❌ Error message FORCÉ:', error.message);
            console.error('❌ Auth FORCÉ utilisé:', auth);
            reject(error);
          }
        }
      });
    });
  }
  
  /**
   * Sauvegarde FORCÉE
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO FORCÉ ===');
    console.log('💾 Allocations à sauvegarder FORCÉ:', allocations);
    
    try {
      console.log('💾 Initialisation auth FORCÉ...');
      const user = await this.initAuth();
      console.log('💾 User FORCÉ obtenu:', user.uid);
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: user.uid,
        version: '1.0'
      };
      
      console.log('💾 Données à sauvegarder FORCÉ:', portfolioData);
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      console.log('💾 Document ref FORCÉ:', docRef);
      
      await setDoc(docRef, portfolioData);
      console.log('✅ Sauvegarde FORCÉE réussie !');
      
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE FORCÉE:', error);
      return false;
    }
  }
  
  /**
   * Récupération FORCÉE
   */
  static async getPortfolioAllocations() {
    console.log('📥 === GET PORTFOLIO ALLOCATIONS FORCÉ ===');
    
    try {
      console.log('📥 Initialisation auth FORCÉ...');
      const user = await this.initAuth();
      console.log('📥 User FORCÉ obtenu:', user.uid);
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      console.log('📥 Document ref FORCÉ:', docRef);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Données récupérées FORCÉ:', data);
        
        const { lastUpdated, userId, version, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version }
        };
      } else {
        console.log('📭 Aucune allocation trouvée FORCÉ');
        return null;
      }
    } catch (error) {
      console.error('❌ ERREUR RÉCUPÉRATION FORCÉE:', error);
      return null;
    }
  }
}

export default FirebaseServiceForced;

