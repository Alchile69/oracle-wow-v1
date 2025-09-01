// Service Firebase PROPRE utilisant la configuration unique
import { db, auth } from '../firebase-forced';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

export class FirebaseServiceClean {
  
  /**
   * Teste la connectivité Firebase
   */
  static async testConnection() {
    console.log('🔍 === TEST CONNECTION CLEAN ===');
    
    if (!db || !auth) {
      console.error('❌ Services CLEAN non initialisés');
      return false;
    }
    
    console.log('✅ Firebase CLEAN configuré et initialisé');
    return true;
  }
  
  /**
   * Initialise l'authentification anonyme PROPRE
   */
  static async initAuth() {
    console.log('🔐 === INIT AUTH CLEAN ===');
    console.log('🔐 Auth CLEAN object:', auth);
    console.log('🔐 Auth CLEAN config:', auth?.config);
    
    if (!auth) {
      throw new Error('Auth CLEAN non initialisé');
    }
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          console.log('🔐 Utilisateur CLEAN déjà connecté:', user.uid);
          resolve(user);
        } else {
          try {
            console.log('🔐 Tentative connexion anonyme CLEAN...');
            console.log('🔐 Auth CLEAN avant signIn:', auth);
            
            const userCredential = await signInAnonymously(auth);
            console.log('✅ Connexion anonyme CLEAN réussie:', userCredential.user.uid);
            resolve(userCredential.user);
          } catch (error) {
            console.error('❌ ERREUR CONNEXION ANONYME CLEAN:', error);
            console.error('❌ Error code CLEAN:', error.code);
            console.error('❌ Error message CLEAN:', error.message);
            console.error('❌ Auth CLEAN utilisé:', auth);
            reject(error);
          }
        }
      });
    });
  }
  
  /**
   * Sauvegarde PROPRE
   */
  static async savePortfolioAllocations(allocations) {
    console.log('💾 === SAVE PORTFOLIO CLEAN ===');
    console.log('💾 Allocations à sauvegarder CLEAN:', allocations);
    
    try {
      console.log('💾 Initialisation auth CLEAN...');
      const user = await this.initAuth();
      console.log('💾 User CLEAN obtenu:', user.uid);
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: user.uid,
        version: '1.0'
      };
      
      console.log('💾 Données à sauvegarder CLEAN:', portfolioData);
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      console.log('💾 Document ref CLEAN:', docRef);
      
      await setDoc(docRef, portfolioData);
      console.log('✅ Sauvegarde CLEAN réussie !');
      
      return true;
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE CLEAN:', error);
      return false;
    }
  }
  
  /**
   * Récupération PROPRE
   */
  static async getPortfolioAllocations() {
    console.log('📥 === GET PORTFOLIO ALLOCATIONS CLEAN ===');
    
    try {
      console.log('📥 Initialisation auth CLEAN...');
      const user = await this.initAuth();
      console.log('📥 User CLEAN obtenu:', user.uid);
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      console.log('📥 Document ref CLEAN:', docRef);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Données récupérées CLEAN:', data);
        
        const { lastUpdated, userId, version, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version }
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

