import type { Multer } from "multer";
export interface CreateProjectDTO {
  title: string;
  description: string;
  createdBy: string;
}


declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}
