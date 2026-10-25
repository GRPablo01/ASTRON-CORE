'use strict';

const {
  TASK_STATUSES,
} = require('../../shared/contracts/task.contract.js');

const TASK_CREATE_REQUIRED_FIELDS = Object.freeze([
  'name',
]);

function validateTaskCreate(payload) {
  const errors = [];

  if (
    !payload ||
    typeof payload !== 'object' ||
    Array.isArray(payload)
  ) {
    return {
      valid: false,
      errors: ['Le corps de la requête doit être un objet JSON.'],
    };
  }

  const allowedFields = TASK_CREATE_REQUIRED_FIELDS;

  const unknownFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(
      `Champ(s) non autorisé(s) : ${unknownFields.join(', ')}.`
    );
  }

  if (
    typeof payload.name === 'string' &&
    payload.name.trim().length > 100
  ) {
    errors.push('Le champ "name" ne doit pas dépasser 100 caractères.');
  }

  if (
    typeof payload.name !== 'string' ||
    payload.name.trim().length === 0
  ) {
    errors.push(
      'Le champ "name" est obligatoire et doit être une chaîne non vide.'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  TASK_STATUSES,
  TASK_CREATE_REQUIRED_FIELDS,
  validateTaskCreate,
};
