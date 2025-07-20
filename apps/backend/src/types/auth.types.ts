// src/types/auth.types.ts
import { Request } from "express";

export interface User {
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
