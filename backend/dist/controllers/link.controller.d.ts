import type { Response } from "express";
import type { AuthRequest } from "../types";
export declare const createLink: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createBulkLinks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLinks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLinkById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateLink: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteLink: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTags: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=link.controller.d.ts.map