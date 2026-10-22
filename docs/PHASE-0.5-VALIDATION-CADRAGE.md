# ASTRON CORE — Phase 0.5
## Validation du cadrage

- Statut : CLÔTURÉ — VALIDATION DOCUMENTAIRE
- Phase : 0 — Cadrage et sécurité
- Sous-étape : 0.5 — Validation du cadrage
- Date de référence : 2026-10-21

---

## 1. Objet de la validation

Ce document consolide les décisions et exigences définies dans les
sous-étapes 0.1 à 0.4.

Il permet de vérifier que la vision, le périmètre, les règles de sécurité
et les critères de réussite sont suffisamment définis pour prendre une
décision explicite sur le cadrage avant la suite du projet.

La validation documentaire ne prouve pas que les mécanismes décrits sont
déjà implémentés, testés ou sécurisés.

## 2. Documents de référence

Les quatre documents de cadrage examinés par cette synthèse sont :

- docs/PHASE-0.1-VISION-OBJECTIFS.md
- docs/PHASE-0.2-PERIMETRE-LIMITES.md
- docs/PHASE-0.3-PERMISSIONS-CONFIRMATIONS.md
- docs/PHASE-0.4-CRITERES-REUSSITE.md

Le présent document, PHASE-0.5-VALIDATION-CADRAGE.md, rassemble les
décisions de synthèse et consigne le statut de validation.

## 3. Bilan documentaire

### 3.1 Vision et objectifs

- [x] La vision générale et les objectifs sont documentés.
- [x] L'architecture cible Angular, Node.js/Express et Ollama est décrite.
- [x] Le rôle de l'agent coordinateur et des agents spécialisés est abordé.
- [x] Le fonctionnement de base sans service IA payant obligatoire est prévu.

### 3.2 Périmètre et limites

- [x] Le périmètre fonctionnel et les limites sont documentés.
- [x] La lecture, l'analyse, les calculs et les modifications sont distingués.
- [x] Les actions destructrices et les commandes arbitraires sont interdites
      par défaut dans les exigences.
- [x] Les données sensibles et les limites d'accès sont prises en compte.

### 3.3 Permissions et confirmations

- [x] Les niveaux de risque et les principes de permission sont documentés.
- [x] Le principe de moindre privilège est défini.
- [x] Les confirmations humaines pour les actions sensibles sont prévues.
- [x] La confirmation doit être liée à l'action et à ses paramètres précis.
- [x] Le refus, le contrôle des permissions et la traçabilité sont prévus.

### 3.4 Critères de réussite

- [x] Les critères de réussite et le suivi des tâches sont documentés.
- [x] Les exigences de validation des entrées et de classification des erreurs
      sont définies.
- [x] Les tests reproductibles et la conservation de leurs résultats sont prévus.
- [x] La journalisation sans exposition des secrets est exigée.
- [x] Le fonctionnement local sans service payant obligatoire est prévu.

Ces cases attestent de la présence des éléments dans le cadrage documentaire.
Elles ne certifient pas leur réalisation technique.

## 4. Confirmation et clôture documentaire

- [x] Les ambiguïtés documentaires bloquantes ont été examinées et aucune
      ambiguïté bloquante ne reste ouverte dans le cadrage accepté.
- [x] L'utilisateur accepte explicitement la vision et les objectifs (0.1).
- [x] L'utilisateur accepte explicitement le périmètre et les limites (0.2).
- [x] L'utilisateur accepte explicitement les permissions et confirmations (0.3).
- [x] L'utilisateur accepte explicitement les critères de réussite (0.4).
- [x] L'utilisateur prononce explicitement la clôture documentaire de la Phase 0.

**Décision enregistrée le 21/10/2026 :** acceptation explicite des documents
0.1 à 0.4 et clôture documentaire de la Phase 0. Les validations techniques,
tests et preuves restent obligatoires dans les phases d'implémentation.

