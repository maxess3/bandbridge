import { Router, Request, Response } from "express";
import { deleteUser, fetchUsers, showUser } from "../Controller/UserController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await fetchUsers(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await showUser(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await deleteUser(req, res);
});

export default router;
