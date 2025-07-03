import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import db from '../db'; // Import the database connection
import { authenticateToken, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware'; // Import auth middleware & authorizeRole

const router: Router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}
const TOKEN_EXPIRATION = '1h'; // Token expires in 1 hour

// Define User type matching database schema
interface User {
  id: number; // Changed from string to number (SERIAL from DB)
  email?: string;
  phone_number?: string;
  password_hash: string; // Matches DB column name
  name: string;
  role: 'admin' | 'farmer';
  created_at: Date; // Matches DB column name
  location_address?: string;
  location_lat?: number;
  location_lon?: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         role:
 *           type: string
 *           enum: [admin, farmer]
 *           description: The role of the user.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created.
 *       example:
 *         id: 1
 *         email: "user@example.com"
 *         name: "John Doe"
 *         role: "farmer"
 *         created_at: "2023-01-01T12:00:00.000Z"
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters).
 *         name:
 *           type: string
 *           description: User's full name.
 *         role:
 *           type: string
 *           enum: [admin, farmer]
 *           description: User's role.
 *       example:
 *         email: "jane.doe@example.com"
 *         password: "securePassword123"
 *         name: "Jane Doe"
 *         role: "admin"
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT token for authentication.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "An error occurred."
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Authentication
 *     description: User authentication and registration
 *   - name: Users
 *     description: User profile management
 */

// POST /api/auth/register - User Registration
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., missing fields, invalid role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/register', async (req: Request, res: Response) => {
  const { email, phone_number, password, name, role, location_address, location_lat, location_lon } = req.body;

  if (!password || !name || !role) {
    return res.status(400).json({ message: 'Password, name, and role are required.' });
  }
  if (!['admin', 'farmer'].includes(role)) {
    return res.status(400).json({ message: "Role must be 'admin' or 'farmer'." });
  }

  if (role === 'admin') {
    if (!email) {
      return res.status(400).json({ message: 'Email is required for admin registration.' });
    }
  } else if (role === 'farmer') {
    if (!phone_number) {
      return res.status(400).json({ message: 'Phone number is required for farmer registration.' });
    }
  }

  try {
    // Check for existing user
    if (role === 'admin') {
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
    } else if (role === 'farmer') {
      const existingUserResult = await db.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ message: 'User with this phone number already exists.' });
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let insertQuery, insertParams;
    if (role === 'admin') {
      insertQuery = `
        INSERT INTO users (email, password_hash, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, role, created_at;
      `;
      insertParams = [email, hashedPassword, name, role];
    } else {
      insertQuery = `
        INSERT INTO users (phone_number, password_hash, name, role, location_address, location_lat, location_lon)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, phone_number, name, role, location_address, location_lat, location_lon, created_at;
      `;
      insertParams = [phone_number, hashedPassword, name, role, location_address, location_lat, location_lon];
    }

    const newUserResult = await db.query(insertQuery, insertParams);
    const newUser = newUserResult.rows[0];

    console.log('Registered new user (DB):', newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login - User Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request (e.g., missing email or password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, phone_number, password } = req.body;

  if ((!email && !phone_number) || !password) {
    return res.status(400).json({ message: 'Email or phone number and password are required.' });
  }

  try {
    let result;
    if (email) {
      result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    } else if (phone_number) {
      result = await db.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    }
    if (!result || result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user: User = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create JWT payload
    const payload: any = {
      userId: user.id,
      role: user.role,
    };
    if (user.email) payload.email = user.email;
    if (user.phone_number) payload.phone_number = user.phone_number;

    // Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    // Exclude password_hash from the user object sent in response
    const { password_hash, ...userResponse } = user;
    res.status(200).json({ message: 'Login successful', user: userResponse, token: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/users/me - Get current authenticated user's profile
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (e.g., token missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    // This case should ideally be caught by authenticateToken, but as a safeguard:
    return res.status(401).json({ message: 'Unauthorized: User data not found in token.' });
  }

  const userId = req.user.userId;

  try {
    const result = await db.query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userProfile: Omit<User, 'password_hash'> = result.rows[0];
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile for /users/me:', error);
    res.status(500).json({ message: 'Internal server error while fetching user profile.' });
  }
});

// GET /api/users - List all users (admin only), optionally filter by role
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, farmer]
 *         description: Optional role to filter users by.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Internal server error
 */
router.get('/users', authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const roleFilter = req.query.role as string | undefined;

  try {
    let queryText = 'SELECT id, email, phone_number, name, role, location_address, location_lat, location_lon, created_at FROM users';
    const queryParams: any[] = [];

    if (roleFilter) {
      if (roleFilter !== 'admin' && roleFilter !== 'farmer') {
        return res.status(400).json({ message: "Invalid role filter. Must be 'admin' or 'farmer'." });
      }
      queryText += ' WHERE role = $1';
      queryParams.push(roleFilter);
    }
    queryText += ' ORDER BY name ASC';

    const result = await db.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error fetching users.' });
  }
});

export default router;
