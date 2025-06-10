import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types";
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map