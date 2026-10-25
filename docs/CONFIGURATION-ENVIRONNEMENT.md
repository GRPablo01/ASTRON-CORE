# ASTRON CORE — Configuration de l’environnement

## 1. Objectif

Centraliser les règles de configuration d’ASTRON CORE, distinguer les environnements de développement et de production et préparer une gestion cohérente des paramètres du frontend et du backend.

## 2. Variables de configuration

Le fichier `.env.example` documente les valeurs de référence pour le développement local.

| Variable | Valeur de référence | Usage |
|---|---|---|
| `FRONTEND_PORT` | `4200` | Port prévu pour Angular |
| `BACKEND_HOST` | `127.0.0.1` | Adresse d’écoute prévue pour le backend local |
| `BACKEND_PORT` | `3000` | Port prévu pour l’API |
| `OLLAMA_HOST` | `http://127.0.0.1:11434` | Adresse locale du moteur Ollama |
| `OLLAMA_MODEL` | `qwen3:8b` | Modèle Ollama prévu |

Ces valeurs définissent les conventions du projet. Le frontend Angular a été créé et son serveur de développement fonctionne sur le port `4200`. Le backend n’est pas encore implémenté.

La présence d’une variable dans `.env.example` ne signifie pas qu’elle est chargée ou utilisée par une application.

## 3. Développement

- Utiliser `.env.example` comme modèle de référence.
- Créer un fichier `.env` local uniquement lorsqu’un composant en a besoin.
- Ne jamais inscrire de mot de passe, jeton, clé API ou autre secret dans `.env.example`.
- Le fichier `.env` et les fichiers `.env.*` sont exclus de Git, à l’exception de `.env.example`.
- Distinguer les paramètres du frontend de ceux du backend.
- Ne pas supposer que les variables du fichier `.env` sont accessibles directement dans le navigateur : leur exposition éventuelle au frontend devra être explicitement définie et limitée aux paramètres non sensibles.

## 4. Production

- Ne pas réutiliser automatiquement les valeurs de développement en production.
- Fournir les paramètres de production par le mécanisme de configuration de l’environnement de déploiement.
- Ne pas versionner de secrets ni de fichier de configuration de production contenant des informations sensibles.
- Définir les valeurs de production, les règles réseau et la gestion des secrets avant le déploiement.
- Vérifier les adresses d’écoute et l’exposition réseau du backend avant toute mise en production.

## 5. État et limites

À ce stade :

- Les conventions de configuration sont documentées.
- Le frontend Angular est créé et démarre en développement sur le port `4200`.
- Le backend Node.js / Express reste à créer.
- Le chargement, la validation et l’utilisation effective des variables d’environnement restent à implémenter et à tester.
- La séparation développement/production est documentée, mais n’est pas encore techniquement appliquée par une application déployable.

La configuration ne sera considérée comme validée techniquement qu’après l’implémentation des mécanismes de chargement et de validation, puis l’exécution de tests adaptés.
