import type { Response } from "express";
import type { AuthRequest } from "../types";
export declare const createDomain: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDomains: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifyDomain: (req: AuthRequest, res: Response) => Promise<void>;
export declare const setDefaultDomain: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteDomain: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=domain.controller.d.ts.map