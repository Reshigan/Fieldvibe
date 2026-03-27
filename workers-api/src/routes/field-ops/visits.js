/**
 * Visit Routes
 * Visit management endpoints
 */

import { Router } from 'itty-router';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { createVisit, getAgentVisits, updateVisitStatus } from '../services/visitService.js';

const router = Router();

/**
 * GET /visits - List visits with filters
 */
router.get('/visits', authMiddleware, async (c) => {
  const db = c.env.DB;
  const tenantId = c.get('tenantId');
  const userId = c.get('userId');
  const role = c.get('role');
  
  const { agent_id, status, start_date, end_date, page = '1', limit = '20' } = c.req.query();
  
  try {
    let query = `
      SELECT v.*, 
             u.first_name || ' ' || u.last_name as agent_name,
             c.name as customer_name
      FROM visits v
      LEFT JOIN users u ON v.agent_id = u.id
      LEFT JOIN customers c ON v.customer_id = c.id
      WHERE v.tenant_id = ?
    `;
    
    const binds = [tenantId];
    
    // Filter by agent (agents see only their own)
    if (role === 'agent' || role === 'field_agent') {
      query += ` AND v.agent_id = ?`;
      binds.push(userId);
    } else if (agent_id) {
      query += ` AND v.agent_id = ?`;
      binds.push(agent_id);
    }
    
    // Status filter
    if (status) {
      query += ` AND v.status = ?`;
      binds.push(status);
    }
    
    // Date range filter
    if (start_date) {
      query += ` AND v.visit_date >= ?`;
      binds.push(start_date);
    }
    if (end_date) {
      query += ` AND v.visit_date <= ?`;
      binds.push(end_date);
    }
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY v.visit_date DESC LIMIT ? OFFSET ?`;
    binds.push(parseInt(limit), offset);
    
    const visits = await db.prepare(query).bind(...binds).all();
    
    // Get total count
    const countQuery = query.replace('SELECT v.*, u.first_name || \' \' || u.last_name as agent_name, c.name as customer_name', 'SELECT COUNT(*) as count');
    const countResult = await db.prepare(countQuery).bind(...binds).first();
    
    return c.json({
      success: true,
      data: visits.results || [],
      meta: {
        total: countResult?.count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil((countResult?.count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching visits:', error);
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch visits'
      }
    }, 500);
  }
});

/**
 * GET /visits/:id - Get single visit
 */
router.get('/visits/:id', authMiddleware, async (c) => {
  const db = c.env.DB;
  const tenantId = c.get('tenantId');
  const visitId = c.req.param('id');
  
  try {
    const visit = await db.prepare(`
      SELECT v.*, 
             u.first_name || ' ' || u.last_name as agent_name,
             c.name as customer_name
      FROM visits v
      LEFT JOIN users u ON v.agent_id = u.id
      LEFT JOIN customers c ON v.customer_id = c.id
      WHERE v.id = ? AND v.tenant_id = ?
    `).bind(visitId, tenantId).first();
    
    if (!visit) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Visit not found' }
      }, 404);
    }
    
    // Get related data
    const [photos, responses, individuals] = await Promise.all([
      db.prepare('SELECT * FROM visit_photos WHERE visit_id = ? AND tenant_id = ?').bind(visitId, tenantId).all(),
      db.prepare('SELECT * FROM visit_responses WHERE visit_id = ? AND tenant_id = ?').bind(visitId, tenantId).all(),
      db.prepare(`
        SELECT vi.*, i.first_name, i.last_name, i.id_number, i.phone
        FROM visit_individuals vi
        LEFT JOIN individuals i ON vi.individual_id = i.id
        WHERE vi.visit_id = ? AND vi.tenant_id = ?
      `).bind(visitId, tenantId).all()
    ]);
    
    return c.json({
      success: true,
      data: {
        ...visit,
        photos: photos.results || [],
        responses: responses.results || [],
        individuals: individuals.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching visit:', error);
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to fetch visit' }
    }, 500);
  }
});

/**
 * POST /visits/workflow - Create visit with full workflow
 */
router.post('/visits/workflow', authMiddleware, validateRequest({
  body: {
    visit_target_type: 'required|in:individual,store,customer',
    visit_date: 'date',
    agent_id: 'uuid',
    customer_id: 'uuid',
    individual_first_name: 'string',
    individual_last_name: 'string',
    individual_id_number: 'string',
    individual_phone: 'phone'
  }
}), async (c) => {
  const db = c.env.DB;
  const tenantId = c.get('tenantId');
  const userId = c.get('userId');
  
  try {
    const body = await c.req.json();
    const result = await createVisit(db, tenantId, userId, body);
    
    return c.json({
      success: true,
      data: result,
      message: 'Visit created successfully'
    }, 201);
  } catch (error) {
    console.error('Error creating visit:', error);
    return c.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create visit'
      }
    }, 500);
  }
});

/**
 * POST /visits/:id/complete - Complete a visit
 */
router.post('/visits/:id/complete', authMiddleware, async (c) => {
  const db = c.env.DB;
  const tenantId = c.get('tenantId');
  const visitId = c.req.param('id');
  
  try {
    const body = await c.req.json();
    await updateVisitStatus(db, tenantId, visitId, 'completed', body);
    
    return c.json({
      success: true,
      message: 'Visit completed successfully'
    });
  } catch (error) {
    console.error('Error completing visit:', error);
    return c.json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to complete visit' }
    }, 500);
  }
});

/**
 * DELETE /visits/:id - Soft delete visit
 */
router.delete('/visits/:id', authMiddleware, async (c) => {
  const db = c.env.DB;
  const tenantId = c.get('tenantId');
  const visitId = c.req.param('id');
  
  try {
    await deleteVisit(db, tenantId, visitId);
    
    return c.json({
      success: true,
      message: 'Visit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting visit:', error);
    return c.json({
      success: false,
      error: { code: 'DELETE_ERROR', message: 'Failed to delete visit' }
    }, 500);
  }
});

export default router;
