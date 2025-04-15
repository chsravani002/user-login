import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon from "argon2";
import Users from "../models/usersmodel";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const router = express.Router();

router.post("/api/v1/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const normalizedEmail = email.toLowerCase();
    const user = await Users.findOne({ email: normalizedEmail });

    if (!user || !(await argon.verify(user.password, password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
