# ASTRON CORE — Phase 0.5
## Validation du cadrage

- Statut : APPROUVÉ SOUS RÉSERVE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.5 — Validation du cadrage

---

## 1. Objet de la validation

Ce document rassemble les décisions et exigences définies dans les
sous-étapes 0.1 à 0.4.

Il sert à vérifier que le périmètre du projet est suffisamment clair avant
de commencer les étapes suivantes de conception et d'implémentation.

La présence d'un document ne prouve pas que les mécanismes décrits sont
déjà implémentés.

## 2. Documents de référence

- docs/PHASE-0.1-VISION-OBJECTIFS.md
- docs/PHASE-0.2-PERIMETRE-LIMITES.md
- docs/PHASE-0.3-PERMISSIONS-CONFIRMATIONS.md
- docs/PHASE-0.4-CRITERES-REUSSITE.md

## 3. Validation de la vision et des objectifs

Points à vérifier :
- [ ] L'agent principal coordinateur a une responsabilité définie.
- [ ] Les agents spécialisés ont des missions limitées.
- [ ] L'interface web locale est prévue avec Angular.
- [ ] L'API backend est prévue avec Node.js et Express.
- [ ] Ollama est le moteur local cible.
- [ ] Le fonctionnement de base ne nécessite pas de service payant obligatoire.
- [ ] Les limites entre IA, backend et outils sont explicites.

## 4. Validation du périmètre et des limites

Points à vérifier :
- [ ] Les espaces de lecture autorisés seront explicitement définis.
- [ ] Les accès aux secrets sont limités et contrôlés.
- [ ] Les calculs et analyses ne donnent pas implicitement le droit de modifier.
- [ ] Les modifications sont limitées aux chemins autorisés.
- [ ] Les commandes arbitraires sont bloquées par défaut.
- [ ] Les actions destructrices sont bloquées par défaut.
- [ ] Les chemins, liens symboliques et accès indirects seront contrôlés.
- [ ] Les contrôles seront exécutés côté backend.

## 5. Validation des permissions et confirmations

Points à vérifier :
- [ ] Chaque outil dispose de permissions explicites.
- [ ] Les niveaux de risque R0 à R4 sont définis.
- [ ] Les actions sensibles attendent une confirmation explicite.
- [ ] Une confirmation est liée à une action et à ses paramètres précis.
- [ ] Une confirmation expirée ou modifiée est rejetée.
- [ ] Les permissions sont vérifiées à nouveau avant l'exécution.
- [ ] Une action interdite reste interdite même si l'utilisateur la confirme.
- [ ] Les refus et les résultats sont traçables.

## 6. Validation des critères de réussite

Points à vérifier :
- [ ] Chaque demande possède un identifiant et un état exploitable.
- [ ] Les tâches et événements peuvent être corrélés.
- [ ] Les permissions font l'objet de tests automatisables.
- [ ] Les erreurs sont compréhensibles et correctement classées.
- [ ] Les tests peuvent être rejoués dans un environnement documenté.
- [ ] Les résultats des tests sont conservés.
- [ ] Les journaux ne révèlent pas de secrets.
- [ ] Les scénarios locaux sont testés sans service payant obligatoire.
- [ ] Les défauts critiques empêchent la validation.

## 7. Décisions de sécurité non négociables

1. Refuser par défaut toute permission absente ou indéterminée.
2. Ne jamais laisser le modèle IA décider seul de ses autorisations.
3. Ne jamais exécuter directement une commande arbitraire issue du modèle.
4. Exiger une confirmation valide pour les actions sensibles concernées.
5. Revalider les permissions au moment de l'exécution.
6. Bloquer les actions interdites même en présence d'une confirmation.
7. Ne pas exposer les secrets dans les journaux.
8. Ne pas déclarer une fonctionnalité sécurisée sans tests concluants.
9. Ne pas présenter une action échouée ou interrompue comme réussie.
10. Conserver des traces suffisantes pour comprendre les décisions.

## 8. Conditions de sortie de la phase 0

La phase 0 pourra être approuvée lorsque :
- les quatre documents de référence ont été relus ;
- les objectifs et le périmètre sont acceptés ;
- les règles de permissions et de confirmation sont acceptées ;
- les critères de réussite sont définis ;
- les ambiguïtés bloquantes sont résolues ;
- l'utilisateur approuve explicitement le cadrage.

L'approbation du cadrage valide les exigences de conception. Elle ne remplace
pas les tests techniques qui seront nécessaires pendant l'implémentation.

## 9. Décision finale

- Vision et objectifs : APPROUVÉ SOUS RÉSERVE
- Périmètre et limites : APPROUVÉ SOUS RÉSERVE
- Permissions et confirmations : APPROUVÉ SOUS RÉSERVE
- Critères de réussite : APPROUVÉ SOUS RÉSERVE
- Décision globale : APPROUVÉ SOUS RÉSERVE

Date de décision : 2026-10-21.

Décision de l'utilisateur :
- [ ] APPROUVÉ
- [x] APPROUVÉ SOUS RÉSERVE
- [ ] À CORRIGER

Commentaires :
Aucun commentaire spécifique fourni par l'utilisateur.

## 10. Réserve globale

Décision : APPROUVÉ SOUS RÉSERVE.

Le cadrage documentaire des sous-étapes 0.1 à 0.4 est accepté.
La première version reste limitée à la lecture et à l'analyse des données
explicitement autorisées. Les opérations de création, modification,
déplacement et suppression de fichiers restent désactivées par défaut.

Les cases de contrôle des sections 3 à 6 ne doivent être cochées qu'après
vérification de chaque point. Les exigences documentées ne constituent pas
une preuve de leur implémentation. Les contrôles techniques, les tests
automatisés et leurs résultats devront être vérifiés pendant les phases
suivantes.

## 11. Statut du document

Statut actuel : APPROUVÉ SOUS RÉSERVE.

Cette décision valide le cadrage documentaire sous réserve. Elle ne certifie
pas l'implémentation ni la réussite des contrôles et tests techniques.
