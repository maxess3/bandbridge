import { Router } from "express";
import { deleteUser, fetchUsers } from "../controllers/UserController";

const router = Router();

router.get("/", fetchUsers);
router.delete("/:id", deleteUser);

export default router;
