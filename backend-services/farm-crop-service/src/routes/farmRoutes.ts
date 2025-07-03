import express, { Router, Request } from 'express'; // Added Request for explicit typing
import db from '../db';
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Define Farm type
interface Farm {
  id: number;
  name: string;
  farmer_id: number;
  address_text?: string | null;
  location_point_geojson?: any | null; // GeoJSON Point
  boundary_geojson?: any | null;      // GeoJSON Polygon/MultiPolygon
  created_at: Date;
  updated_at: Date;
}

// POST /api/farms - Create a new farm
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const authenticatedUser = req.user;
  let { name, farmer_id, address_text, location_point_geojson, boundary_geojson } = req.body;

  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // If farmer is creating, farmer_id must match their own ID or be an admin.
  // If farmer_id is not provided in body by a farmer, use their own ID.
  if (authenticatedUser.role === 'farmer') {
    if (farmer_id !== undefined && farmer_id !== authenticatedUser.userId) {
      return res.status(403).json({ message: 'Forbidden: Farmers can only create farms for themselves.' });
    }
    farmer_id = authenticatedUser.userId; // Ensure farmer creates for self
  } else if (authenticatedUser.role === 'admin') {
    if (farmer_id === undefined) {
      return res.status(400).json({ message: 'Admin must specify farmer_id when creating a farm.' });
    }
  } else {
    return res.status(403).json({ message: 'Forbidden: Role not recognized.' });
  }

  if (!name) { // farmer_id is now guaranteed to be set or validated
    return res.status(400).json({ message: 'Farm name is required.' });
  }

  try {
    const query = `
      INSERT INTO farms (name, farmer_id, address_text, location_point_geojson, boundary_geojson)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await db.query(query, [name, farmer_id, address_text, location_point_geojson, boundary_geojson]);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating farm:', error);
    if (error.code === '23503') { // Foreign key violation (e.g., farmer_id doesn't exist)
        return res.status(400).json({ message: `Invalid farmer_id: ${farmer_id}. User does not exist.` });
    }
    res.status(500).json({ message: 'Internal server error creating farm.' });
  }
});

// GET /api/farms - Get all farms (admin) or own farms (farmer)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const authenticatedUser = req.user;
  const farmerIdQuery = req.query.farmerId as string | undefined;

  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    let query = 'SELECT * FROM farms';
    const params: any[] = [];
    let conditions: string[] = [];

    if (authenticatedUser.role === 'farmer') {
      conditions.push(`farmer_id = $${params.length + 1}`);
      params.push(authenticatedUser.userId);
      // Farmer can optionally query their own farms if they provide their ID, but it's redundant.
      // If farmerIdQuery is provided by a farmer, it MUST match their own ID.
      if (farmerIdQuery && parseInt(farmerIdQuery, 10) !== authenticatedUser.userId) {
        return res.status(403).json({ message: "Forbidden: Farmers can only view their own farms." });
      }
    } else if (authenticatedUser.role === 'admin') {
      if (farmerIdQuery) {
        conditions.push(`farmer_id = $${params.length + 1}`);
        params.push(parseInt(farmerIdQuery, 10));
      }
    } else {
       return res.status(403).json({ message: 'Forbidden: Role not recognized.' });
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ message: 'Internal server error fetching farms.' });
  }
});

// GET /api/farms/:id - Get a single farm
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const authenticatedUser = req.user;
  const farmIdParam = parseInt(req.params.id, 10);

  if (isNaN(farmIdParam)) {
    return res.status(400).json({ message: 'Invalid farm ID.' });
  }
  if (!authenticatedUser) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const result = await db.query('SELECT * FROM farms WHERE id = $1', [farmIdParam]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Farm not found.' });
    }

    const farm = result.rows[0];
    if (authenticatedUser.role === 'farmer' && farm.farmer_id !== authenticatedUser.userId) {
      return res.status(403).json({ message: 'Forbidden: You can only view your own farms.' });
    }

    res.status(200).json(farm);
  } catch (error) {
    console.error(`Error fetching farm ${farmIdParam}:`, error);
    res.status(500).json({ message: 'Internal server error fetching farm.' });
  }
});

// TODO: Implement PUT /api/farms/:id (Update farm) - with auth
// TODO: Implement DELETE /api/farms/:id (Delete farm) - with auth

export { router as farmRoutes };
