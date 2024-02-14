import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await UserModel.findById(decoded.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Require Admin Role!' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};
