import { Router, Request, Response } from "express";
import {
  deleteUser,
  fetchUsers,
  showUserProfile,
} from "../Controller/UserController";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  fetchUsers(req, res);
});

router.get("/me", (req: Request, res: Response) => {
  showUserProfile(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;
