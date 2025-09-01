// Service Firebase SANS authentification - Solution finale
import { db } from '../firebase-forced';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export class FirebaseServiceNoAuth {
  
  /**
   * Teste la connectivité Firebase (SANS AUTH)
   */
  static async testConnection() {
    console.log('🔍 === TEST CONNECTION NO AUTH ===');
    
    if (!db) {
      console.error('❌ Firestore NO AUTH non initialisé');
      return false;
    }
    
    console.log('✅ Firestore NO AUTH configuré et initialisé');
    return true;
  }
  
  /**
   * Sauvegarde SANS authentification (utilise un ID fixe)
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO NO AUTH ===');
    console.log('💾 Allocations à sauvegarder NO AUTH:', allocations);
    
    try {
      // Utiliser un ID fixe au lieu de l'authentification
      const FIXED_USER_ID = 'anonymous-user-wow-v1';
      console.log('💾 Utilisation ID fixe NO AUTH:', FIXED_USER_ID);
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: FIXED_USER_ID,
        version: '1.0',
        timestamp: new Date().toISOString()
      };
      
      console.log('💾 Données à sauvegarder NO AUTH:', portfolioData);
      
      // Sauvegarder dans une collection publique
      const docRef = doc(db, 'public-portfolios', FIXED_USER_ID);
      console.log('💾 Document ref NO AUTH:', docRef);
      
      await setDoc(docRef, portfolioData);
      console.log('✅ Sauvegarde NO AUTH réussie !');
      
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE NO AUTH:', error);
      console.error('❌ Error code NO AUTH:', error.code);
      console.error('❌ Error message NO AUTH:', error.message);
      return false;
    }
  }
  
  /**
   * Récupération SANS authentification
   */
  static async getPortfolioAllocations() {
    console.log('📥 === GET PORTFOLIO ALLOCATIONS NO AUTH ===');
    
    try {
      const FIXED_USER_ID = 'anonymous-user-wow-v1';
      console.log('📥 Utilisation ID fixe NO AUTH:', FIXED_USER_ID);
      
      const docRef = doc(db, 'public-portfolios', FIXED_USER_ID);
      console.log('📥 Document ref NO AUTH:', docRef);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Données récupérées NO AUTH:', data);
        
        const { lastUpdated, userId, version, timestamp, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version, timestamp }
        };
      } else {
        console.log('📭 Aucune allocation trouvée NO AUTH');
        return null;
      }
    } catch (error) {
      console.error('❌ ERREUR RÉCUPÉRATION NO AUTH:', error);
      console.error('❌ Error code NO AUTH:', error.code);
      console.error('❌ Error message NO AUTH:', error.message);
      return null;
    }
  }
}

export default FirebaseServiceNoAuth;

