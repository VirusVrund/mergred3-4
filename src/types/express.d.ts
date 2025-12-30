import { Request } from 'express';
import { AuthContext } from './auth';

declare module 'express-serve-static-core' {
    interface Request {
        auth?: AuthContext;
    }
}

declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        permissions: string[];
        
      };
    }
  }
}

export {};