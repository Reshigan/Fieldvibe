/**
 * Centralized Error Handling Middleware
 * Catches all errors and returns standardized error responses
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Validation error helper
 */
export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

/**
 * Not found error helper
 */
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

/**
 * Forbidden error helper
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super('FORBIDDEN', message, 403);
  }
}

/**
 * Error handling middleware
 */
export function errorHandler() {
  return async (c, next) => {
    try {
      await next();
    } catch (error) {
      console.error('API Error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
        path: c.req.path,
        method: c.req.method
      });

      // Handle known API errors
      if (error instanceof ApiError) {
        return c.json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            requestId: crypto.randomUUID()
          }
        }, error.statusCode);
      }

      // Handle database errors
      if (error.message?.includes('SQLITE') || error.message?.includes('D1')) {
        return c.json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed',
            requestId: crypto.randomUUID()
          }
        }, 500);
      }

      // Handle validation errors from D1
      if (error.message?.includes('NOT NULL') || error.message?.includes('UNIQUE')) {
        return c.json({
          success: false,
          error: {
            code: 'DATABASE_CONSTRAINT',
            message: 'Data validation failed',
            details: error.message,
            requestId: crypto.randomUUID()
          }
        }, 400);
      }

      // Default: Internal server error
      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          requestId: crypto.randomUUID()
        }
      }, 500);
    }
  };
}

/**
 * Not found handler for undefined routes
 */
export function notFoundHandler(c) {
  return c.json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${c.req.method} ${c.req.path} not found`,
      requestId: crypto.randomUUID()
    }
  }, 404);
}
