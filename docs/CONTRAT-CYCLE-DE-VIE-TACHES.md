# ASTRON-CORE — Contrat du cycle de vie des tâches

## 1. Objectif

Définir les états, les événements et les transitions autorisées des tâches.

Ce contrat est indépendant du mécanisme de transport : aucune dépendance à Socket.IO n'est requise.

Le contrat technique partagé est défini dans `shared/contracts/task.contract.js`.

Ce document définit les règles métier attendues. Il ne signifie pas que l'exécution des tâches, la persistance ou la diffusion des événements sont déjà implémentées.

## 2. États d'une tâche

| État | Signification | Terminal |
|---|---|---|
| `pending` | Tâche créée, en attente d'exécution | Non |
| `running` | Tâche en cours d'exécution | Non |
| `completed` | Tâche terminée avec succès | Oui |
| `failed` | Tâche terminée en erreur | Oui |

Les états `completed` et `failed` sont terminaux. Aucune reprise depuis ces états n'est définie par ce contrat.

## 3. Transitions autorisées

| État initial | État suivant autorisé |
|---|---|
| `pending` | `running`, `failed` |
| `running` | `completed`, `failed` |
| `completed` | Aucun |
| `failed` | Aucun |

Une transition non répertoriée est interdite.

Toute transition doit être vérifiée à partir de l'état courant de la tâche. Un événement qui entraînerait une transition interdite doit être refusé sans modifier l'état de la tâche.

La fonction `canTransitionTaskStatus` de `shared/contracts/task.contract.js` définit les transitions autorisées dans le contrat partagé.

## 4. Événements

Les noms définis dans le contrat partagé sont :

- `task.created`
- `task.started`
- `task.progress`
- `task.completed`
- `task.failed`

### 4.1 Structure commune

Chaque événement doit contenir les champs suivants :

| Champ | Rôle | Validation actuelle |
|---|---|---|
| `eventId` | Identifiant unique de l'événement | Chaîne non vide |
| `taskId` | Identifiant unique de la tâche concernée | Chaîne non vide |
| `type` | Nom de l'événement | Chaîne correspondant à un événement connu |
| `timestamp` | Date de l'événement | Chaîne non vide interprétable comme une date |

La fonction `validateTaskEvent` de `shared/contracts/task.contract.js` vérifie la structure minimale, les champs obligatoires, le type d'événement et l'interprétabilité de l'horodatage.

La validation actuelle ne garantit pas à elle seule l'unicité réelle des identifiants.

Le format ISO 8601 est recommandé pour `timestamp`, mais la validation actuelle utilise `Date.parse` et ne garantit pas une conformité stricte à ISO 8601.

### 4.2 Unicité des identifiants

Les règles suivantes sont retenues pour ASTRON-CORE :

- Chaque tâche reçoit un `taskId` unique lors de sa création.
- Chaque événement reçoit un `eventId` unique.
- La génération des identifiants utilise `crypto.randomUUID()`.
- L'identifiant de requête `requestId` reste distinct des identifiants de tâche et d'événement.

La génération d'un identifiant et la garantie de son unicité à l'échelle du système sont deux aspects distincts. La validation du contrat ne suffit pas à garantir l'unicité : celle-ci devra être respectée par le mécanisme de création et, lorsque nécessaire, par le stockage retenu.

### 4.3 Règles de progression

L'événement `task.progress` transporte un champ `progress`, entier compris entre `0` et `100` inclus.

Les règles suivantes sont retenues :

- La progression ne peut être mise à jour que lorsque la tâche est `running`.
- Une progression ne peut pas diminuer pour une même tâche.
- Une progression doit être un entier compris entre `0` et `100`.
- Une progression de `100` ne remplace pas l'événement terminal `task.completed`.
- La progression n'est pas obligatoire pour une tâche en cours.
- Une progression invalide ou incompatible avec l'état courant doit être refusée sans modifier l'état ni la progression enregistrée.

Les règles de reprise après erreur ne sont pas définies par ce contrat.

## 5. Ordre et duplication des événements

### 5.1 Idempotence

Un événement reçu en double ne doit pas provoquer deux fois le même effet.

La règle retenue est la suivante :

- Un événement dont le `eventId` a déjà été traité est ignoré.
- Un événement dupliqué ne doit provoquer aucune modification supplémentaire de l'état ou de la progression.
- La vérification du doublon doit précéder toute modification de l'état de la tâche.
- Le suivi des événements traités devra être adapté au stockage retenu lors de la phase 4.

La validation structurelle d'un événement ne constitue pas, à elle seule, un mécanisme d'idempotence. L'application devra suivre les identifiants des événements traités pour pouvoir reconnaître les doublons.

### 5.2 Événements reçus dans le désordre

Les règles suivantes sont retenues :

- Toute transition incompatible avec l'état courant est refusée.
- Un événement refusé ne doit pas modifier l'état ni la progression de la tâche.
- Aucun retour vers un état antérieur n'est autorisé.
- Les états `completed` et `failed` restent terminaux.
- Un événement de progression reçu lorsque la tâche n'est pas `running` est refusé.
- Une progression inférieure à la progression courante est refusée.

La réception d'un événement plus ancien ne doit donc pas permettre de revenir à un état précédent ni de diminuer la progression.

Le traitement des événements désordonnés repose sur l'état courant de la tâche et sur les règles de transition. Aucun mécanisme de transport temps réel n'est imposé par ce contrat.

## 6. Périmètre d'implémentation et points restant à préciser

Les règles métier suivantes sont retenues pour la phase 3 :

- génération d'identifiants de tâche et d'événement avec `crypto.randomUUID()` ;
- vérification des transitions autorisées ;
- refus des événements incompatibles avec l'état courant ;
- reconnaissance des événements déjà traités ;
- contrôle de la progression et de sa non-décroissance ;
- absence de modification de l'état ou de la progression lorsqu'un événement est refusé.

Les éléments suivants restent à préciser ou à mettre en œuvre :

- la garantie effective de l'unicité des identifiants à l'échelle du système ;
- le format d'horodatage strict, notamment la conformité ISO 8601 ;
- le mécanisme concret de suivi des événements traités ;
- la conservation durable de ce suivi, qui dépendra du choix de stockage de la phase 4 ;
- les tests d'intégration vérifiant l'application réelle des transitions, de l'idempotence et des règles de progression.

Ces points doivent être traités sans anticiper le choix de stockage de la phase 4.

Aucune dépendance à Socket.IO n'est imposée par ce contrat.

## 7. Référence d'implémentation

Les statuts, événements, transitions et fonctions de validation partagés sont centralisés dans :

`shared/contracts/task.contract.js`

Les tests du contrat partagé sont dans :

`shared/test/task.contract.test.js`

Ce document décrit les règles retenues et leur périmètre d'implémentation. Il ne signifie pas que l'exécution des tâches, l'application effective de toutes les transitions, le suivi des événements traités, la persistance ou la diffusion des événements sont déjà implémentés.