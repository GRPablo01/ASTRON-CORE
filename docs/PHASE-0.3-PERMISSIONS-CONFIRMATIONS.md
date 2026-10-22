# ASTRON CORE — Phase 0.3
## Permissions et confirmation humaine

- Statut : APPROUVÉ SOUS RÉSERVE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.3 — Permissions et confirmation humaine

---

## 1. Principe fondamental

Aucun agent ne dispose de permissions implicites ou illimitées.

Chaque outil possède une liste explicite d'opérations autorisées.
Le backend contrôle les autorisations avant chaque exécution.

Le modèle IA, l'agent coordinateur et les agents spécialisés ne peuvent
ni accorder leurs propres permissions ni contourner un refus.

En cas de doute, l'action est refusée.

## 2. Niveaux de risque

### Niveau R0 — Lecture contrôlée

Exemples :
- lire un fichier autorisé ;
- consulter une documentation du projet ;
- analyser du code sans le modifier.

Règles :
- accès limité aux chemins autorisés ;
- aucune lecture de secrets sans autorisation spécifique ;
- journalisation adaptée.

### Niveau R1 — Calcul et analyse sans modification

Exemples :
- calculer des valeurs ;
- comparer des fichiers ;
- analyser des données autorisées.

Règles :
- entrées validées ;
- limites de ressources appliquées ;
- aucune modification persistante implicite.

### Niveau R2 — Modification réversible

Exemples :
- créer un rapport dans l'espace de travail ;
- modifier un fichier autorisé ;
- générer un patch de code.

Règles :
- vérifier les droits d'écriture ;
- limiter les modifications aux fichiers prévus ;
- présenter un diff avant les modifications de code ;
- prévoir un retour arrière lorsque possible.

Une confirmation est requise pour toute écriture non préalablement autorisée
par une politique explicite et limitée.

Dans la première version, aucune politique de confirmation ne suffit à activer
une capacité d'écriture : celle-ci reste désactivée par défaut. Son activation
ultérieure exige l'implémentation et la validation préalable des contrôles
backend, des permissions et des tests de sécurité correspondants.

### Niveau R3 — Action sensible

Exemples :
- supprimer un fichier ;
- écraser des données existantes ;
- installer un paquet ;
- lancer un processus ayant des effets externes ;
- modifier une configuration sensible ;
- envoyer des données vers un service externe.

Règles :
- bloquée jusqu'à une confirmation explicite ;
- description précise de l'action et de ses conséquences ;
- vérification des permissions avant et après la confirmation ;
- paramètres figés et liés à la demande confirmée ;
- refus si les risques ne peuvent pas être évalués.

Une confirmation ne peut jamais autoriser une opération techniquement
interdite par la politique de sécurité.

### Niveau R4 — Action interdite

Exemples :
- exécution arbitraire sans contrôle ;
- contournement des permissions ;
- vol ou exfiltration non autorisée de données ;
- désactivation des mécanismes de sécurité ;
- suppression récursive ou formatage sans cadre de sécurité approuvé ;
- accès non autorisé aux secrets ou aux systèmes protégés.

Règles :
- refus systématique ;
- aucune exécution ;
- journalisation du refus sans exposer de secrets.

## 3. Permissions par outil

### Lecteur de fichiers

Autorisé :
- lire les chemins explicitement autorisés ;
- retourner le contenu nécessaire à la tâche.

Interdit :
- sortir du périmètre autorisé ;
- lire des secrets sans politique spécifique ;
- modifier ou supprimer des fichiers.

### Outil de calcul

Autorisé :
- effectuer des calculs définis ;
- transformer des données autorisées.

Interdit :
- utiliser le calcul comme moyen de contourner les limites ;
- lancer du code arbitraire avec accès système.

### Outil de modification de fichiers

Autorisé :
- créer ou modifier des fichiers autorisés ;
- produire des différences avant/après ;
- vérifier le résultat de l'écriture.

Interdit :
- écrire dans un chemin non autorisé ;
- supprimer ou écraser silencieusement des données ;
- modifier les règles de sécurité pour s'accorder des droits.

### Outil de commandes

Par défaut :
- désactivé pour les commandes arbitraires.

Toute capacité de commande doit utiliser des opérations prédéfinies,
des arguments validés, un périmètre limité et des contrôles d'exécution.

Les listes d'autorisation doivent être précises : une commande autorisée
ne doit pas permettre indirectement d'exécuter une commande non autorisée.

