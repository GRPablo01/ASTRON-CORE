# ASTRON CORE — Phase 0.4
## Critères de réussite

- Statut : APPROUVÉ SOUS RÉSERVE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.4 — Critères de réussite

---

## 1. Objectif

Définir des critères observables et mesurables permettant de vérifier
qu'ASTRON CORE traite les demandes de bout en bout, respecte les permissions,
explique ses erreurs et produit des résultats vérifiables.

Une fonctionnalité décrite mais non testée ne peut pas être déclarée validée.

## 2. Suivi d'une demande de bout en bout

Chaque demande doit posséder un identifiant unique et un état explicite.

Cycle de référence :
1. Demande reçue.
2. Entrée validée.
3. Demande analysée.
4. Plan préparé.
5. Permissions vérifiées.
6. Confirmation demandée si nécessaire.
7. Tâches exécutées.
8. Résultats vérifiés.
9. Résultat final présenté.
10. Demande terminée, refusée, annulée ou échouée.

Critères :
- chaque demande peut être retrouvée par son identifiant ;
- chaque tâche possède un état identifiable ;
- les transitions d'état sont cohérentes ;
- les erreurs ne sont pas masquées par un statut de réussite ;
- les demandes interrompues ne sont pas présentées comme terminées ;
- les événements disposent d'horodatages exploitables.

## 3. Respect des permissions

Critères obligatoires :
- toute opération est contrôlée côté backend ;
- une permission absente entraîne un refus ;
- un outil ne peut pas dépasser les droits qui lui sont accordés ;
- une action sensible ne démarre pas avant confirmation valide ;
- un refus humain empêche l'action concernée ;
- une permission retirée est réévaluée avant l'exécution ;
- les paramètres exécutés correspondent à ceux autorisés ;
- une action interdite ne peut pas être exécutée indirectement.

Objectif de validation :
100 % des tests de sécurité définis doivent réussir.
Aucun échec critique de sécurité n'est acceptable.

## 4. Confirmation humaine

Critères obligatoires :
- l'action à confirmer est décrite clairement ;
- les ressources et conséquences prévisibles sont présentées ;
- la confirmation est liée à une action précise ;
- les confirmations expirées ou modifiées sont rejetées ;
- aucune action sensible ne démarre en l'absence de confirmation valide ;
- chaque décision est traçable.

Les tests doivent vérifier le refus, l'expiration, la modification des
paramètres et le retrait d'une permission avant exécution.

## 5. Explication des erreurs

Chaque erreur doit fournir, dans la mesure du possible :
- un code ou une catégorie stable ;
- une explication compréhensible ;
- l'étape concernée ;
- l'identifiant de la demande ou de la tâche ;
- une indication sur la possibilité de réessayer ;
- une action corrective lorsque celle-ci est connue.

Les informations techniques internes et les secrets ne doivent pas être
exposés dans les messages destinés à l'utilisateur.

Une erreur doit être distinguée d'un refus de permission, d'une annulation
et d'une attente de confirmation.

## 6. Tests reproductibles

Les tests doivent :
- être automatisables lorsque possible ;
- utiliser des données de test contrôlées ;
- préciser les préconditions et résultats attendus ;
- pouvoir être relancés dans un environnement documenté ;
- vérifier les effets réels, pas seulement les messages affichés ;
- ne pas modifier de données personnelles ou de production ;
- conserver des résultats exploitables.

Les tests de sécurité doivent notamment vérifier qu'une opération refusée
ne produit aucun effet.

## 7. Critères de performance et de fiabilité

Les seuils chiffrés définitifs seront fixés après mesure sur la machine cible.

Mesures à collecter :
- durée totale d'une demande ;
- durée de chaque tâche ;
- taux de réussite des tâches ;
- taux d'erreurs par catégorie ;
- consommation mémoire et ressources ;
- disponibilité du backend et d'Ollama ;
- temps d'attente des confirmations humaines.

Aucune valeur de performance ne doit être déclarée atteinte sans mesure.

## 8. Fonctionnement local sans service payant obligatoire

Tests attendus :
- démarrage des composants locaux requis ;
- traitement d'une demande simple avec un modèle local installé ;
- exécution d'un calcul local sans service externe ;
- consultation de résultats locaux sans réseau externe ;
- comportement explicable si Ollama ou le modèle est indisponible.

Le fonctionnement local ne signifie pas que tous les modèles ou toutes les
fonctionnalités sont disponibles sur toutes les machines.

## 9. Journalisation et audit

Critères :
- identifiants de demande et de tâche corrélables ;
- décisions d'autorisation traçables ;
- confirmations et refus enregistrés ;
- résultats et erreurs consultables ;
- secrets et jetons absents des journaux ;
- événements suffisamment détaillés pour reconstituer le parcours.

## 10. Tableau de validation

| Domaine | Critère de sortie |
| --- | --- |
| Traçabilité | Parcours complet reconstituable |
| Permissions | Tous les tests de sécurité réussis |
| Confirmation | Aucune action sensible non confirmée |
| Erreurs | Messages explicables et états cohérents |
| Reproductibilité | Tests relançables avec résultats vérifiables |
| Fonctionnement local | Scénarios de base réussis sans service payant obligatoire |
| Confidentialité | Aucun secret exposé dans les journaux |

## 11. Règle de décision

Une fonctionnalité ne peut être déclarée réussie que si :
- son comportement attendu est documenté ;
- ses tests pertinents sont exécutés ;
- les résultats sont conservés ;
- aucun défaut critique ne reste ouvert.

Les échecs doivent être documentés et corrigés avant la validation finale
du périmètre concerné.

## 12. Critère de sortie de la sous-étape 0.4

La sous-étape pourra être validée lorsque :
- les critères de suivi sont définis ;
- les tests de permissions et de confirmation sont identifiés ;
- les exigences de gestion des erreurs sont documentées ;
- la reproductibilité est définie ;
- les résultats attendus peuvent être vérifiés objectivement.

## 13. Décision et réserve

Décision : APPROUVÉ SOUS RÉSERVE.

Réserve : les critères de réussite sont définis comme objectifs de validation.
Ils ne prouvent pas que les fonctionnalités sont implémentées ni que les tests
ont réussi. Les résultats devront être obtenus, conservés et vérifiés lors
des validations techniques. Les seuils de performance resteront à fixer
après mesure sur la machine cible.

La première version reste limitée à la lecture et à l'analyse des données
explicitement autorisées. Les capacités de modification restent désactivées
par défaut jusqu'à l'implémentation et à la validation des contrôles requis.

## 14. Statut de validation

Statut actuel : APPROUVÉ SOUS RÉSERVE.

Ce document définit les critères cibles. Il ne constitue pas une preuve
que les fonctionnalités ont déjà passé les tests.
