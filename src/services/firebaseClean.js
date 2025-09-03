// src/services/firebaseClean.js - SERVICE FIREBASE PROPRE ET SIMPLE
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

console.log('🧹 FIREBASE CLEAN - Démarrage...');

// Configuration HARDCODÉE - AUCUNE variable d'environnement
const FIREBASE_CONFIG_CLEAN = {
  apiKey: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  authDomain: "oracle-portfolio-wow-v1.firebaseapp.com",
  projectId: "oracle-portfolio-wow-v1",
  storageBucket: "oracle-portfolio-wow-v1.firebasestorage.app",
  messagingSenderId: "708589729285",
  appId: "1:708589729285:web:af06efb5793af1d9214e6c"
};

console.log('🧹 Configuration CLEAN:', {
  apiKey: FIREBASE_CONFIG_CLEAN.apiKey.substring(0, 15) + '...',
  projectId: FIREBASE_CONFIG_CLEAN.projectId
});

// Initialisation avec nom unique
const appClean = initializeApp(FIREBASE_CONFIG_CLEAN, 'oracle-clean-app');
const dbClean = getFirestore(appClean);

console.log('✅ Firebase CLEAN initialisé avec succès');

// Service CLEAN - SANS authentification
export class FirebaseServiceClean {
  
  /**
   * Teste la connectivité
   */
  static async testConnection() {
    console.log('🧹 === TEST CONNECTION CLEAN ===');
    try {
      return dbClean ? true : false;
    } catch (error) {
      console.error('❌ Erreur test connection CLEAN:', error);
      return false;
    }
  }
  
  /**
   * Sauvegarde CLEAN - SANS authentification
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO CLEAN ===');
    console.log('💾 Allocations CLEAN à sauvegarder:', allocations);
    
    try {
      const FIXED_USER_ID = 'anonymous-user-clean';
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: FIXED_USER_ID,
        version: 'clean-1.0',
        timestamp: new Date().toISOString(),
        service: 'firebase-clean'
      };
      
      const docRef = doc(dbClean, 'clean-portfolios', FIXED_USER_ID);
      await setDoc(docRef, portfolioData);
      
      console.log('✅ Sauvegarde CLEAN réussie !');
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE CLEAN:', error);
      return false;
    }
  }
  
  /**
   * Récupération CLEAN
   */
  static async getPortfolioAllocations() {
    console.log('📥 === GET PORTFOLIO CLEAN ===');
    
    try {
      const FIXED_USER_ID = 'anonymous-user-clean';
      const docRef = doc(dbClean, 'clean-portfolios', FIXED_USER_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Données récupérées CLEAN:', data);
        
        const { lastUpdated, userId, version, timestamp, service, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version, timestamp, service }
        };
      } else {
        console.log('📭 Aucune allocation trouvée CLEAN');
        return null;
      }
    } catch (error) {
      console.error('❌ ERREUR RÉCUPÉRATION CLEAN:', error);
      return null;
    }
  }
}

export default FirebaseServiceClean;

