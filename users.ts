import express, { Request, Response } from "express";
import Users from "../models/usersmodel";
import authenticateToken from "../middleware";
import argon from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.get("/api/v1/users", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.find({}, { password: 0 });
    res.status(200).json({ result: users });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/api/v1/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email.toLowerCase();
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await argon.hash(req.body.password);
    const user = new Users({
      name: req.body.name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;