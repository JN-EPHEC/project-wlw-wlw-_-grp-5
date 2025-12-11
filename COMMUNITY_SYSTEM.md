# 📱 Système de Communautés et Discussions

## 🎯 Fonctionnalités implémentées

### 1️⃣ Création de Communauté
**Page**: `app/create-community.tsx`

L'utilisateur peut créer une nouvelle communauté avec :
- ✅ Nom de la communauté (obligatoire)
- ✅ Description (optionnelle)
- ✅ Sélection des membres parmi ses contacts privés
- ✅ Génération automatique d'un lien d'invitation unique

**Flux** :
1. Clic sur le bouton **+** dans l'onglet Discussions
2. Remplir le formulaire
3. Sélectionner les membres à inviter (liste des contacts avec qui on a discuté)
4. Cliquer sur "Créer"
5. Confirmation avec le lien généré

---

### 2️⃣ Partage du Lien d'Invitation
**Options disponibles** :

#### A) Partager par message externe
- Utilise l'API native `Share`
- Partage vers : SMS, Email, WhatsApp, Messenger, etc.
- Message pré-formaté avec nom, description et lien

#### B) Partager dans vos communautés
- Liste de toutes vos communautés
- Envoie le lien dans la communauté sélectionnée
- Les membres voient le message avec le lien cliquable

---

### 3️⃣ Rejoindre une Communauté via Lien
**Page**: `app/join/[inviteCode].tsx`

**Flux pour les nouveaux membres** :
1. Reçoit le lien : `https://app.wellnesshub.com/join/XXXXXX`
2. Clique sur le lien
3. L'app s'ouvre sur la page d'invitation
4. Voit les informations de la communauté :
   - Photo de couverture
   - Nom
   - Description
   - Nombre de membres
   - Créateur
5. Peut **Accepter** ou **Refuser**
6. Si accepte → devient membre et accède au chat

---

### 4️⃣ Discussions Privées
**Page**: `app/(tabs)/discussions.tsx`

- Liste des conversations privées
- Recherche de discussions et communautés
- Demandes de discussion (accepter/refuser)

---

### 5️⃣ Chat (Communautés et Privé)
**Page**: `app/chat/[id].tsx`

**Fonctionnalités** :
- ✅ Messages en temps réel (simulation)
- ✅ Affichage du nom de l'expéditeur (communautés)
- ✅ Signalement de messages (appui long)
- ✅ 6 raisons de signalement
- ✅ Interface iOS/WhatsApp

**Signalement** :
1. Appui long sur un message d'un autre utilisateur
2. Modal avec choix de la raison
3. Confirmation
4. Équipe de modération notifiée

---

## 🔗 Format du Lien d'Invitation

### Structure
```
https://app.wellnesshub.com/join/{inviteCode}
```

### Exemple
```
https://app.wellnesshub.com/join/1733259847123_a3f8k2
```

### Composition du code
- **Timestamp** : `1733259847123` (pour l'unicité)
- **Random** : `a3f8k2` (sécurité supplémentaire)

---

## 📋 Workflow Complet

### Scénario 1 : Créer et partager
```
Utilisateur A
  ↓
Crée "Méditation Matinale"
  ↓
Invite : Marie, Thomas (contacts privés)
  ↓
Partage lien dans "Développement Personnel" (sa communauté)
  ↓
Lien envoyé : https://app.wellnesshub.com/join/1733259847123_a3f8k2
```

### Scénario 2 : Rejoindre via lien
```
Utilisateur B (dans "Développement Personnel")
  ↓
Voit le message avec le lien
  ↓
Clique sur le lien
  ↓
App s'ouvre → Page d'invitation
  ↓
Voit infos de "Méditation Matinale"
  ↓
Clique "Rejoindre"
  ↓
Devient membre → Accès au chat
```

### Scénario 3 : Partage externe
```
Utilisateur A
  ↓
Crée la communauté
  ↓
Choisit "Partager par message"
  ↓
Sélectionne WhatsApp
  ↓
Message envoyé avec lien
  ↓
Contact externe clique
  ↓
Rejoint via l'app
```

---

## 🔐 Sécurité et Validation

### Validation du lien
- ✅ Vérification du format du code
- ✅ Vérification de l'existence de la communauté
- ✅ Gestion des liens expirés
- ✅ Message d'erreur si invalide

### Permissions
- ✅ Seuls les membres peuvent poster
- ✅ Créateur = admin par défaut
- ✅ Signalements traités par modération

---

## 📱 Interface Utilisateur

### Style
- Design iOS/WhatsApp moderne
- Animations fluides
- États de chargement
- Messages d'erreur clairs
- Confirmations visuelles

### Composants
- `CommunityCard` : Cartes compactes style WhatsApp
- `ChatPreviewCard` : Aperçus de discussions avec demandes
- `Modal` : Signalement et confirmations
- `ActivityIndicator` : États de chargement

---

## 🚀 Prochaines Étapes (Intégration Backend)

### Firebase/Firestore
1. Stocker les communautés avec codes d'invitation
2. Gérer les membres et permissions
3. Messages en temps réel
4. Signalements persistants
5. Notifications push

### API Endpoints
```typescript
POST /communities/create
GET  /communities/join/:inviteCode
POST /communities/:id/share
POST /messages/:id/report
GET  /users/conversations
```

---

## 📝 Résumé

✅ **Création** : Formulaire complet avec sélection de membres
✅ **Invitation** : Lien unique généré automatiquement
✅ **Partage** : 2 options (externe + communautés)
✅ **Adhésion** : Page dédiée avec infos et confirmation
✅ **Chat** : Fonctionnel avec signalement
✅ **Navigation** : Fluide entre toutes les pages

Le système est **prêt pour l'intégration backend** ! 🎉
