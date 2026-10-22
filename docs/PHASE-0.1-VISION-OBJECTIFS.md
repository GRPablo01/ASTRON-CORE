# ASTRON CORE — Phase 0.1
## Vision et objectifs

- Statut : APPROUVÉ SOUS RÉSERVE
- Projet : ASTRON CORE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.1 — Vision et objectifs

---

## 1. Vision générale

ASTRON CORE est une plateforme locale d'intelligence artificielle composée
d'un agent principal coordinateur, d'agents spécialisés, d'une interface web,
d'une API backend et d'un moteur d'inférence local via Ollama.

La plateforme doit être modulaire, traçable, contrôlable et évolutive.

Le fonctionnement de base ne doit pas nécessiter de service payant externe.

## 2. Objectifs principaux

1. Recevoir et comprendre les demandes de l'utilisateur.
2. Décomposer une demande en tâches identifiables.
3. Choisir les agents et outils autorisés pour chaque tâche.
4. Coordonner les résultats et vérifier leur cohérence.
5. Présenter les résultats dans une interface web locale.
6. Tracer les décisions, exécutions, erreurs et confirmations.
7. Appliquer les permissions indépendamment des décisions du modèle IA.
8. Bloquer par défaut les opérations destructrices et les commandes arbitraires.
9. Permettre des tests reproductibles et une validation progressive.
10. Fonctionner avec des modèles locaux compatibles via Ollama.

## 3. Architecture cible

### 3.1 Interface web

Technologie cible : Angular.

Responsabilités :
- présenter les conversations et résultats ;
- afficher l'état et la progression des tâches ;
- présenter les demandes de confirmation ;
- afficher les erreurs et journaux accessibles ;
- permettre à l'utilisateur de contrôler les opérations sensibles.

L'interface ne constitue pas la frontière de sécurité : les permissions
doivent également être contrôlées par le backend.

### 3.2 API et backend

Technologies cibles : Node.js et Express.

Responsabilités :
- recevoir et valider les requêtes ;
- attribuer des identifiants aux demandes et aux tâches ;
- gérer les agents et leur orchestration ;
- appliquer les permissions côté serveur ;
- gérer les confirmations humaines ;
- enregistrer les événements et les erreurs ;
- communiquer avec Ollama via une interface contrôlée.

### 3.3 Agent principal coordinateur

Responsabilités :
- analyser la demande ;
- proposer un plan d'exécution ;
- sélectionner les agents autorisés ;
- distribuer les tâches ;
- suivre leur état ;
- vérifier les résultats ;
- expliquer les échecs et restituer le résultat final.

Limites :
- ne peut pas s'accorder de nouvelles permissions ;
- ne peut pas contourner les contrôles backend ;
- ne peut pas exécuter librement des commandes système ;
- doit attendre une confirmation valide pour toute action qui l'exige.

### 3.4 Agents spécialisés

Les agents sont des composants aux responsabilités limitées.
Leurs missions sont définies explicitement et leurs outils sont autorisés
individuellement.

Exemples de spécialités futures :
- analyse de fichiers ;
- calcul et transformation de données ;
- assistance au développement ;
- vérification et contrôle qualité ;
- recherche dans les sources locales autorisées.

Un agent ne peut utiliser que les outils auxquels il a été autorisé.

### 3.5 Moteur IA local

Technologie cible : Ollama.

Responsabilités :
- exécuter les modèles locaux compatibles ;
- fournir les capacités de compréhension et de génération ;
- communiquer avec le backend selon un contrat défini.

Contraintes :
- aucun abonnement payant ne doit être obligatoire pour le fonctionnement
  de base ;
- la disponibilité dépend du modèle installé et des ressources matérielles ;
- une réponse du modèle n'est jamais considérée comme une autorisation ;
- les sorties du modèle doivent être validées avant toute action.

## 4. Principes de sécurité

