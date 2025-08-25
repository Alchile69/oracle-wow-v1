# WOW V1 - Phase 1 Checklist

## Préparation (30 minutes)

### Prérequis
- [ ] Accès au repository Oracle Portfolio V3
- [ ] Credentials Firebase (API Key, Project ID, etc.)
- [ ] Node.js 18+ installé
- [ ] Python 3.9+ installé
- [ ] Git configuré

### Fichiers nécessaires
- [ ] `phase1_setup.sh` (script d'installation)
- [ ] `backend_backtest_integration.py` (module FastAPI)
- [ ] `requirements_wow_v1.txt` (dépendances Python)
- [ ] `BacktestModule.jsx` (composant React)

## Jour 1 : Setup environnement (8h)

### Matin (4h)
- [ ] **9h00-9h30** : Exécuter `./phase1_setup.sh`
- [ ] **9h30-10h30** : Analyser la structure Oracle Portfolio V3
- [ ] **10h30-11h00** : Pause
- [ ] **11h00-12h00** : Identifier les points d'intégration
- [ ] **12h00-13h00** : Configurer l'environnement de développement

### Après-midi (4h)
- [ ] **14h00-15h00** : Installer les dépendances existantes
- [ ] **15h00-16h00** : Tester le démarrage local (`npm run wow:dev`)
- [ ] **16h00-16h15** : Pause
- [ ] **16h15-17h00** : Valider la connexion backend Railway
- [ ] **17h00-18h00** : Documenter l'architecture actuelle

### Validation Jour 1
- [ ] Repository cloné et fonctionnel
- [ ] Serveur de développement démarre sans erreur
- [ ] Backend Railway accessible
- [ ] Documentation architecture créée

## Jour 2 : Intégration Backtesting.py (8h)

### Matin (4h)
- [ ] **9h00-9h30** : Installation Backtesting.py (`pip install backtesting`)
- [ ] **9h30-11h00** : Intégrer `backend_backtest_integration.py`
- [ ] **11h00-11h15** : Pause
- [ ] **11h15-12h00** : Créer endpoints de base
- [ ] **12h00-13h00** : Tests de connectivité

### Après-midi (4h)
- [ ] **14h00-15h00** : Créer `backtestService.js` frontend
- [ ] **15h00-16h00** : Implémenter stratégie de test simple
- [ ] **16h00-16h15** : Pause
- [ ] **16h15-17h00** : Tests d'intégration frontend ↔ backend
- [ ] **17h00-18h00** : Validation des performances

### Tests Jour 2
- [ ] `curl /api/backtest/health` retourne 200
- [ ] `curl /api/backtest/strategies` retourne la liste
- [ ] Frontend peut appeler le backend sans erreur CORS
- [ ] Backtest simple s'exécute en < 10 secondes

### Validation Jour 2
- [ ] Module Backtesting.py intégré
- [ ] Endpoints API fonctionnels
- [ ] Service frontend configuré
- [ ] Tests de base validés

## Jour 3 : Configuration et validation (8h)

### Matin (4h)
- [ ] **9h00-10h00** : Configurer Firebase Firestore (nouvelles collections)
- [ ] **10h00-11h00** : Mettre à jour `.env.local` avec credentials
- [ ] **11h00-11h15** : Pause
- [ ] **11h15-12h00** : Tester authentification Firebase Auth
- [ ] **12h00-13h00** : Valider les APIs en cascade existantes

### Après-midi (4h)
- [ ] **14h00-15h00** : Finaliser la documentation technique
- [ ] **15h00-16h00** : Tester les scripts d'installation
- [ ] **16h00-16h15** : Pause
- [ ] **16h15-17h00** : Tests de déploiement
- [ ] **17h00-18h00** : Préparer la Phase 2

### Tests Jour 3
- [ ] Firebase Auth fonctionne (login/logout)
- [ ] Firestore lit/écrit les données
- [ ] APIs externes répondent (Yahoo Finance, Alpha Vantage)
- [ ] Build de production réussit (`npm run wow:build`)

### Validation Jour 3
- [ ] Configuration complète validée
- [ ] Documentation technique finalisée
- [ ] Scripts d'installation automatisés
- [ ] Environnement prêt pour Phase 2

## Validation finale Phase 1

### Critères de succès
- [ ] ✅ Oracle Portfolio V3 cloné et fonctionnel
- [ ] ✅ Backtesting.py intégré dans le backend
- [ ] ✅ Endpoint `/api/backtest/health` répond
- [ ] ✅ Frontend peut appeler le backend
- [ ] ✅ Firebase Auth et Firestore configurés
- [ ] ✅ Documentation technique complète

### Tests de régression
- [ ] Fonctionnalités Oracle Portfolio existantes fonctionnent
- [ ] Aucune régression dans l'interface utilisateur
- [ ] Performance acceptable (< 3s chargement)
- [ ] Responsive design maintenu

### Livrables Phase 1
- [ ] Code source intégré et testé
- [ ] Documentation technique complète
- [ ] Scripts d'installation automatisés
- [ ] Environnement de développement configuré
- [ ] Tests de base validés

## Commandes utiles

### Développement
```bash
# Démarrer le serveur de développement
npm run wow:dev

# Tests backend
curl https://oracle-backend-railway.up.railway.app/api/backtest/health

# Build de production
npm run wow:build

# Tests automatisés UI
npm run auto-ui
```

### Debugging
```bash
# Logs backend (si local)
tail -f backend.log

# Vérifier les dépendances
npm list
pip list

# Tests de connectivité
ping oracle-backend-railway.up.railway.app
```

### Déploiement
```bash
# Déploiement Vercel
npx vercel --prod

# Push vers GitHub (déploiement auto Railway)
git push origin main
```

## Contacts et ressources

### URLs importantes
- **Frontend Vercel** : https://oracle-portfolio-v3-7p0jg50o5-alain-poncelas-projects.vercel.app
- **Backend Railway** : https://oracle-backend-railway.up.railway.app
- **Repository GitHub** : https://github.com/Alchile69/oracle-portfolio-v3.git

### Documentation
- **Backtesting.py** : https://kernc.github.io/backtesting.py/
- **Chart.js** : https://www.chartjs.org/docs/
- **React Leaflet** : https://react-leaflet.js.org/
- **Firebase** : https://firebase.google.com/docs

### Support
- **Issues GitHub** : Créer une issue sur le repository
- **Documentation WOW V1** : `wow_v1_phase1_preparation.md`
- **Logs Railway** : Dashboard Railway pour monitoring

---

**Phase 1 prête pour exécution ! 🚀**

*Durée estimée : 3 jours*  
*Prérequis : Accès Oracle Portfolio V3 + Credentials Firebase*  
*Objectif : Environnement de développement WOW V1 opérationnel*

