'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  TASK_STATUSES,
  TASK_EVENTS,
  TASK_STATUS_TRANSITIONS,
  TASK_EVENT_REQUIRED_FIELDS,
  canTransitionTaskStatus,
  validateTaskEvent,
} = require('../contracts/task.contract.js');

test('déclare les quatre statuts de tâche attendus', () => {
  assert.deepEqual(TASK_STATUSES, [
    'pending',
    'running',
    'completed',
    'failed',
  ]);
});

test('déclare les événements de cycle de vie des tâches', () => {
  assert.deepEqual(TASK_EVENTS, {
    CREATED: 'task.created',
    STARTED: 'task.started',
    PROGRESS: 'task.progress',
    COMPLETED: 'task.completed',
    FAILED: 'task.failed',
  });
});

test('déclare les transitions autorisées entre statuts', () => {
  assert.deepEqual(TASK_STATUS_TRANSITIONS, {
    pending: ['running', 'failed'],
    running: ['completed', 'failed'],
    completed: [],
    failed: [],
  });
});

test('protège les constantes et les transitions contre les modifications', () => {
  assert.equal(Object.isFrozen(TASK_STATUSES), true);
  assert.equal(Object.isFrozen(TASK_EVENTS), true);
  assert.equal(Object.isFrozen(TASK_STATUS_TRANSITIONS), true);

  for (const transitions of Object.values(TASK_STATUS_TRANSITIONS)) {
    assert.equal(Object.isFrozen(transitions), true);
  }
});

test('les statuts terminaux ne permettent aucune transition supplémentaire', () => {
  assert.deepEqual(TASK_STATUS_TRANSITIONS.completed, []);
  assert.deepEqual(TASK_STATUS_TRANSITIONS.failed, []);

  for (const status of ['completed', 'failed']) {
    assert.equal(TASK_STATUS_TRANSITIONS[status].length, 0);
  }
});


test('déclare les champs obligatoires des événements', () => {
  assert.deepEqual(TASK_EVENT_REQUIRED_FIELDS, [
    'eventId',
    'taskId',
    'type',
    'timestamp',
  ]);
});

test('accepte un événement valide', () => {
  const event = {
    eventId: 'event-001',
    taskId: 'task-001',
    type: TASK_EVENTS.CREATED,
    timestamp: '2026-10-24T10:00:00.000Z',
  };

  assert.deepEqual(validateTaskEvent(event), {
    valid: true,
    errors: [],
  });
});

test('rejette une valeur qui n’est pas un objet événement', () => {
  for (const event of [null, undefined, 'event', [], 42]) {
    assert.equal(validateTaskEvent(event).valid, false);
  }
});

test('rejette les champs obligatoires absents ou vides', () => {
  const result = validateTaskEvent({
    eventId: '',
    taskId: ' ',
    type: TASK_EVENTS.CREATED,
    timestamp: '2026-10-24T10:00:00.000Z',
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
});

test('rejette un type d’événement inconnu', () => {
  const result = validateTaskEvent({
    eventId: 'event-002',
    taskId: 'task-001',
    type: 'task.unknown',
    timestamp: '2026-10-24T10:00:00.000Z',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('"type"')));
});

test('rejette un horodatage non interprétable', () => {
  const result = validateTaskEvent({
    eventId: 'event-003',
    taskId: 'task-001',
    type: TASK_EVENTS.STARTED,
    timestamp: 'date-invalide',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('"timestamp"')));
});

test('accepte une progression entière comprise entre 0 et 100', () => {
  for (const progress of [0, 1, 50, 99, 100]) {
    const result = validateTaskEvent({
      eventId: `event-progress-${progress}`,
      taskId: 'task-001',
      type: TASK_EVENTS.PROGRESS,
      timestamp: '2026-10-24T10:00:00.000Z',
      progress,
    });

    assert.equal(result.valid, true, `progress=${progress}`);
  }
});

test('rejette une progression invalide', () => {
  for (const progress of [-1, 101, 1.5, '50', null, undefined]) {
    const result = validateTaskEvent({
      eventId: 'event-progress-invalid',
      taskId: 'task-001',
      type: TASK_EVENTS.PROGRESS,
      timestamp: '2026-10-24T10:00:00.000Z',
      progress,
    });

    assert.equal(result.valid, false, `progress=${progress}`);
    assert.ok(result.errors.some((error) => error.includes('"progress"')));
  }
});

test('accepte uniquement les transitions de statut autorisées', () => {
  const allowedTransitions = [
    ['pending', 'running'],
    ['pending', 'failed'],
    ['running', 'completed'],
    ['running', 'failed'],
  ];

  for (const [from, to] of allowedTransitions) {
    assert.ok(
      TASK_STATUS_TRANSITIONS[from].includes(to),
      `Transition attendue : ${from} -> ${to}`
    );
  }
});

test('refuse les transitions depuis les états terminaux', () => {
  for (const status of ['completed', 'failed']) {
    assert.deepEqual(TASK_STATUS_TRANSITIONS[status], []);
  }
});

test('refuse les transitions non définies', () => {
  const forbiddenTransitions = [
    ['pending', 'completed'],
    ['running', 'pending'],
    ['completed', 'running'],
    ['failed', 'running'],
  ];

  for (const [from, to] of forbiddenTransitions) {
    assert.equal(
      TASK_STATUS_TRANSITIONS[from].includes(to),
      false,
      `Transition interdite : ${from} -> ${to}`
    );
  }
});

test('canTransitionTaskStatus valide les transitions autorisées', () => {
  const allowedTransitions = [
    ['pending', 'running'],
    ['pending', 'failed'],
    ['running', 'completed'],
    ['running', 'failed'],
  ];

  for (const [from, to] of allowedTransitions) {
    assert.equal(
      canTransitionTaskStatus(from, to),
      true,
      `Transition attendue : ${from} -> ${to}`
    );
  }
});

test('canTransitionTaskStatus refuse les transitions interdites et les statuts inconnus', () => {
  const forbiddenTransitions = [
    ['pending', 'completed'],
    ['running', 'pending'],
    ['completed', 'running'],
    ['failed', 'running'],
    ['unknown', 'running'],
    ['pending', 'unknown'],
  ];

  for (const [from, to] of forbiddenTransitions) {
    assert.equal(
      canTransitionTaskStatus(from, to),
      false,
      `Transition interdite : ${from} -> ${to}`
    );
  }
});
