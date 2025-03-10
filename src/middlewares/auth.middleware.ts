import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
