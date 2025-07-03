import express, { Request, Response, Router } from 'express';
import db from '../db'; // Import the database connection
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Define Device type matching database schema
interface Device {
  id: number;
  serial_number?: string | null;
  device_type: string;
  model?: string | null;
  manufacturer?: string | null;
  firmware_version?: string | null;
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned';
  // api_key_hash?: string | null; // We'll skip API key for now
  farm_id?: number | null;
  farmer_id?: number | null;
  location_lat?: number | null;
  location_lon?: number | null;
  config_params?: any | null; // JSONB
  registered_at: Date;
  last_seen_at?: Date | null;
}

// POST /api/devices - Register a new device (Admin only)
router.post('/', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const {
    serial_number,
    device_type,
    model,
    manufacturer,
    firmware_version,
    status = 'inactive', // Default status
    farm_id,
    farmer_id,
    location_lat,
    location_lon,
    config_params,
  }: Partial<Device> = req.body;

  // Default device_type to "SentraBot" if not provided
  const finalDeviceType = device_type || "SentraBot";

  try {
    const insertQuery = `
      INSERT INTO devices (
        serial_number, device_type, model, manufacturer, firmware_version, status,
        farm_id, farmer_id, location_lat, location_lon, config_params
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const newDeviceResult = await db.query(insertQuery, [
      serial_number, finalDeviceType, model, manufacturer, firmware_version, status,
      farm_id, farmer_id, location_lat, location_lon, config_params
    ]);
    const newDevice: Device = newDeviceResult.rows[0];

    console.log('Registered new device (DB):', newDevice);
    res.status(201).json(newDevice);
  } catch (error: any) {
    console.error('Error registering device:', error);
    if (error.code === '23503' && error.constraint === 'devices_farmer_id_fkey') {
        return res.status(400).json({ message: `Invalid farmer_id: ${farmer_id}. User does not exist.` });
    }
    if (error.code === '23505' && error.constraint === 'devices_serial_number_key') {
        return res.status(409).json({ message: `Device with serial number '${serial_number}' already exists.`});
    }
    res.status(500).json({ message: 'Internal server error during device registration.' });
  }
});

// DELETE /api/devices/:id - Delete a device by ID (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const deviceId = parseInt(req.params.id, 10);
  if (isNaN(deviceId)) {
    return res.status(400).json({ message: 'Invalid device ID format.' });
  }

  try {
    const result = await db.query('DELETE FROM devices WHERE id = $1 RETURNING *', [deviceId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Device not found.' });
    }
    res.status(200).json({ message: 'Device deleted successfully.', device: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting device ${deviceId}:`, error);
    res.status(500).json({ message: 'Internal server error while deleting device.' });
  }
});

// GET /api/devices - Get all devices (Admin only for now)
router.get('/', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add pagination and filtering (e.g., by farmer_id, status for farmer view)
    const result = await db.query('SELECT * FROM devices ORDER BY registered_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Internal server error while fetching devices.' });
  }
});

// GET /api/devices/:id - Get a single device by ID (Admin only for now)
router.get('/:id', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const deviceId = parseInt(req.params.id, 10);
  if (isNaN(deviceId)) {
    return res.status(400).json({ message: 'Invalid device ID format.' });
  }

  try {
    const result = await db.query('SELECT * FROM devices WHERE id = $1', [deviceId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Device not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching device ${deviceId}:`, error);
    res.status(500).json({ message: 'Internal server error while fetching device.' });
  }
});

export default router;
