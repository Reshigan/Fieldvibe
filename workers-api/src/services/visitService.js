/**
 * Visit Service
 * Business logic for visit management
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new visit with full workflow
 */
export async function createVisit(db, tenantId, userId, data) {
  const visitId = data.client_visit_id || uuidv4();
  const now = new Date().toISOString();
  const visitDate = data.visit_date || now.split('T')[0];
  
  // Idempotency check
  if (data.client_visit_id) {
    const existing = await db.prepare(
      "SELECT id, status FROM visits WHERE tenant_id = ? AND id = ?"
    ).bind(tenantId, data.client_visit_id).first();
    
    if (existing) {
      return {
        id: existing.id,
        status: existing.status,
        visit_date: visitDate,
        already_existed: true
      };
    }
  }
  
  // Auto-create customer for store visits if needed
  let customerId = data.customer_id || null;
  if (data.visit_target_type === 'store' && !customerId && data.store_name) {
    customerId = uuidv4();
    await createCustomer(db, tenantId, customerId, data.store_name, data);
  }
  
  // Create visit record
  await createVisitRecord(db, tenantId, userId, visitId, customerId, data, visitDate, now);
  
  // Handle individual registration if applicable
  let individualId = null;
  if (data.visit_target_type === 'individual' && (data.individual_first_name || data.individual_id_number)) {
    individualId = await handleIndividualRegistration(db, tenantId, userId, visitId, data, now);
  }
  
  // Save survey responses if provided
  if (data.survey_responses && Object.keys(data.survey_responses).length > 0) {
    await saveSurveyResponses(db, tenantId, visitId, data);
  }
  
  // Save photos if provided
  if (Array.isArray(data.photos) && data.photos.length > 0) {
    await saveVisitPhotos(db, tenantId, visitId, data.photos, userId, now);
  }
  
  return {
    id: visitId,
    individual_id: individualId,
    status: 'completed',
    visit_date: visitDate
  };
}

/**
 * Helper: Create customer for store visits
 */
async function createCustomer(db, tenantId, customerId, storeName, data) {
  const now = new Date().toISOString();
  try {
    await db.prepare(
      'INSERT INTO customers (id, tenant_id, name, type, customer_type, latitude, longitude, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      customerId, tenantId, storeName, 'retail', 'SHOP',
      data.checkin_latitude ?? null, data.checkin_longitude ?? null,
      'active', now, now
    ).run();
  } catch {
    // Fallback without customer_type
    await db.prepare(
      'INSERT INTO customers (id, tenant_id, name, type, latitude, longitude, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      customerId, tenantId, storeName, 'retail',
      data.checkin_latitude ?? null, data.checkin_longitude ?? null,
      'active', now, now
    ).run();
  }
}

/**
 * Helper: Create visit record
 */
async function createVisitRecord(db, tenantId, userId, visitId, customerId, data, visitDate, now) {
  const companyId = data.company_id || null;
  const brandId = data.brand_id || null;
  
  try {
    await db.prepare(`
      INSERT INTO visits (
        id, tenant_id, agent_id, customer_id, visit_date, visit_type, 
        check_in_time, latitude, longitude, brand_id, company_id,
        individual_name, individual_surname, individual_id_number, individual_phone,
        purpose, notes, questionnaire_id, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
    `).bind(
      visitId, tenantId, data.agent_id || userId, customerId, visitDate,
      data.visit_target_type || 'customer', now,
      data.checkin_latitude ?? null, data.checkin_longitude ?? null,
      brandId, companyId,
      data.individual_first_name || null, data.individual_last_name || null,
      data.individual_id_number || null, data.individual_phone || null,
      data.purpose || data.visit_target_type || 'field_visit',
      data.notes || null, data.questionnaire_id || null,
      now, now
    ).run();
  } catch {
    // Fallback without company_id
    await db.prepare(`
      INSERT INTO visits (
        id, tenant_id, agent_id, customer_id, visit_date, visit_type,
        check_in_time, latitude, longitude, brand_id,
        individual_name, individual_surname, individual_id_number, individual_phone,
        purpose, notes, questionnaire_id, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
    `).bind(
      visitId, tenantId, data.agent_id || userId, customerId, visitDate,
      data.visit_target_type || 'customer', now,
      data.checkin_latitude ?? null, data.checkin_longitude ?? null,
      brandId,
      data.individual_first_name || null, data.individual_last_name || null,
      data.individual_id_number || null, data.individual_phone || null,
      data.purpose || data.visit_target_type || 'field_visit',
      data.notes || null, data.questionnaire_id || null,
      now, now
    ).run();
  }
}

