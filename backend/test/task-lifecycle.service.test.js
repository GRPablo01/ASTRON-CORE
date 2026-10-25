'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

const {
  createTask,
  applyTaskEvent,
  getTask,
  resetTaskLifecycle,
} = require('../services/task-lifecycle.service');

const { TASK_EVENTS } = require('../../shared/contracts/task.contract');

function makeEvent(taskId, type, extra = {}) {
  return {
    eventId: randomUUID(),
    taskId,
    type,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

test.beforeEach(() => resetTaskLifecycle());

test('crée une tâche avec un identifiant unique et le statut pending', () => {
  const first = createTask(' Première tâche ');
  const second = createTask('Deuxième tâche');

  assert.ok(first.task.taskId);
  assert.notEqual(first.task.taskId, second.task.taskId);
  assert.equal(first.task.name, 'Première tâche');
  assert.equal(first.task.status, 'pending');
  assert.equal(first.task.progress, 0);
  assert.equal(first.event.type, TASK_EVENTS.CREATED);
  assert.notEqual(first.event.eventId, second.event.eventId);
});

test('refuse la création d’une tâche avec un nom invalide', () => {
  assert.throws(() => createTask(' '), TypeError);
  assert.throws(() => createTask(null), TypeError);
});

test('autorise le démarrage d’une tâche en attente', () => {
  const { task } = createTask('Tâche');
  const result = applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.STARTED));

  assert.equal(result.applied, true);
  assert.equal(result.task.status, 'running');
});

test('ignore un événement déjà traité', () => {
  const { task } = createTask('Tâche');
  const event = makeEvent(task.taskId, TASK_EVENTS.STARTED);

  assert.equal(applyTaskEvent(event).applied, true);

  const duplicate = applyTaskEvent(event);

  assert.equal(duplicate.applied, false);
  assert.equal(duplicate.reason, 'DUPLICATE_EVENT');
  assert.equal(getTask(task.taskId).status, 'running');
});

test('refuse une progression avant le démarrage', () => {
  const { task } = createTask('Tâche');
  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.PROGRESS, { progress: 20 })
  );

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'INVALID_TASK_STATE');
  assert.equal(getTask(task.taskId).progress, 0);
});

test('accepte une progression entière croissante entre 0 et 100', () => {
  const { task } = createTask('Tâche');

  applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.STARTED));

  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.PROGRESS, { progress: 40 })
  );

  assert.equal(result.applied, true);
  assert.equal(result.task.progress, 40);
});

test('refuse une progression qui diminue sans modifier la tâche', () => {
  const { task } = createTask('Tâche');

  applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.STARTED));
  applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.PROGRESS, { progress: 60 })
  );

  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.PROGRESS, { progress: 30 })
  );

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'PROGRESS_DECREASE');
  assert.equal(getTask(task.taskId).progress, 60);
});

test('refuse une transition incompatible avec le statut actuel', () => {
  const { task } = createTask('Tâche');
  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.COMPLETED)
  );

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'INVALID_TRANSITION');
  assert.equal(getTask(task.taskId).status, 'pending');
});

test('termine une tâche en cours avec une progression à 100', () => {
  const { task } = createTask('Tâche');

  applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.STARTED));

  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.COMPLETED)
  );

  assert.equal(result.applied, true);
  assert.equal(result.task.status, 'completed');
  assert.equal(result.task.progress, 100);
});

test('un état terminal ne peut pas être modifié par un nouvel événement', () => {
  const { task } = createTask('Tâche');

  applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.STARTED));
  applyTaskEvent(makeEvent(task.taskId, TASK_EVENTS.COMPLETED));

  const result = applyTaskEvent(
    makeEvent(task.taskId, TASK_EVENTS.FAILED)
  );

  assert.equal(result.applied, false);
  assert.equal(getTask(task.taskId).status, 'completed');
});

test('refuse un événement concernant une tâche inexistante', () => {
  const result = applyTaskEvent(
    makeEvent(randomUUID(), TASK_EVENTS.STARTED)
  );

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'TASK_NOT_FOUND');
});

test('refuse un événement invalide sans modifier la tâche', () => {
  const { task } = createTask('Tâche');

  const result = applyTaskEvent({
    eventId: randomUUID(),
    taskId: task.taskId,
    type: TASK_EVENTS.PROGRESS,
    timestamp: new Date().toISOString(),
    progress: 150,
  });

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'INVALID_EVENT');
  assert.equal(getTask(task.taskId).progress, 0);
});
