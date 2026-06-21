import { AuthUser } from "../infrastructure/auth/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}
