import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables for authMiddleware.");
  process.exit(1);
}

// Extend Express Request type to include user payload from JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: 'admin' | 'farmer';
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
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ message: 'Forbidden: Token is not valid.' });
    }
    req.user = user as { userId: number; email: string; role: 'admin' | 'farmer' };
    next();
  });
};

// Optional: Middleware to restrict access to certain roles
export const authorizeRole = (allowedRoles: Array<'admin' | 'farmer'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: User role not available.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Role '${req.user.role}' is not authorized for this resource.` });
    }
    next();
  };
};