/**
 * Helper: Handle individual registration (CRITICAL: Creates individual_registrations record)
 */
async function handleIndividualRegistration(db, tenantId, userId, visitId, data, now) {
  // Find or create individual
  let individualId = null;
  let existingIndividual = null;
  
  if (data.individual_id_number) {
    existingIndividual = await db.prepare(
      'SELECT id FROM individuals WHERE tenant_id = ? AND id_number = ? AND id_number != ""'
    ).bind(tenantId, data.individual_id_number).first();
  }
  
  if (!existingIndividual && data.individual_phone) {
    existingIndividual = await db.prepare(
      'SELECT id FROM individuals WHERE tenant_id = ? AND phone = ? AND phone != ""'
    ).bind(tenantId, data.individual_phone).first();
  }
  
  if (existingIndividual) {
    individualId = existingIndividual.id;
    // Update individual details
    await db.prepare(
      'UPDATE individuals SET first_name = ?, last_name = ?, gps_latitude = ?, gps_longitude = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
      data.individual_first_name || '', data.individual_last_name || '',
      data.checkin_latitude ?? null, data.checkin_longitude ?? null,
      individualId
    ).run();
  } else {
    individualId = uuidv4();
    await db.prepare(
      'INSERT INTO individuals (id, tenant_id, first_name, last_name, id_number, phone, email, gps_latitude, gps_longitude, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      individualId, tenantId, 
      data.individual_first_name || '', data.individual_last_name || '',
      data.individual_id_number || null, data.individual_phone || null, 
      data.individual_email || null,
      data.checkin_latitude ?? null, data.checkin_longitude ?? null, 
      data.company_id || null
    ).run();
  }
  
  // Link visit to individual
  const viId = uuidv4();
  await db.prepare(
    'INSERT INTO visit_individuals (id, tenant_id, visit_id, individual_id, custom_field_values) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    viId, tenantId, visitId, individualId, 
    JSON.stringify(data.custom_field_values || {})
  ).run();
  
  // CRITICAL: Create individual_registrations record for reporting
  const regId = uuidv4();
  const isConverted = data.converted === true || data.product_app_player_id ? 1 : 0;
  await db.prepare(`
    INSERT INTO individual_registrations (
      id, tenant_id, agent_id, company_id, visit_id,
      first_name, last_name, id_number, phone, email,
      product_app_player_id, converted, conversion_date,
      notes, gps_latitude, gps_longitude, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    regId, tenantId, data.agent_id || userId, data.company_id || null, visitId,
    data.individual_first_name || '', data.individual_last_name || '',
    data.individual_id_number || null, data.individual_phone || null, 
    data.individual_email || null,
    data.product_app_player_id || null, isConverted, isConverted ? now : null,
    data.notes || null, data.checkin_latitude ?? null, data.checkin_longitude ?? null, now
  ).run();
  
  return individualId;
}

/**
 * Helper: Save survey responses
 */
async function saveSurveyResponses(db, tenantId, visitId, data) {
  const vrId = uuidv4();
  await db.prepare(
    'INSERT INTO visit_responses (id, tenant_id, visit_id, visit_type, responses) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    vrId, tenantId, visitId, data.visit_target_type || 'customer', 
    JSON.stringify(data.survey_responses)
  ).run();
}

/**
 * Helper: Save visit photos
 */
async function saveVisitPhotos(db, tenantId, visitId, photos, userId, now) {
  for (const photo of photos) {
    const photoId = uuidv4();
    try {
      await db.prepare(`
        INSERT INTO visit_photos (
          id, tenant_id, visit_id, photo_type, r2_key, r2_url,
          gps_latitude, gps_longitude, captured_at, photo_hash,
          board_placement_location, board_placement_position, board_condition,
          sample_board_id, uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        photoId, tenantId, visitId, photo.photo_type || 'board',
        photo.r2_key || `photos/${visitId}/${photoId}`, 
        photo.r2_url || photo.photo_url || null,
        photo.gps_latitude ?? null, photo.gps_longitude ?? null,
        photo.captured_at || now, photo.photo_hash || null,
        photo.board_placement_location || null, 
        photo.board_placement_position || null,
        photo.board_condition || null, 
        photo.sample_board_id || null, userId
      ).run();
    } catch {
      // Fallback without board placement columns
      await db.prepare(`
        INSERT INTO visit_photos (
          id, tenant_id, visit_id, photo_type, r2_key, r2_url,
          gps_latitude, gps_longitude, captured_at, photo_hash, uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        photoId, tenantId, visitId, photo.photo_type || 'board',
        photo.r2_key || `photos/${visitId}/${photoId}`, 
        photo.r2_url || photo.photo_url || null,
        photo.gps_latitude ?? null, photo.gps_longitude ?? null,
        photo.captured_at || now, photo.photo_hash || null, userId
      ).run();
    }
  }
}

/**
 * Get visits for an agent with filters
 */
export async function getAgentVisits(db, tenantId, agentId, filters = {}) {
  let query = `
    SELECT v.*, 
           u.first_name || ' ' || u.last_name as agent_name,
           c.name as customer_name
    FROM visits v
    LEFT JOIN users u ON v.agent_id = u.id
    LEFT JOIN customers c ON v.customer_id = c.id
    WHERE v.tenant_id = ? AND v.agent_id = ?
  `;
  
  const binds = [tenantId, agentId];
  
  if (filters.status) {
    query += ` AND v.status = ?`;
    binds.push(filters.status);
  }
  
  if (filters.startDate) {
    query += ` AND v.visit_date >= ?`;
    binds.push(filters.startDate);
  }
  
  if (filters.endDate) {
    query += ` AND v.visit_date <= ?`;
    binds.push(filters.endDate);
  }
  
  query += ` ORDER BY v.visit_date DESC`;
  
  return await db.prepare(query).bind(...binds).all();
}

/**
 * Update visit status
 */
export async function updateVisitStatus(db, tenantId, visitId, status, completionData = {}) {
  const now = new Date().toISOString();
  
  const updateFields = ['status = ?', 'updated_at = ?'];
  const values = [status, now];
  
  if (status === 'completed') {
    updateFields.push('check_out_time = ?');
    values.push(now);
  }
  
  if (completionData.outcome) {
    updateFields.push('outcome = ?');
    values.push(completionData.outcome);
  }
  
  if (completionData.notes) {
    updateFields.push('notes = CASE WHEN ? != \'\' THEN COALESCE(notes || \' | \', \'\') || ? ELSE notes END');
    values.push(completionData.notes, completionData.notes);
  }
  
  await db.prepare(`
    UPDATE visits 
    SET ${updateFields.join(', ')} 
    WHERE id = ? AND tenant_id = ?
  `).bind(...values, visitId, tenantId).run();
}

/**
 * Delete visit (soft delete)
 */
export async function deleteVisit(db, tenantId, visitId) {
  await db.prepare(
    'UPDATE visits SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?'
  ).bind(visitId, tenantId).run();
}
