import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded to get JWT_SECRET
const envPath = path.resolve(__dirname, '..', '..', '..', '.env'); // Points to backend-services/.env
dotenv.config({ path: envPath });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FarmCropService FATAL ERROR: JWT_SECRET is not defined. Check .env path and loading.");
  process.exit(1);
}

import { ParamsDictionary } from 'express-serve-static-core';

// Extend Express Request type to include user payload from JWT
// This interface can be shared across services if they are part of a monorepo or via a shared library
export interface AuthenticatedRequest<P extends ParamsDictionary = ParamsDictionary> extends Request<P> {
  user?: {
    userId: number;
    email: string;
    role: 'admin' | 'farmer';
  };
}

export const authenticateToken = <P extends ParamsDictionary>(req: AuthenticatedRequest<P>, res: Response, next: NextFunction) => {
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
      console.error('FarmCropService JWT verification error:', err.message);
      return res.status(403).json({ message: 'Forbidden: Token is not valid.' });
    }
    req.user = user as { userId: number; email: string; role: 'admin' | 'farmer' };
    next();
  });
};

// Middleware to restrict access to certain roles
export const authorizeRole = (allowedRoles: Array<'admin' | 'farmer'>) => {
  return <P extends ParamsDictionary>(req: AuthenticatedRequest<P>, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: User role not available or user not authenticated properly.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Role '${req.user.role}' is not authorized for this resource.` });
    }
    next();
  };
};
