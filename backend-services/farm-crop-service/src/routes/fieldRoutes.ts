import express, { Router } from 'express';
import db from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware'; // authorizeRole can be used if needed

const router: Router = express.Router({ mergeParams: true }); // mergeParams allows access to :farmId from parent router

// Define Field type
interface Field {
  id: number;
  farm_id: number;
  name?: string | null;
  crop_type: string;
  planting_date?: Date | null;
  soil_type?: string | null;
  irrigation_method?: string | null;
  boundary_geojson?: any | null; // GeoJSON Polygon/MultiPolygon
  area_hectares?: number | null;
  created_at: Date;
  updated_at: Date;
}

// POST /api/farms/:farmId/fields - Add a new field to a farm
router.post('/', authenticateToken, async (req: AuthenticatedRequest<{ farmId: string }>, res) => {
  const authenticatedUser = req.user;
  const farmIdParam = parseInt(req.params.farmId, 10);

  if (isNaN(farmIdParam)) {
    return res.status(400).json({ message: 'Invalid farm ID.' });
  }
  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const { name, crop_type, planting_date, soil_type, irrigation_method, boundary_geojson, area_hectares } = req.body;

  if (!crop_type) {
    return res.status(400).json({ message: 'crop_type is required for a field.' });
  }

  try {
    // Authorization: Check if farm exists and if user is authorized to add fields to it
    const farmCheckResult = await db.query('SELECT farmer_id FROM farms WHERE id = $1', [farmIdParam]);
    if (farmCheckResult.rows.length === 0) {
      return res.status(404).json({ message: `Farm with id ${farmIdParam} not found.` });
    }
    const farmOwnerId = farmCheckResult.rows[0].farmer_id;
    if (authenticatedUser.role === 'farmer' && farmOwnerId !== authenticatedUser.userId) {
      return res.status(403).json({ message: 'Forbidden: You can only add fields to your own farms.' });
    }
    // Admins can add to any farm

    const query = `
      INSERT INTO fields (farm_id, name, crop_type, planting_date, soil_type, irrigation_method, boundary_geojson, area_hectares)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const result = await db.query(query, [farmIdParam, name, crop_type, planting_date, soil_type, irrigation_method, boundary_geojson, area_hectares]);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(`Error creating field for farm ${farmIdParam}:`, error);
    // Foreign key violation on farm_id is handled by DB if farm doesn't exist
    res.status(500).json({ message: 'Internal server error creating field.' });
  }
});

// GET /api/farms/:farmId/fields - Get all fields for a specific farm
router.get('/', authenticateToken, async (req: AuthenticatedRequest<{ farmId: string }>, res) => {
  const authenticatedUser = req.user;
  const farmIdParam = parseInt(req.params.farmId, 10);

  if (isNaN(farmIdParam)) {
    return res.status(400).json({ message: 'Invalid farm ID.' });
  }
  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    // Authorization: Check if farm exists and if user is authorized to view its fields
    const farmCheckResult = await db.query('SELECT farmer_id FROM farms WHERE id = $1', [farmIdParam]);
    if (farmCheckResult.rows.length === 0) {
      return res.status(404).json({ message: `Farm with id ${farmIdParam} not found.` });
    }
    const farmOwnerId = farmCheckResult.rows[0].farmer_id;
    if (authenticatedUser.role === 'farmer' && farmOwnerId !== authenticatedUser.userId) {
      return res.status(403).json({ message: 'Forbidden: You can only view fields of your own farms.' });
    }
    // Admins can view any farm's fields

    const query = 'SELECT * FROM fields WHERE farm_id = $1 ORDER BY name ASC';
    const result = await db.query(query, [farmIdParam]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching fields for farm ${farmIdParam}:`, error);
    res.status(500).json({ message: 'Internal server error fetching fields.' });
  }
});

// GET /api/farms/:farmId/fields/:fieldId - Get a specific field
router.get('/:fieldId', authenticateToken, async (req: AuthenticatedRequest<{ farmId: string, fieldId: string }>, res) => {
  const authenticatedUser = req.user;
  const farmIdParam = parseInt(req.params.farmId, 10);
  const fieldIdParam = parseInt(req.params.fieldId, 10);

  if (isNaN(farmIdParam) || isNaN(fieldIdParam)) {
    return res.status(400).json({ message: 'Invalid farm ID or field ID.' });
  }
  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    // Authorization: Check if farm exists and if user is authorized
    const farmCheckResult = await db.query('SELECT farmer_id FROM farms WHERE id = $1', [farmIdParam]);
    if (farmCheckResult.rows.length === 0) {
      return res.status(404).json({ message: `Farm with id ${farmIdParam} not found.` });
    }
    const farmOwnerId = farmCheckResult.rows[0].farmer_id;
    if (authenticatedUser.role === 'farmer' && farmOwnerId !== authenticatedUser.userId) {
      return res.status(403).json({ message: 'Forbidden: You can only view fields of your own farms.' });
    }
    // Admins can view any field

    const query = 'SELECT * FROM fields WHERE id = $1 AND farm_id = $2';
    const result = await db.query(query, [fieldIdParam, farmIdParam]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Field not found or does not belong to the specified farm.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching field ${fieldIdParam} for farm ${farmIdParam}:`, error);
    res.status(500).json({ message: 'Internal server error fetching field.' });
  }
});

// TODO: Implement PUT /api/farms/:farmId/fields/:fieldId (Update field) - with auth
// TODO: Implement DELETE /api/farms/:farmId/fields/:fieldId (Delete field)

export default router;
