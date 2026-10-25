
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const requestContext = require('./middleware/request-context');
const errorHandler = require('./middleware/error-handler');
const validateRequest = require('./middleware/validation/validate-request');
const { validateTaskCreate } = require('./contracts/task.contract');

const {
  createTask,
  getTask,
} = require('./services/task-lifecycle.service');

const app = express();

const HOST = process.env.BACKEND_HOST || '127.0.0.1';
const PORT = Number(process.env.BACKEND_PORT) || 3000;

const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:4200';
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || DEFAULT_FRONTEND_ORIGIN;

/**
 * Configuration générale de l'application.
 */
app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  })
);

app.use(requestContext);

app.use(express.json({ limit: '100kb' }));

/**
 * Vérification de l'état de l'API.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'astron-core-api',
    },
    meta: {
      requestId: req.requestId,
      timestamp: req.timestamp,
    },
  });
});

/**
 * Création d'une tâche.
 */
app.post(
  '/api/tasks',
  validateRequest(validateTaskCreate),
  (req, res, next) => {
    try {
      const { task } = createTask(req.body.name);

      return res.status(201).json({
        success: true,
        data: {
          task: {
            taskId: task.taskId,
            name: task.name,
            status: task.status,
            progress: task.progress,
          },
        },
        meta: {
          requestId: req.requestId,
          timestamp: req.timestamp,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Consultation d'une tâche par son identifiant.
 */
app.get('/api/tasks/:taskId', (req, res) => {
  const task = getTask(req.params.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Tâche introuvable.',
      },
      meta: {
        requestId: req.requestId,
        timestamp: req.timestamp,
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      task,
    },
    meta: {
      requestId: req.requestId,
      timestamp: req.timestamp,
    },
  });
});

/**
 * Réponse pour les routes inconnues.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route introuvable.',
    },
    meta: {
      requestId: req.requestId,
      timestamp: req.timestamp,
    },
  });
});

/**
 * Gestion centralisée des erreurs.
 */
app.use(errorHandler);

/**
 * Démarrage uniquement lorsque ce fichier est exécuté directement.
 * L'export de l'application reste disponible pour les tests.
 */
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(
      `ASTRON CORE API disponible sur http://${HOST}:${PORT}`
    );
  });
}

module.exports = app;
