import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("DeviceService FATAL ERROR: JWT_SECRET is not defined. Check .env path and loading.");
  process.exit(1);
}

// Extend Express Request type to include user payload from JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: 'admin' | 'farmer'; // Ensure this matches roles in your User service JWT
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
      }
      console.error('DeviceService JWT verification error:', err.message);
      return res.status(403).json({ message: 'Forbidden: Token is not valid.' });
    }
    // Ensure the payload structure matches what User Service puts in the token
    req.user = user as { userId: number; email: string; role: 'admin' | 'farmer' };
    next();
  });
};

// Middleware to restrict access to certain roles
export const authorizeRole = (allowedRoles: Array<'admin' | 'farmer'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      // This should ideally be caught by authenticateToken if user is not populated
      return res.status(403).json({ message: 'Forbidden: User role not available or user not authenticated properly.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Role '${req.user.role}' is not authorized for this resource.` });
    }
    next();
  };
};
