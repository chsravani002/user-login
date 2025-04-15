import express, { Request, Response } from "express";
import Todos from "../models/todosmodel";
import authenticateToken from "../middleware";

const router = express.Router();

router.get(
  "/api/v1/todos",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Decoded user:", req.user);
      const todos = await Todos.find({ user_id: req.user!.userId });
      res.json({ result: todos });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.post(
  "/api/v1/todos",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      let { task, iscompleted = false } = req.body;

      if (typeof task !== "string" || !task.trim()) {
        res.status(400).json({ message: "Task must be a non-empty string" });
        return;
      }

      if (typeof iscompleted !== "boolean") {
        res.status(400).json({ message: "iscompleted must be a boolean" });
        return;
      }

      const todo = new Todos({
        user_id: req.user!.userId,
        task: task.trim(),
        iscompleted,
      });

      const result = await todo.save();
      res.status(201).json({ message: "Todo created", result });
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.put(
  "/api/v1/todos/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await Todos.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!result) {
        res.status(404).json({ message: "Todo not found" });
        return;
      }
      res.json({ message: "Todo updated", result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

router.delete(
  "/api/v1/todos/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await Todos.deleteOne({ _id: req.params.id });
      res.json({ message: "Todo deleted", result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

export default router;
