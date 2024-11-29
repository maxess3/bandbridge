import { Router, Request, Response } from "express";
import { deleteUser, fetchUsers, showUser } from "../Controller/UserController";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  fetchUsers(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  showUser(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;
