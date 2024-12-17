// backend/middleware/auth.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};
