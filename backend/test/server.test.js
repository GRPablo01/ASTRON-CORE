'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const express = require('express');

const app = require('../server');
const errorHandler = require('../middleware/error-handler');
const validateRequest = require('../middleware/validation/validate-request');

const {
  validateTaskCreate,
  TASK_STATUSES,
} = require('../contracts/task.contract');

/* =========================================================
   API — HEALTH
========================================================= */

test('GET /api/health retourne un statut 200', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'ok');
});

test('la réponse santé expose un requestId et un timestamp cohérents', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(typeof response.body.meta.requestId, 'string');
  assert.ok(response.body.meta.requestId.length > 0);

  assert.equal(
    response.headers['x-request-id'],
    response.body.meta.requestId,
  );

  assert.equal(typeof response.body.meta.timestamp, 'string');
  assert.ok(Number.isFinite(Date.parse(response.body.meta.timestamp)));
});

/* =========================================================
   API — ERREURS ET ROUTES INCONNUES
========================================================= */

test('une route inconnue retourne une erreur 404 JSON', async () => {
  const response = await request(app).get('/route-inconnue');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'NOT_FOUND');

  assert.equal(typeof response.body.meta.requestId, 'string');
  assert.ok(response.body.meta.requestId.length > 0);
  assert.ok(Number.isFinite(Date.parse(response.body.meta.timestamp)));

  assert.equal(
    response.headers['x-request-id'],
    response.body.meta.requestId,
  );
});

test('un corps JSON invalide retourne une erreur 400', async () => {
  const response = await request(app)
    .post('/api/health')
    .set('Content-Type', 'application/json')
    .send('{"invalide":');

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'INVALID_JSON');

  assert.equal(typeof response.body.meta.requestId, 'string');
  assert.ok(response.body.meta.requestId.length > 0);
  assert.ok(Number.isFinite(Date.parse(response.body.meta.timestamp)));

  assert.equal(
    response.headers['x-request-id'],
    response.body.meta.requestId,
  );
});

test('un corps JSON supérieur à 100 Ko retourne une erreur 413', async () => {
  const response = await request(app)
    .post('/api/health')
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({ data: 'x'.repeat(110 * 1024) }));

  assert.equal(response.status, 413);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'PAYLOAD_TOO_LARGE');

  assert.equal(typeof response.body.meta.requestId, 'string');
  assert.ok(response.body.meta.requestId.length > 0);
  assert.ok(Number.isFinite(Date.parse(response.body.meta.timestamp)));

  assert.equal(
    response.headers['x-request-id'],
    response.body.meta.requestId,
  );
});

test('les en-têtes de sécurité Helmet sont présents', async () => {
  const response = await request(app).get('/api/health');

  assert.ok(response.headers['x-content-type-options']);
  assert.ok(response.headers['content-security-policy']);
  assert.equal(response.headers['x-powered-by'], undefined);
});

test('une erreur interne retourne une réponse 500 avec les métadonnées', async () => {
  const testApp = express();

  testApp.use((req, res, next) => {
    req.requestId = 'test-request-id';
    req.timestamp = '2026-10-23T12:00:00.000Z';

    res.setHeader('X-Request-Id', req.requestId);

    next();
  });

  testApp.get('/erreur-test', (req, res, next) => {
    next(new Error('Erreur de test'));
  });

  testApp.use(errorHandler);

  const response = await request(testApp).get('/erreur-test');

  assert.equal(response.status, 500);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'INTERNAL_SERVER_ERROR');
  assert.equal(response.body.meta.requestId, 'test-request-id');

  assert.equal(
    response.body.meta.timestamp,
    '2026-10-23T12:00:00.000Z',
  );

  assert.equal(
    response.headers['x-request-id'],
    'test-request-id',
  );
});

/* =========================================================
   CONTRAT — CRÉATION D'UNE TÂCHE
========================================================= */

test('le contrat accepte une tâche avec un nom valide', () => {
  assert.deepEqual(validateTaskCreate({ name: 'Ma tâche' }), {
    valid: true,
    errors: [],
  });
});

