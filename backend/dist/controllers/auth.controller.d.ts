import type { Response } from "express";
import type { AuthRequest } from "../types";
export declare const register: (req: AuthRequest, res: Response) => Promise<void>;
export declare const login: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map