# Fieldvibe API - Modular Architecture

This directory contains the refactored, modular API structure for Fieldvibe.

## Directory Structure

```
src/
├── index.js                 # Main entry point (backward compatible)
├── middleware/
│   ├── auth.js             # Authentication & authorization
│   ├── errorHandler.js     # Centralized error handling
│   └── validation.js       # Request validation
├── routes/
│   ├── field-ops/
│   │   ├── visits.js       # Visit management endpoints
│   │   ├── agents.js       # Agent management (TODO)
│   │   ├── targets.js      # Target management (TODO)
│   │   └── reports.js      # Report endpoints (TODO)
│   ├── van-sales/          # Van sales endpoints (TODO)
│   ├── commissions/        # Commission endpoints (TODO)
│   ├── customers/          # Customer endpoints (TODO)
│   └── admin/              # Admin endpoints (TODO)
├── services/
│   ├── visitService.js     # Visit business logic
│   ├── commissionService.js # Commission calculations (TODO)
│   ├── reportService.js    # Report generation (TODO)
│   └── notificationService.js # Notifications (TODO)
├── models/                  # Data models/types (TODO)
├── database/
│   ├── schema.js           # Database schema definitions
│   └── migrations/         # Versioned migrations (TODO)
└── utils/                   # Utility functions (TODO)
```

## Migration Status

### ✅ Completed
- [x] Middleware layer (auth, error handling, validation)
- [x] Visit service implementation
- [x] Visit routes (modular)
- [x] Database schema definitions
- [x] Individual registration fix in visit workflow

### 🔄 In Progress
- [ ] Extract all visit endpoints from monolith
- [ ] Agent management routes
- [ ] Target management routes
- [ ] Report endpoints refactoring

### 📋 TODO
- [ ] Commission service & routes
- [ ] Customer management routes
- [ ] Admin routes
- [ ] Van sales routes
- [ ] Survey routes
- [ ] Product management routes
- [ ] Complete test coverage

## Usage

### Importing Modular Routes

```javascript
import { Hono } from 'hono';
import visitRoutes from './routes/field-ops/visits.js';

const app = new Hono();

// Mount routes
app.route('/api/v1/field-ops', visitRoutes);
```

### Using Services

```javascript
import { createVisit, getAgentVisits } from '../services/visitService.js';

// In your route handler
const result = await createVisit(db, tenantId, userId, data);
```

### Using Middleware

```javascript
import { authMiddleware, validateRequest } from '../middleware/index.js';

app.post('/visits', 
  authMiddleware, 
  validateRequest({
    body: {
      visit_target_type: 'required|in:individual,store',
      agent_id: 'uuid'
    }
  }),
  async (c) => {
    // Handler code
  }
);
```

## Validation Rules

Available validation rules:

- `required` - Field must be present
- `string` - Must be a string
- `number` - Must be a number
- `boolean` - Must be a boolean
- `email` - Valid email format
- `uuid` - Valid UUID format
- `phone` - Valid phone number
- `date` - Valid date
- `min:value` - Minimum value
- `max:value` - Maximum value
- `minLength:value` - Minimum string length
- `maxLength:value` - Maximum string length
- `in:val1,val2` - Must be one of the values
- `pattern:regex` - Must match pattern

## Error Handling

All errors are caught by the centralized error handler and return standardized responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [...],
    "requestId": "req_abc123"
  }
}
```

## Testing

Run tests with:

```bash
npm test
```

Write tests in `tests/` directory:

```javascript
import { describe, it, expect } from 'vitest';
import { createVisit } from '../services/visitService.js';

describe('VisitService', () => {
  it('should create a visit', async () => {
    // Test implementation
  });
});
```

## Backward Compatibility

The original `index.js` file maintains all existing endpoints for backward compatibility. New code should use the modular structure, and existing endpoints will be gradually migrated.

## Next Steps

1. Extract remaining endpoints to modular routes
2. Add comprehensive unit tests
3. Implement database migrations
4. Add API documentation
5. Set up integration tests

## Contributing

When adding new features:
1. Create service layer for business logic
2. Create routes for endpoints
3. Add validation middleware
4. Write unit tests
5. Update this documentation