1. Refus par défaut en cas de permission absente ou indéterminée.
2. Contrôles d'autorisation exécutés côté backend.
3. Séparation entre proposition du modèle et exécution réelle.
4. Confirmation humaine explicite pour les actions sensibles.
5. Blocage par défaut des suppressions, écrasements risqués et commandes
   arbitraires.
6. Validation des entrées, chemins, paramètres et sorties d'outils.
7. Journalisation des opérations et de leur résultat.
8. Protection des secrets et des données non autorisées.
9. Possibilité d'interrompre une tâche lorsque cela est techniquement possible.
10. Aucun contournement silencieux d'un refus de permission.

Les détails des autorisations et des confirmations seront définis en 0.2 et 0.3.

## 5. Principes de fonctionnement local

Le parcours principal doit fonctionner sur la machine locale avec les
composants nécessaires installés et configurés.

Les dépendances externes facultatives devront être identifiées clairement.
Une panne réseau ou l'indisponibilité d'un service externe ne doit pas
empêcher les fonctions purement locales qui n'en dépendent pas.

## 6. Traçabilité attendue

Chaque demande devra pouvoir être associée, selon le périmètre retenu, à :
- un identifiant de demande ;
- des identifiants de tâches ;
- un état et des horodatages ;
- l'agent et les outils concernés ;
- les décisions d'autorisation ;
- les confirmations nécessaires ;
- les résultats ou erreurs ;
- les événements utiles à l'audit.

Les secrets, jetons d'accès et contenus sensibles ne doivent pas être
inscrits en clair dans les journaux.

## 7. Objectifs mesurables et critères de validation

Les critères détaillés sont définis dans le document
`PHASE-0.4-CRITERES-REUSSITE.md`. Ils doivent notamment permettre de vérifier :
- le suivi d'une demande de bout en bout ;
- le refus effectif d'une action non autorisée ;
- l'attente d'une confirmation lorsqu'elle est obligatoire ;
- l'absence d'exécution d'une action refusée ;
- l'explication des erreurs ;
- la reproductibilité des tests ;
- le fonctionnement des scénarios locaux sans service payant obligatoire.

## 8. Critère de sortie de la sous-étape 0.1

La sous-étape 0.1 pourra être déclarée terminée lorsque :
- la vision générale est approuvée ;
- les responsabilités des composants sont comprises ;
- les limites fondamentales sont acceptées ;
- le document est relu et validé par l'utilisateur.

## 9. Périmètre fonctionnel de la première version

### 9.1 Mode initial : lecture et analyse

La première version d'ASTRON CORE fonctionne en lecture et analyse uniquement.

Fonctions autorisées, dans les espaces explicitement permis :
- lire et analyser des fichiers ;
- rechercher des informations dans les sources autorisées ;
- effectuer des calculs et transformations sans modifier les fichiers sources ;
- proposer un plan ou des changements sans les appliquer ;
- présenter les résultats et les erreurs à l'utilisateur.

### 9.2 Modifications désactivées par défaut

La création, la modification, le déplacement et la suppression de fichiers
ne sont pas autorisés dans le périmètre initial.

Le passage à un mode permettant des modifications nécessitera au préalable :
- des permissions explicites appliquées côté backend ;
- des confirmations humaines adaptées au risque ;
- une validation des chemins et paramètres au moment de l'exécution ;
- des tests automatisés concluants, notamment pour les refus et les erreurs ;
- une activation explicite de cette capacité.

Les commandes système arbitraires et les actions destructrices restent
bloquées par défaut. Une confirmation humaine ne permet jamais de contourner
une action interdite par la politique de sécurité.

### 9.3 Statut de la décision

Décision : APPROUVÉ SOUS RÉSERVE.

Réserve : le mode de lecture et d'analyse constitue le périmètre initial.
Toute capacité de modification sera étudiée et activée ultérieurement,
après validation des permissions, des confirmations et des tests techniques.

---

## 10. Statut de validation

Statut actuel : APPROUVÉ SOUS RÉSERVE.

Ce document définit une cible d'architecture et le périmètre initial. Il ne prouve pas que les fonctionnalités décrites sont déjà implémentées ou testées.
