import express, { Router, Request, Response } from 'express';
import db from '../db';
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Define Alert types (matching ENUMs in DB)
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';

interface Alert {
  id: number;
  alert_type: string;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
  details?: any | null; // JSONB
  farmer_id?: number | null;
  device_id?: number | null;
  farm_id?: number | null;
  field_id?: number | null;
  created_by_user_id?: number | null;
  created_at: Date;
  updated_at: Date;
  acknowledged_at?: Date | null;
  resolved_at?: Date | null;
}

// POST /api/alerts - Create a new alert (Admin for manual, or system)
router.post('/', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const {
    alert_type,
    severity = 'medium',
    message,
    status = 'new',
    details,
    farmer_id, // Can be set by admin
    device_id, // Can be set by admin
    farm_id,   // Can be set by admin
    field_id,  // Can be set by admin
  } = req.body;

  const created_by_user_id = req.user!.userId; // Admin creating it

  if (!alert_type || !message) {
    return res.status(400).json({ message: 'alert_type and message are required.' });
  }

  try {
    const query = `
      INSERT INTO alerts (
        alert_type, severity, message, status, details,
        farmer_id, device_id, farm_id, field_id, created_by_user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const result = await db.query(query, [
      alert_type, severity, message, status, details,
      farmer_id, device_id, farm_id, field_id, created_by_user_id
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating alert:', error);
    // Add more specific error handling for foreign key violations if needed
    res.status(500).json({ message: 'Internal server error creating alert.' });
  }
});

// GET /api/alerts - List alerts
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUser = req.user!;
  // Query parameters for filtering
  const { farmerId, deviceId, farmId, fieldId, status: alertStatus, severity: alertSeverity, alertType } = req.query;

  try {
    let query = 'SELECT * FROM alerts';
    const params: any[] = [];
    const conditions: string[] = [];
    let paramIndex = 1;

    if (authenticatedUser.role === 'farmer') {
      // Farmers can only see alerts related to them
      conditions.push(`(farmer_id = $${paramIndex++} OR farm_id IN (SELECT id FROM farms WHERE farmer_id = $${paramIndex++}) OR device_id IN (SELECT id FROM devices WHERE farmer_id = $${paramIndex++}))`);
      params.push(authenticatedUser.userId, authenticatedUser.userId, authenticatedUser.userId);
    } else if (authenticatedUser.role === 'admin') {
      // Admin can filter by specific farmer if query param is provided
      if (farmerId) { conditions.push(`farmer_id = $${paramIndex++}`); params.push(parseInt(farmerId as string, 10)); }
    } else {
      return res.status(403).json({ message: "Forbidden: Role not recognized." });
    }
    
    // Add other filters
    if (deviceId) { conditions.push(`device_id = $${paramIndex++}`); params.push(parseInt(deviceId as string, 10)); }
    if (farmId) { conditions.push(`farm_id = $${paramIndex++}`); params.push(parseInt(farmId as string, 10)); }
    if (fieldId) { conditions.push(`field_id = $${paramIndex++}`); params.push(parseInt(fieldId as string, 10)); }
    if (alertStatus) { conditions.push(`status = $${paramIndex++}`); params.push(alertStatus as string); }
    if (alertSeverity) { conditions.push(`severity = $${paramIndex++}`); params.push(alertSeverity as string); }
    if (alertType) { conditions.push(`alert_type = $${paramIndex++}`); params.push(alertType as string); }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Internal server error fetching alerts.' });
  }
});

// GET /api/alerts/:id - Get a specific alert
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  const authenticatedUser = req.user!;
  const alertId = parseInt(req.params.id, 10);

  if (isNaN(alertId)) {
    return res.status(400).json({ message: 'Invalid alert ID.' });
  }

  try {
    const result = await db.query('SELECT * FROM alerts WHERE id = $1', [alertId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Alert not found.' });
    }
    const alert: Alert = result.rows[0];

    // Authorization for farmer
    if (authenticatedUser.role === 'farmer') {
      let isRelated = alert.farmer_id === authenticatedUser.userId;
      if (!isRelated && alert.farm_id) {
        const farmCheck = await db.query('SELECT farmer_id FROM farms WHERE id = $1 AND farmer_id = $2', [alert.farm_id, authenticatedUser.userId]);
        if (farmCheck.rows.length > 0) isRelated = true;
      }
      if (!isRelated && alert.device_id) {
        const deviceCheck = await db.query('SELECT farmer_id FROM devices WHERE id = $1 AND farmer_id = $2', [alert.device_id, authenticatedUser.userId]);
        if (deviceCheck.rows.length > 0) isRelated = true;
      }
      if (!isRelated) {
        return res.status(403).json({ message: 'Forbidden: You can only view alerts related to you.' });
      }
    }
    // Admins can view any alert

    res.status(200).json(alert);
  } catch (error) {
    console.error(`Error fetching alert ${alertId}:`, error);
    res.status(500).json({ message: 'Internal server error fetching alert.' });
  }
});

// PUT /api/alerts/:id - Update an alert
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  const authenticatedUser = req.user!;
  const alertId = parseInt(req.params.id, 10);

  if (isNaN(alertId)) {
    return res.status(400).json({ message: 'Invalid alert ID.' });
  }

  const { severity, message, status, details } = req.body;
  // For status updates like 'acknowledged' or 'resolved', set respective timestamps
  const updates: string[] = [];
  const values: any[] = [];
  let queryIndex = 1;

  if (severity) { updates.push(`severity = $${queryIndex++}`); values.push(severity); }
  if (message) { updates.push(`message = $${queryIndex++}`); values.push(message); }
  if (status) {
    updates.push(`status = $${queryIndex++}`); values.push(status);
    if (status === 'acknowledged') { updates.push(`acknowledged_at = NOW()`); }
    if (status === 'resolved' || status === 'closed') { updates.push(`resolved_at = NOW()`); }
  }
  if (details) { updates.push(`details = $${queryIndex++}`); values.push(details); }
  
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No update fields provided.' });
  }
  
  updates.push(`updated_at = NOW()`);

  try {
    // Authorization check before update
    const alertCheckResult = await db.query('SELECT farmer_id, farm_id, device_id, status as current_status FROM alerts WHERE id = $1', [alertId]);
    if (alertCheckResult.rows.length === 0) {
      return res.status(404).json({ message: 'Alert not found.' });
    }
    const alertToUpdate = alertCheckResult.rows[0];

    if (authenticatedUser.role === 'farmer') {
      let isRelated = alertToUpdate.farmer_id === authenticatedUser.userId;
      // Further checks for farm_id/device_id if needed, similar to GET /:id
      if (!isRelated && alertToUpdate.farm_id) {
         const farmCheck = await db.query('SELECT farmer_id FROM farms WHERE id = $1 AND farmer_id = $2', [alertToUpdate.farm_id, authenticatedUser.userId]);
         if (farmCheck.rows.length > 0) isRelated = true;
      }
      if (!isRelated && alertToUpdate.device_id) {
         const deviceCheck = await db.query('SELECT farmer_id FROM devices WHERE id = $1 AND farmer_id = $2', [alertToUpdate.device_id, authenticatedUser.userId]);
         if (deviceCheck.rows.length > 0) isRelated = true;
      }

      if (!isRelated) {
        return res.status(403).json({ message: 'Forbidden: You can only update alerts related to you.' });
      }
      // Farmers can only update status to 'acknowledged' or 'closed' if it's 'new' or 'acknowledged'
      if (status && !['acknowledged', 'closed'].includes(status as string)) {
        return res.status(403).json({ message: "Forbidden: Farmers can only set status to 'acknowledged' or 'closed'."});
      }
      if (severity || message || details) { // Farmers cannot change these
        if (!(status && updates.length === 2 && (updates[0].startsWith("status") || updates[1].startsWith("status")) )) { // check if only status and updated_at are being changed
             return res.status(403).json({ message: "Forbidden: Farmers can only update the status of an alert to acknowledged/closed." });
        }
      }
    }
    // Admins can update any field

    const query = `UPDATE alerts SET ${updates.join(', ')} WHERE id = $${queryIndex} RETURNING *;`;
    values.push(alertId);

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Alert not found or no update occurred.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating alert ${alertId}:`, error);
    res.status(500).json({ message: 'Internal server error updating alert.' });
  }
});

export default router;
