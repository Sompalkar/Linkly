import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types";
declare const developmentMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default developmentMiddleware;
//# sourceMappingURL=development.middleware.d.ts.map