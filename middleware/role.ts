import { Request, Response, NextFunction } from 'express';


export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Requires admin role' });
    }
  };
  
