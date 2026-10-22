# ASTRON CORE — Phase 0.2
## Périmètre et limites

- Statut : APPROUVÉ SOUS RÉSERVE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.2 — Périmètre et limites

---

## 1. Principe général

ASTRON CORE ne peut agir que dans un périmètre explicitement autorisé.
Toute capacité non définie, tout chemin non autorisé et toute opération
dont le risque ne peut pas être déterminé sont refusés par défaut.

Le modèle IA peut proposer une action, mais seul le backend peut autoriser
son exécution.

## 2. Lecture des données

### Autorisée sous conditions

- Lire les fichiers explicitement accessibles dans les espaces autorisés.
- Lire les fichiers de configuration nécessaires au projet, hors secrets.
- Parcourir les dossiers autorisés sans sortir de leur périmètre.
- Lire les journaux applicatifs expurgés des secrets.
- Analyser le code source et les fichiers de documentation autorisés.

### Interdite par défaut

- Lire les clés API, mots de passe, jetons, clés privées ou fichiers de secrets.
- Accéder aux dossiers personnels sans autorisation explicite.
- Lire des fichiers situés hors des espaces autorisés.
- Extraire ou transmettre des données vers un service externe sans permission.
- Contourner les permissions du système d'exploitation.

## 3. Calculs et analyses

### Autorisés

- Effectuer des calculs mathématiques.
- Analyser et transformer des données fournies ou autorisées.
- Comparer des fichiers et détecter des différences.
- Vérifier la cohérence de données et de configurations.
- Exécuter des tests explicitement approuvés dans un environnement contrôlé.

### Limites

- Les résultats doivent être présentés avec leurs limites lorsque nécessaire.
- Les entrées doivent être validées avant traitement.
- Les calculs coûteux doivent respecter des limites de temps et de ressources.
- Les calculs ne donnent jamais le droit de modifier des données.

## 4. Création et modification de fichiers

Les capacités décrites dans cette section définissent la politique cible.
Elles ne sont pas activées par défaut dans la première version : celle-ci
reste limitée à la lecture et à l'analyse des données explicitement autorisées.
Toute activation ultérieure dépendra des contrôles backend, des permissions,
des confirmations humaines adaptées au risque et des tests définis en 0.3 et 0.4.

### Autorisées sous conditions

- Créer des fichiers dans un espace de travail autorisé.
- Modifier les fichiers explicitement inclus dans le périmètre de la tâche.
- Produire des rapports, tests et documentations.
- Proposer un diff avant toute modification de code.
- Préserver une copie ou un mécanisme de retour arrière lorsque possible.

### Interdites par défaut

- Écraser des fichiers sans autorisation adaptée.
- Supprimer des fichiers ou dossiers.
- Modifier des fichiers système ou des données personnelles.
- Modifier les règles de sécurité, permissions ou journaux pour contourner un refus.
- Écrire hors des répertoires autorisés.
- Remplacer des fichiers contenant des secrets.

Les opérations sensibles devront suivre la politique de confirmation définie
dans la sous-étape 0.3.

## 5. Commandes et processus

- Aucune commande shell arbitraire ne doit être exécutée directement à partir
  d'une sortie du modèle IA.
- Les outils doivent exposer des opérations précises avec des paramètres validés.
- Les commandes autorisées doivent être définies par une liste explicite.
- Les arguments doivent être validés indépendamment de leur origine.
- Les opérations réseau, l'installation de paquets et le lancement de processus
  doivent être limités et contrôlés.
- Les commandes destructrices sont bloquées par défaut.
- Une confirmation humaine ne remplace jamais une validation technique.

## 6. Zones interdites par défaut

- Système d'exploitation et fichiers système.
- Identifiants, mots de passe, clés privées et jetons.
- Données personnelles sans autorisation explicite.
- Répertoires situés hors du périmètre autorisé.
- Suppression récursive et formatage de supports.
- Désactivation de protections ou de contrôles de sécurité.
- Modification des permissions pour obtenir un accès supplémentaire.
- Exfiltration de données ou envoi externe non autorisé.
- Exécution de code arbitraire non contrôlé.

## 7. Protection contre les chemins dangereux

Le backend doit :
- résoudre les chemins de manière sûre ;
- vérifier que le chemin final reste dans le répertoire autorisé ;
- refuser les traversées de répertoires non autorisées ;
- traiter les liens symboliques avec précaution ;
- vérifier les permissions au moment de l'exécution ;
- éviter les conditions de concurrence entre vérification et utilisation.

Une simple vérification textuelle du chemin n'est pas suffisante.

## 8. Défense en profondeur

- Validation côté backend, même si l'interface a déjà validé les données.
- Liste d'outils autorisés plutôt qu'un accès général au système.
- Limites de temps, de taille et de ressources.
- Journaux d'audit sans secrets.
- Refus explicite en cas de doute.
- Tests vérifiant qu'une action refusée n'a produit aucun effet.

## 9. Statut des capacités

Ce document définit la politique cible. Il ne garantit pas que les contrôles
sont déjà implémentés dans le code.

Chaque capacité devra être reliée à un contrôle technique et à un test
avant d'être considérée comme opérationnelle.

## 10. Critère de sortie de la sous-étape 0.2

La sous-étape pourra être validée lorsque :
- les données accessibles sont définies ;
- les calculs autorisés sont identifiés ;
- les limites de modification sont acceptées ;
- les opérations interdites par défaut sont documentées ;
- les règles sont suffisamment précises pour être testées.

## 11. Décision et réserve

Décision : APPROUVÉ SOUS RÉSERVE.

Réserve : la première version est limitée à la lecture et à l'analyse
des données explicitement autorisées. La création, la modification,
le déplacement et la suppression de fichiers restent désactivés par défaut.
Leur activation ultérieure nécessitera des contrôles backend, des permissions
explicites, des confirmations humaines adaptées au risque et des tests
automatisés démontrant notamment le refus des opérations interdites.

Cette validation documentaire ne prouve pas que les contrôles sont déjà
implémentés ou testés dans le code.

## 12. Statut de validation

Statut actuel : APPROUVÉ SOUS RÉSERVE.
