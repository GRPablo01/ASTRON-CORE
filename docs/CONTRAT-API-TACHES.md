# ASTRON-CORE — Contrat API des tâches

## 1. Création d'une tâche

- Méthode : `POST`
- Route : `/api/tasks`
- Content-Type : `application/json`

### Requête

Le corps doit contenir uniquement le champ `name`.

    {
      "name": "Nom de la tâche"
    }

Règles :
- `name` est obligatoire et doit être une chaîne non vide après suppression des espaces.
- `name` ne doit pas dépasser 100 caractères après suppression des espaces.
- Les champs inconnus sont refusés.

### Réponse de succès

Code HTTP : `201 Created`

    {
      "success": true,
      "data": {
        "task": {
          "taskId": "identifiant-unique",
          "name": "Nom de la tâche",
          "status": "pending",
          "progress": 0
        }
      },
      "meta": {
        "requestId": "identifiant-de-requete",
        "timestamp": "date-ISO-8601"
      }
    }

Le `taskId` identifie la tâche créée. Le statut initial est `pending` et la progression initiale est `0`.

Les valeurs de `requestId` et `timestamp` sont générées par le middleware de contexte de requête.

## 2. Vérification de santé

- Méthode : `GET`
- Route : `/api/health`

Une réponse HTTP `200` indique que l'endpoint de santé répond. Elle contient le statut `ok`, le nom du service et les métadonnées de la requête.

Cette réponse ne garantit pas à elle seule que tous les services internes fonctionnent correctement.

## 3. Erreurs

### Route inconnue

Une route inconnue renvoie HTTP `404` avec le code `NOT_FOUND`.

### Requête invalide

Les requêtes de création invalides sont rejetées par le middleware de validation avant la création de la tâche. Le format détaillé des erreurs dépend des middlewares de validation et de gestion des erreurs.

## 4. Limites actuelles

- Les tâches sont conservées en mémoire.
- Aucune persistance durable n'est définie.
- Aucune route de consultation ou de mise à jour d'une tâche n'est exposée par ce contrat.
- La création d'une tâche ne signifie pas qu'un travail de fond a été exécuté.
- Aucun mécanisme de diffusion temps réel n'est imposé.

## 5. Références d'implémentation

- API : `backend/server.js`
- Validation : `backend/contracts/task.contract.js`
- Cycle de vie : `backend/services/task-lifecycle.service.js`
- Contrat partagé des événements : `shared/contracts/task.contract.js`
