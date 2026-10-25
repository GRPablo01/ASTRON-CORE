function validateRequest(validator) {
    return function requestValidationMiddleware(req, res, next) {
      const result = validator(req.body);

      if (result.valid) {
        return next();
      }

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Les données envoyées sont invalides.',
          details: result.errors,
        },
        meta: {
          requestId: req.requestId,
          timestamp: req.timestamp,
        },
      });
    };
  }

  module.exports = validateRequest;
