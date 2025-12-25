import type { Multer } from "multer";

export interface CreateProjectDTO {
  title: string;
  description: string;
  createdBy: string;
}

export interface AuthContext {
  roles: string[];
  owner: string;
}

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      auth?: AuthContext;
    }
  }
}
