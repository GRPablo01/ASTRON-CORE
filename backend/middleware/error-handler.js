function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Le corps de la requête dépasse la taille autorisée.',
      },
      meta: {
        requestId: req.requestId,
        timestamp: req.timestamp,
      },
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Le JSON envoyé est invalide.',
      },
      meta: {
        requestId: req.requestId,
        timestamp: req.timestamp,
      },
    });
  }

  console.error('Erreur interne du serveur:', err.message);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Une erreur interne est survenue.',
    },
    meta: {
      requestId: req.requestId,
      timestamp: req.timestamp,
    },
  });
}

module.exports = errorHandler;
