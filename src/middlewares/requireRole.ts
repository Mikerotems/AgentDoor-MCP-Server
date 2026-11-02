import { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const roles =
      (req.user as any)?.realm_access?.roles || [];

    if (!roles.includes(role)) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    next();
  };
}