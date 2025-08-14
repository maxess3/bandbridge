# Prisma Seeds

Ce dossier contient les scripts de seed pour peupler votre base de données avec des données de test.

## Scripts disponibles

### 1. Seed des instruments (`seed.ts`)

- **Commande**: `npm run seed`
- **Description**: Crée tous les types d'instruments disponibles dans l'application
- **Contenu**: 40+ instruments répartis en 6 catégories (Strings, Wind, Percussion, Keyboard, Electronic, Other)

### 2. Seed des profils (`seedProfiles.ts`)

- **Commande**: `npm run seed:profiles`
- **Description**: Crée 50 profils d'utilisateurs avec des données variées et réalistes
- **Contenu**:
  - Utilisateurs avec noms, emails, pseudonymes uniques
  - Profils avec descriptions, genres musicaux, localisation
  - Instruments assignés aléatoirement (1-3 par profil)
  - Liens sociaux (YouTube, Instagram, SoundCloud, Twitter, TikTok)
  - Données de performance (concerts, répétitions, type de pratique)

### 3. Seed complet (`seedAll.ts`)

- **Commande**: `npm run seed:all`
- **Description**: Exécute les deux seeds dans l'ordre (instruments puis profils)
- **Recommandé**: Pour une première initialisation complète

## Utilisation

### Première fois

```bash
# Assurez-vous que votre base de données est prête
npx prisma migrate dev

# Exécutez le seed complet
npm run seed:all
```

### Seed sélectif

```bash
# Seulement les instruments
npm run seed

# Seulement les profils (nécessite que les instruments existent déjà)
npm run seed:profiles
```

## Structure des données générées

### Profils créés

- **50 profils** avec des données variées
- **Pseudonymes** musicaux uniques (JazzMaster, RockStar, etc.)
- **Localisation** : 50 villes françaises + pays francophones
- **Genres musicaux** : 1-4 genres par profil
- **Instruments** : 1-3 instruments par profil avec niveaux variés
- **Liens sociaux** : 1-3 plateformes par profil

### Données réalistes

- **Âges** : 20-50 ans
- **Expérience** : Débutant à Expert
- **Statuts** : 60% cherchent un groupe
- **Activité** : Dernière connexion dans les 30 jours
- **Vérification** : 70% des comptes vérifiés

## Personnalisation

Vous pouvez modifier les données générées en éditant :

- `firstNames` et `lastNames` pour les noms
- `pseudonymes` pour les pseudonymes musicaux
- `cities` et `countries` pour la localisation
- `descriptions` pour les descriptions de profil
- `socialLinks` pour les plateformes sociales

## Notes importantes

- **Dépendances** : Le seed des profils nécessite que les instruments existent déjà
- **Doublons** : Les scripts utilisent `upsert` pour éviter les doublons
- **Hachage** : Les mots de passe sont des hashes factices (pas de connexion réelle)
- **Performance** : Le seed complet prend environ 10-30 secondes selon votre base de données

## Résolution de problèmes

### Erreur de connexion à la base

```bash
# Vérifiez votre fichier .env
cat .env

# Testez la connexion
npx prisma db pull
```

### Erreur de types Prisma

```bash
# Régénérez le client Prisma
npx prisma generate
```

### Erreur de migration

```bash
# Remettez la base à zéro
npx prisma migrate reset
# Puis relancez le seed
npm run seed:all
```
