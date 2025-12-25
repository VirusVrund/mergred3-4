import { Request } from 'express';
import { AuthContext } from './auth';

declare module 'express-serve-static-core' {
    interface Request {
        auth?: AuthContext;
    }
}