test('le contrat refuse un nom absent ou invalide', () => {
  assert.equal(validateTaskCreate({}).valid, false);
  assert.equal(validateTaskCreate({ name: '' }).valid, false);
  assert.equal(validateTaskCreate({ name: '   ' }).valid, false);
  assert.equal(validateTaskCreate(null).valid, false);
  assert.equal(validateTaskCreate([]).valid, false);
});

test('les statuts de tâche sont définis et immuables', () => {
  assert.deepEqual(TASK_STATUSES, [
    'pending',
    'running',
    'completed',
    'failed',
  ]);

  assert.equal(Object.isFrozen(TASK_STATUSES), true);
});

test('le contrat refuse les champs non autorisés', () => {
  const result = validateTaskCreate({
    name: 'Ma tâche',
    admin: true,
  });

  assert.equal(result.valid, false);

  assert.deepEqual(result.errors, [
    'Champ(s) non autorisé(s) : admin.',
  ]);
});

test('le contrat refuse un nom de tâche supérieur à 100 caractères', () => {
  const result = validateTaskCreate({
    name: 'A'.repeat(101),
  });

  assert.equal(result.valid, false);

  assert.ok(
    result.errors.includes(
      'Le champ "name" ne doit pas dépasser 100 caractères.',
    ),
  );
});

/* =========================================================
   MIDDLEWARE — VALIDATION
========================================================= */

test('le middleware de validation transmet une requête valide', () => {
  const middleware = validateRequest((payload) => ({
    valid: payload.name === 'Ma tâche',
    errors: [],
  }));

  const req = {
    body: { name: 'Ma tâche' },
  };

  const res = {};
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

test('le middleware de validation retourne une erreur 400', () => {
  const middleware = validateRequest(() => ({
    valid: false,
    errors: ['Le champ name est obligatoire.'],
  }));

  const req = {
    body: {},
    requestId: 'test-request-id',
    timestamp: '2026-10-23T12:00:00.000Z',
  };

  const res = {
    statusCode: null,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(body) {
      this.body = body;
      return this;
    },
  };

  middleware(req, res, () => {
    assert.fail('next ne doit pas être appelé pour une requête invalide');
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');

  assert.deepEqual(res.body.error.details, [
    'Le champ name est obligatoire.',
  ]);

  assert.equal(res.body.meta.requestId, 'test-request-id');
  assert.equal(res.body.meta.timestamp, req.timestamp);
});

/* =========================================================
   API — POST /api/tasks
========================================================= */

test('POST /api/tasks crée une réponse 201 avec une tâche valide', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ name: 'Ma tâche' });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);

  const task = response.body.data.task;

  assert.equal(typeof task.taskId, 'string');
  assert.ok(task.taskId.length > 0);

  assert.deepEqual(
    {
      name: task.name,
      status: task.status,
    },
    {
      name: 'Ma tâche',
      status: 'pending',
    },
  );

  assert.equal(task.progress, 0);

  assert.ok(response.body.meta.requestId);
  assert.ok(response.body.meta.timestamp);
});

test('POST /api/tasks retourne 400 si le nom est absent', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');

  assert.ok(response.body.meta.requestId);
  assert.ok(response.body.meta.timestamp);
});

test('POST /api/tasks refuse les champs non autorisés', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({
      name: 'Ma tâche',
      admin: true,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');

  assert.ok(
    response.body.error.details.includes(
      'Champ(s) non autorisé(s) : admin.',
    ),
  );
});

test('POST /api/tasks supprime les espaces autour du nom', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ name: '  Ma tâche  ' });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.task.name, 'Ma tâche');
});

test('POST /api/tasks refuse un nom de plus de 100 caractères', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({ name: 'A'.repeat(101) });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');

  assert.ok(
    response.body.error.details.includes(
      'Le champ "name" ne doit pas dépasser 100 caractères.',
    ),
  );
});