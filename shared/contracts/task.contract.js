'use strict';

/**
 * Contrat partagé des tâches ASTRON-CORE.
 * Source de référence pour les statuts, événements et transitions.
 */

const TASK_STATUSES = Object.freeze([
  'pending',
  'running',
  'completed',
  'failed',
]);

const TASK_EVENTS = Object.freeze({
  CREATED: 'task.created',
  STARTED: 'task.started',
  PROGRESS: 'task.progress',
  COMPLETED: 'task.completed',
  FAILED: 'task.failed',
});

const TASK_STATUS_TRANSITIONS = Object.freeze({
  pending: Object.freeze(['running', 'failed']),
  running: Object.freeze(['completed', 'failed']),
  completed: Object.freeze([]),
  failed: Object.freeze([]),
});

const TASK_EVENT_REQUIRED_FIELDS = Object.freeze([
  'eventId',
  'taskId',
  'type',
  'timestamp',
]);

/**
 * Vérifie si un événement de tâche respecte le contrat partagé.
 *
 * @param {unknown} event Événement à valider.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTaskEvent(event) {
  if (
    !event ||
    typeof event !== 'object' ||
    Array.isArray(event)
  ) {
    return {
      valid: false,
      errors: ['L’événement doit être un objet JSON.'],
    };
  }

  const errors = [];

  for (const field of TASK_EVENT_REQUIRED_FIELDS) {
    if (
      typeof event[field] !== 'string' ||
      event[field].trim().length === 0
    ) {
      errors.push(
        `Le champ "${field}" est obligatoire et doit être une chaîne non vide.`
      );
    }
  }

  if (
    typeof event.type === 'string' &&
    !Object.values(TASK_EVENTS).includes(event.type)
  ) {
    errors.push(
      'Le champ "type" doit désigner un événement de tâche connu.'
    );
  }

  if (
    typeof event.timestamp === 'string' &&
    event.timestamp.trim().length > 0 &&
    Number.isNaN(Date.parse(event.timestamp))
  ) {
    errors.push(
      'Le champ "timestamp" doit être une date valide au format ISO 8601.'
    );
  }

  if (event.type === TASK_EVENTS.PROGRESS) {
    if (
      !Number.isInteger(event.progress) ||
      event.progress < 0 ||
      event.progress > 100
    ) {
      errors.push(
        'Le champ "progress" doit être un entier compris entre 0 et 100.'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Vérifie si une transition entre deux statuts est autorisée.
 *
 * Ne modifie aucun état : cette fonction vérifie uniquement
 * les règles déclarées dans TASK_STATUS_TRANSITIONS.
 *
 * @param {string} from Statut actuel.
 * @param {string} to Statut cible.
 * @returns {boolean}
 */
function canTransitionTaskStatus(from, to) {
  if (
    !TASK_STATUSES.includes(from) ||
    !TASK_STATUSES.includes(to)
  ) {
    return false;
  }

  return TASK_STATUS_TRANSITIONS[from].includes(to);
}

module.exports = {
  TASK_STATUSES,
  TASK_EVENTS,
  TASK_STATUS_TRANSITIONS,
  TASK_EVENT_REQUIRED_FIELDS,
  canTransitionTaskStatus,
  validateTaskEvent,
};
