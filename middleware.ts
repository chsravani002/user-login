import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { userId: string };
    }
  }
}

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token not found" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    req.user = decoded as JwtPayload & { userId: string };
    next();
  });
}

export default authenticateToken;

