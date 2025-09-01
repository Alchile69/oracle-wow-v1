// src/services/firebase.js - LE SEUL SERVICE FIREBASE À GARDER
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

console.log('🔥 FIREBASE SERVICE UNIQUE - Initialisation...');

// Configuration HARDCODÉE - Plus de variables d'environnement
const firebaseConfig = {
  apiKey: "AIzaSyDa1o_qmqPCh9v0BDtCvZOCqM2q6QBPcvs",
  authDomain: "oracle-portfolio-wow-v1.firebaseapp.com",
  projectId: "oracle-portfolio-wow-v1",
  storageBucket: "oracle-portfolio-wow-v1.firebasestorage.app",
  messagingSenderId: "708589729285",
  appId: "1:708589729285:web:af06efb5793af1d9214e6c"
};

console.log('🔥 Configuration Firebase UNIQUE:', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialisation
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('✅ Firebase UNIQUE initialisé avec succès');

// Service simplifié SANS authentification
export class FirebaseService {
  
  /**
   * Teste la connectivité
   */
  static async testConnection() {
    console.log('🔍 === TEST CONNECTION UNIQUE ===');
    return db ? true : false;
  }
  
  /**
   * Sauvegarde SANS authentification
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO UNIQUE ===');
    console.log('💾 Allocations à sauvegarder:', allocations);
    
    try {
      const FIXED_USER_ID = 'anonymous-user-wow-v1';
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: FIXED_USER_ID,
        version: '1.0',
        timestamp: new Date().toISOString()
      };
      
      const docRef = doc(db, 'public-portfolios', FIXED_USER_ID);
      await setDoc(docRef, portfolioData);
      
      console.log('✅ Sauvegarde UNIQUE réussie !');
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE UNIQUE:', error);
      return false;
    }
  }
  
  /**
   * Récupération
   */
  static async getPortfolioAllocations() {
    console.log('📥 === GET PORTFOLIO UNIQUE ===');
    
    try {
      const FIXED_USER_ID = 'anonymous-user-wow-v1';
      const docRef = doc(db, 'public-portfolios', FIXED_USER_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Données récupérées UNIQUE:', data);
        
        const { lastUpdated, userId, version, timestamp, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version, timestamp }
        };
      } else {
        console.log('📭 Aucune allocation trouvée UNIQUE');
        return null;
      }
    } catch (error) {
      console.error('❌ ERREUR RÉCUPÉRATION UNIQUE:', error);
      return null;
    }
  }
}

export default FirebaseService;

