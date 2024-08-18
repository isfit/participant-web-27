import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File; // Extend the Request interface to include `file`
  }
}