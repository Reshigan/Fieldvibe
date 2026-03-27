/**
 * Request Validation Middleware
 * Validates incoming request data against schemas
 */

/**
 * Validation rules
 */
const validators = {
  required: (value) => value !== undefined && value !== null && value !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  uuid: (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
  phone: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value),
  date: (value) => !isNaN(Date.parse(value)),
  number: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  integer: (value) => Number.isInteger(Number(value)),
  minLength: (min) => (value) => String(value).length >= min,
  maxLength: (max) => (value) => String(value).length <= max,
  min: (min) => (value) => Number(value) >= min,
  max: (max) => (value) => Number(value) <= max,
  in: (allowed) => (value) => allowed.includes(value),
  pattern: (regex) => (value) => regex.test(value),
};

/**
 * Validate a single field
 */
function validateField(value, rules, fieldName) {
  const errors = [];

  for (const [rule, param] of Object.entries(rules)) {
    const validator = validators[rule];
    
    if (!validator) {
      console.warn(`Unknown validation rule: ${rule}`);
      continue;
    }

    const validationFn = typeof param === 'function' ? param : validator(param);
    const isValid = typeof param === 'function' ? param(value) : validationFn(value);

    if (!isValid) {
      errors.push({
        field: fieldName,
        rule,
        message: getValidationMessage(fieldName, rule, param)
      });
    }
  }

  return errors;
}

/**
 * Get human-readable validation error message
 */
function getValidationMessage(field, rule, param) {
  const messages = {
    required: `${field} is required`,
    email: `${field} must be a valid email address`,
    uuid: `${field} must be a valid UUID`,
    phone: `${field} must be a valid phone number`,
    date: `${field} must be a valid date`,
    number: `${field} must be a number`,
    integer: `${field} must be an integer`,
    minLength: `${field} must be at least ${param} characters`,
    maxLength: `${field} must be at most ${param} characters`,
    min: `${field} must be at least ${param}`,
    max: `${field} must be at most ${param}`,
    in: `${field} must be one of: ${param.join(', ')}`,
    pattern: `${field} has invalid format`,
  };

  return messages[rule] || `${field} failed validation`;
}

/**
 * Validate request data against schema
 */
export function validateRequest(schema) {
  return async (c, next) => {
    const errors = [];

    // Validate query parameters
    if (schema.query) {
      const query = Object.fromEntries(c.req.query());
      for (const [field, rules] of Object.entries(schema.query)) {
        const value = query[field];
        errors.push(...validateField(value, rules, `query.${field}`));
      }
    }

    // Validate URL parameters
    if (schema.params) {
      for (const [field, rules] of Object.entries(schema.params)) {
        const value = c.req.param(field);
        errors.push(...validateField(value, rules, `params.${field}`));
      }
    }

    // Validate request body
    if (schema.body) {
      let body;
      try {
        body = await c.req.json();
      } catch (e) {
        if (schema.body) {
          return c.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid JSON body',
              requestId: crypto.randomUUID()
            }
          }, 400);
        }
      }

      for (const [field, rules] of Object.entries(schema.body)) {
        const value = body?.[field];
        errors.push(...validateField(value, rules, `body.${field}`));
      }

      // Attach validated body to request for downstream use
      c.set('validatedBody', body);
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: errors,
          requestId: crypto.randomUUID()
        }
      }, 400);
    }

    await next();
  };
}

/**
 * Sanitize string input
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Sanitize all string fields in an object
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return sanitized;
}