### Outil réseau

Par défaut :
- aucun envoi externe implicite ;
- aucune transmission de données privées sans autorisation.

Les destinations, données transmises et finalités doivent être contrôlées.

### Outil de gestion des agents

Autorisé :
- lancer les agents enregistrés et approuvés ;
- leur transmettre les seules données nécessaires ;
- suivre leur état.

Interdit :
- créer ou activer des permissions sans validation ;
- contourner les contrôles du backend ;
- transmettre des secrets sans autorisation.

## 4. Confirmation humaine

Une confirmation doit présenter :
- l'action exacte envisagée ;
- les fichiers, ressources ou destinations concernés ;
- les conséquences prévisibles ;
- les risques identifiés ;
- les paramètres effectifs de l'action ;
- les options confirmer ou refuser.

La confirmation doit être explicite, liée à une action précise et enregistrée.

Une réponse ambiguë ne vaut pas confirmation.

Une confirmation expirée, réutilisée ou associée à des paramètres modifiés
ne doit pas autoriser l'exécution.

Si l'action change après confirmation, une nouvelle confirmation est requise.

## 5. Cycle d'une action sensible

1. L'agent propose une action.
2. Le backend valide les paramètres et les permissions.
3. Le backend évalue le niveau de risque.
4. Si une confirmation est requise, l'action reste en attente.
5. L'utilisateur confirme ou refuse.
6. Le backend vérifie à nouveau les permissions et les paramètres.
7. L'outil exécute uniquement l'action confirmée et autorisée.
8. Le résultat ou l'échec est enregistré.
9. Le statut final est communiqué à l'utilisateur.

Aucune action sensible ne doit être exécutée avant l'étape de confirmation.

## 6. Refus et interruptions

En cas de refus :
- aucune exécution ne doit avoir lieu ;
- la tâche reçoit un statut explicite ;
- le motif du refus est communiqué ;
- les événements utiles sont journalisés.

En cas d'expiration ou d'interruption :
- l'action en attente n'est pas exécutée ;
- les tâches suivantes ne doivent pas contourner ce blocage ;
- l'état réel d'une opération déjà démarrée doit être vérifié.

L'annulation d'une opération ne garantit pas toujours l'annulation de ses
effets : le résultat doit être contrôlé.

## 7. Audit et confidentialité

Les journaux doivent permettre de retrouver :
- l'identifiant de la demande ;
- l'action proposée ;
- l'outil concerné ;
- la décision d'autorisation ;
- la confirmation, si nécessaire ;
- le résultat de l'exécution ou du refus.

Les mots de passe, clés privées, jetons et secrets ne doivent pas être
enregistrés en clair.

## 8. Tests de sécurité obligatoires

- Un outil sans permission est refusé.
- Une action sensible reste en attente avant confirmation.
- Un refus de l'utilisateur empêche l'exécution.
- Une confirmation expirée est rejetée.
- Une modification des paramètres invalide la confirmation précédente.
- Une permission retirée avant exécution entraîne un nouveau refus.
- Une commande non autorisée ne peut pas être exécutée indirectement.
- Un chemin hors périmètre est refusé.
- Un refus ne produit aucun effet métier ou fichier.
- Les journaux ne révèlent aucun secret.

## 9. Critère de sortie de la sous-étape 0.3

La sous-étape pourra être validée lorsque :
- les niveaux de risque sont approuvés ;
- les permissions des outils sont définies ;
- les actions exigeant une confirmation sont identifiées ;
- le cycle de confirmation est spécifié ;
- les tests de sécurité sont documentés.

## 10. Décision et réserve

Décision : APPROUVÉ SOUS RÉSERVE.

Réserve : dans la première version, les outils de création, de modification,
de déplacement et de suppression de fichiers restent désactivés. Le périmètre
initial se limite à la lecture et à l'analyse des données explicitement
autorisées. Toute activation ultérieure nécessitera des permissions backend
explicites, des contrôles techniques, des confirmations adaptées au risque
et des tests automatisés concluants.

Une confirmation humaine ne peut jamais remplacer une autorisation technique
ni permettre une action interdite. Cette validation documentaire ne prouve
pas que les contrôles sont déjà implémentés ou testés dans le code.

## 11. Statut de validation

Statut actuel : APPROUVÉ SOUS RÉSERVE.

Ce document définit les règles attendues. Leur application réelle devra
être démontrée par des tests lors de l'implémentation.
