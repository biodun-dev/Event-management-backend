import { Request, Response, NextFunction } from 'express';


export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Assuming you store the user's role in req.user.role after authentication
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Requires admin role' });
    }
  };
  