Les cases de cette section attestent la décision documentaire de l'utilisateur.
Elles ne constituent pas des preuves de réalisation ou de validation technique.

## 5. Exigences techniques à suivre pendant l'implémentation

Les contrôles suivants restent des exigences à implémenter et à vérifier
au cours des phases techniques concernées :

- Définir et contrôler les espaces de lecture autorisés.
- Protéger les secrets et les données sensibles.
- Vérifier les chemins, les liens symboliques et les accès indirects.
- Appliquer les permissions côté backend avant toute exécution.
- Bloquer les commandes arbitraires et les actions interdites.
- Vérifier les confirmations, leur expiration et leurs paramètres.
- Réévaluer les permissions immédiatement avant l'exécution.
- Tracer les demandes, décisions, refus et résultats sans exposer de secrets.
- Exécuter des tests automatisés reproductibles et conserver leurs résultats.
- Vérifier les scénarios locaux sans service payant obligatoire.
- Mesurer les performances sur la machine cible et définir les seuils à partir
  de mesures documentées.
- Bloquer la validation d'une fonctionnalité lorsque des défauts critiques
  subsistent.

Pour chaque exigence technique, la validation devra s'appuyer sur des preuves
identifiables : code concerné, tests exécutés, résultats observés et défauts
éventuellement ouverts.

Aucun contrôle technique ne doit être déclaré réussi sans preuve vérifiable.

## 6. Décisions de sécurité non négociables

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

## 7. Conditions de sortie de la Phase 0

La clôture documentaire de la Phase 0 nécessite :

- la présence des quatre documents de référence 0.1 à 0.4 et du présent
  document de synthèse 0.5 ;
- un cadrage cohérent de la vision, du périmètre, des permissions et des
  critères de réussite ;
- la résolution des ambiguïtés documentaires bloquantes ;
- l'acceptation explicite du cadrage par l'utilisateur ;
- une décision finale de clôture consignée dans ce document et dans la
  feuille de route principale.

La clôture documentaire ne vaut pas validation technique. L'implémentation,
les tests de sécurité et l'examen de leurs preuves restent obligatoires dans
les phases techniques concernées. Ils ne seront pas présentés comme accomplis
tant que les preuves correspondantes n'auront pas été examinées.

## 8. Décision finale

- Vision et objectifs : APPROUVÉ
- Périmètre et limites : APPROUVÉ
- Permissions et confirmations : APPROUVÉ
- Critères de réussite : APPROUVÉ
- Décision globale : CLÔTURÉ — VALIDATION DOCUMENTAIRE

Décision explicite de l'utilisateur :
- [x] APPROUVÉ — CLÔTURE DOCUMENTAIRE
- [ ] APPROUVÉ SOUS RÉSERVE
- [ ] À CORRIGER

Commentaires :

L'utilisateur a explicitement accepté les quatre documents de cadrage et
prononcé la clôture documentaire de la Phase 0. Cette décision valide le
cadrage documentaire uniquement. Les contrôles techniques, tests de sécurité
et preuves restent des travaux obligatoires et ne sont pas réputés accomplis.

## 9. Réserve globale et périmètre initial

La première version d'ASTRON CORE reste limitée à la lecture et à l'analyse
des données explicitement autorisées.

La création, la modification, le déplacement et la suppression de fichiers
restent désactivés par défaut tant que les mécanismes d'autorisation, de
confirmation et de contrôle n'ont pas été implémentés et validés.

Les cases de la section 4 consignent la décision documentaire explicitement
confirmée par l'utilisateur. Les exigences techniques de la section 5 restent
ouvertes jusqu'à vérification de preuves correspondantes. Une exigence
documentée ne constitue pas une preuve de son implémentation.

## 10. Statut du document

Statut actuel : CLÔTURÉ — VALIDATION DOCUMENTAIRE.

Ce statut décrit la décision documentaire actuellement enregistrée. Il ne
certifie ni l'implémentation ni la réussite des contrôles et tests techniques.
