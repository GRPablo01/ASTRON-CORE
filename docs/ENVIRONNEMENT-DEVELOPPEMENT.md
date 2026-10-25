# ASTRON CORE — Environnement de développement

## 1. Versions constatées

| Élément | Version ou état constaté |
|---|---|
| Système | macOS, architecture arm64 |
| Node.js | `v22.23.3` |
| npm | `10.9.9` |
| Angular CLI locale | `22.2.4` |
| Angular Core | `22.2.3` |
| Angular Compiler CLI | `22.2.3` |
| Angular Build | `22.2.4` |
| TypeScript | `6.0.3`, installé localement |
| RxJS | `7.8.2` |
| Ollama | `0.40.7`, version constatée lors du diagnostic initial |
| Modèle Ollama | `qwen3:8b`, installé lors du diagnostic initial |

Les versions de Node.js, npm, Angular CLI locale, Angular, TypeScript et Ollama ont été revérifiées le 23 octobre 2026. Le modèle qwen3:8b est également présent dans l'installation locale d'Ollama. La CLI globale précédemment constatée était en version 20.3.6 ; le frontend utilise sa propre CLI locale.

## 2. Ports et services

| Service | Adresse prévue | État constaté |
|---|---|---|
| Frontend Angular | `http://localhost:4200/` | Serveur de développement démarré avec succès |
| API Node.js / Express | `127.0.0.1:3000` | Port libre lors du diagnostic initial ; API non encore créée |
| Ollama | `127.0.0.1:11434` | En écoute lors du diagnostic initial |

Ces états correspondent aux contrôles réalisés. Ils peuvent évoluer selon les processus en cours.

## 3. État du frontend

- Application Angular créée dans `frontend/`.
- Routage Angular activé.
- Architecture standalone activée.
- Dépendances installées avec npm.
- Compilation de production réussie avec `npm --prefix frontend run build`.
- Tests unitaires réussis : 2 tests sur 2.
- Vérification TypeScript réussie avec `npm --prefix frontend run typecheck`.
- Compilation en mode surveillance réussie avec `npm --prefix frontend run watch`.
- Serveur de développement démarré avec succès avec `npm --prefix frontend start`.
- Adresse locale du serveur : `http://localhost:4200/`.

Ces validations concernent le socle initial du frontend. Elles ne certifient pas encore l'intégration avec le backend ou Ollama.

## 4. Scripts frontend disponibles

| Script | Commande | Validation |
|---|---|---|
| `start` | `npm --prefix frontend start` | Démarrage réussi |
| `dev` | `npm --prefix frontend run dev` | Démarrage réussi |
| `build` | `npm --prefix frontend run build` | Réussi |
| `test` | `npm --prefix frontend test -- --watch=false` | 2 tests réussis |
| `watch` | `npm --prefix frontend run watch` | Compilation et surveillance réussies |
| `typecheck` | `npm --prefix frontend run typecheck` | Réussi |

Le script `typecheck` vérifie les types TypeScript de l'application sans générer de fichiers de sortie, grâce à l'option `--noEmit`.

## 5. État général du projet

- Les dossiers `frontend/`, `backend/`, `shared/`, `docs/` et `scripts/` existent.
- Le frontend contient maintenant une application Angular fonctionnelle au niveau du démarrage, de la compilation et des tests initiaux.
- Le backend Node.js / Express reste à créer et à valider.
- Les contrats partagés dans `shared/` restent à définir et à tester.
- La configuration réelle de l'application à partir des variables d'environnement reste à implémenter.
- Les commandes de démarrage et de validation du backend restent à définir.
- Aucun commit Git n'est réalisé par cette mise à jour documentaire.

## 6. Limites du relevé

Ce document consigne les observations et validations effectuées à ce stade. Les contrôles réussis concernent uniquement le socle initial du frontend Angular. Ils ne certifient pas encore l'architecture complète d'ASTRON CORE, le backend, la communication avec Ollama, la sécurité, ni l'intégration entre les composants.
