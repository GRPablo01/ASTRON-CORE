'use strict';

const { randomUUID } = require('node:crypto');

const {
  TASK_EVENTS,
  canTransitionTaskStatus,
  validateTaskEvent,
} = require('../../shared/contracts/task.contract');

const tasks = new Map();
const processedEventIds = new Set();

function createTask(name) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new TypeError('Le nom de la tâche est obligatoire.');
  }

  const timestamp = new Date().toISOString();

  const task = {
    taskId: randomUUID(),
    name: name.trim(),
    status: 'pending',
    progress: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  tasks.set(task.taskId, task);

  return {
    task: { ...task },
    event: {
      eventId: randomUUID(),
      taskId: task.taskId,
      type: TASK_EVENTS.CREATED,
      timestamp,
    },
  };
}

function applyTaskEvent(event) {
  const validation = validateTaskEvent(event);

  if (!validation.valid) {
    return {
      applied: false,
      reason: 'INVALID_EVENT',
      errors: validation.errors,
    };
  }

  if (processedEventIds.has(event.eventId)) {
    return { applied: false, reason: 'DUPLICATE_EVENT' };
  }

  const task = tasks.get(event.taskId);

  if (!task) {
    return { applied: false, reason: 'TASK_NOT_FOUND' };
  }

  let nextStatus = task.status;
  let nextProgress = task.progress;

  switch (event.type) {
    case TASK_EVENTS.CREATED:
      return { applied: false, reason: 'EVENT_NOT_APPLICABLE' };

    case TASK_EVENTS.STARTED:
      nextStatus = 'running';
      break;

    case TASK_EVENTS.PROGRESS:
      if (task.status !== 'running') {
        return { applied: false, reason: 'INVALID_TASK_STATE' };
      }

      if (event.progress < task.progress) {
        return { applied: false, reason: 'PROGRESS_DECREASE' };
      }

      nextProgress = event.progress;
      break;

    case TASK_EVENTS.COMPLETED:
      nextStatus = 'completed';
      nextProgress = 100;
      break;

    case TASK_EVENTS.FAILED:
      nextStatus = 'failed';
      break;

    default:
      return { applied: false, reason: 'UNKNOWN_EVENT' };
  }

  if (
    nextStatus !== task.status &&
    !canTransitionTaskStatus(task.status, nextStatus)
  ) {
    return { applied: false, reason: 'INVALID_TRANSITION' };
  }

  const updatedTask = {
    ...task,
    status: nextStatus,
    progress: nextProgress,
    updatedAt: new Date().toISOString(),
  };

  tasks.set(task.taskId, updatedTask);
  processedEventIds.add(event.eventId);

  return {
    applied: true,
    task: { ...updatedTask },
  };
}

function getTask(taskId) {
  const task = tasks.get(taskId);
  return task ? { ...task } : null;
}

function resetTaskLifecycle() {
  tasks.clear();
  processedEventIds.clear();
}

module.exports = {
  createTask,
  applyTaskEvent,
  getTask,
  resetTaskLifecycle,
};
