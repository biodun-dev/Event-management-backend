// types/custom.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Use a more specific type if possible, e.g., UserDocument from Mongoose
  }
}
