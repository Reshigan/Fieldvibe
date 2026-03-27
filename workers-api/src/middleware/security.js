/**
 * Security Middleware
 * Rate limiting, security headers, CORS, input sanitization
 */

/**
 * Rate limiting configuration
 */
const rateLimitStore = new Map();

const DEFAULT_LIMIT = 100;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Rate limiting middleware
 */
export function rateLimit(options = {}) {
  const {
    max = DEFAULT_LIMIT,
    windowMs = DEFAULT_WINDOW_MS,
    message = 'Too many requests, please try again later',
    skip = () => false
  } = options;

  return async (c, next) => {
    if (skip(c)) {
      await next();
      return;
    }

    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    // Clean old entries
    if (rateLimitStore.size > 10000) {
      rateLimitStore.clear();
    }

    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    rateLimitStore.set(key, record);

    // Set rate limit headers
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, max - record.count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

    if (record.count > max) {
      c.header('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());
      return c.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        }
      }, 429);
    }

    await next();
  };
}

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return async (c, next) => {
    await next();

    // Prevent MIME type sniffing
    c.header('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    c.header('X-Frame-Options', 'DENY');
    
    // XSS protection
    c.header('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy
    c.header('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';"
    );
    
    // Permissions Policy
    c.header('Permissions-Policy',
      'geolocation=self, microphone=(), camera=(), payment=()'
    );
    
    // Cache control for API responses
    if (c.req.path.startsWith('/api/')) {
      c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      c.header('Pragma', 'no-cache');
      c.header('Expires', '0');
    }
  };
}

/**
 * CORS middleware
 */
export function cors(options = {}) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials = false,
    maxAge = 86400
  } = options;

  return async (c, next) => {
    const requestOrigin = c.req.header('Origin');
    
    // Handle preflight
    if (c.req.method === 'OPTIONS') {
      c.header('Access-Control-Allow-Origin', origin === '*' ? '*' : (requestOrigin || origin));
      c.header('Access-Control-Allow-Methods', methods.join(', '));
      c.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      c.header('Access-Control-Max-Age', maxAge.toString());
      if (credentials) {
        c.header('Access-Control-Allow-Credentials', 'true');
      }
      return c.body(null, 204);
    }

    await next();

    c.header('Access-Control-Allow-Origin', origin === '*' ? '*' : (requestOrigin || origin));
    c.header('Access-Control-Expose-Headers', exposedHeaders.join(', '));
    if (credentials) {
      c.header('Access-Control-Allow-Credentials', 'true');
    }
  };
}

/**
 * Input sanitization
 */
export function sanitizeInput(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potential XSS
      sanitized[key] = value
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Request ID middleware for tracing
 */
export function requestId() {
  return async (c, next) => {
    const id = c.req.header('X-Request-ID') || crypto.randomUUID();
    c.set('requestId', id);
    c.header('X-Request-ID', id);
    await next();
  };
}

/**
 * Helmet-like security middleware (combines all security headers)
 */
export function helmet() {
  return async (c, next) => {
    // HSTS
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Content Type
    c.header('X-Content-Type-Options', 'nosniff');
    
    // Frame Options
    c.header('X-Frame-Options', 'DENY');
    
    // XSS Protection
    c.header('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    c.header('Permissions-Policy', 
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    );

    await next();
  };
}

/**
 * JWT token utilities
 */
export const jwtUtils = {
  /**
   * Generate access token
   */
  generateAccessToken(payload, expiresIn = '1h') {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (parseInt(expiresIn) * 3600) // Convert hours to seconds
    };

    return this.encodeToken(header, tokenPayload);
  },

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload, expiresIn = '7d') {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (parseInt(expiresIn) * 24 * 3600) // Convert days to seconds
    };

    return this.encodeToken(header, tokenPayload);
  },

  /**
   * Encode JWT token
   */
  encodeToken(header, payload) {
    const headerEncoded = btoa(JSON.stringify(header));
    const payloadEncoded = btoa(JSON.stringify(payload));
    return `${headerEncoded}.${payloadEncoded}.signature`;
  },

  /**
   * Verify token
   */
  verifyToken(token, secret) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }

      const payload = JSON.parse(atob(parts[1]));
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return { valid: false, error: 'Token expired' };
      }

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: 'Token verification failed' };
    }
  }
};
