import { Router } from "express";
import {
  deleteUser,
  fetchUsers,
  showUser,
} from "../Controller/UserController.js";

const router = Router();

router.get("/", fetchUsers);
router.get("/:id", showUser);
router.delete("/:id", deleteUser);

export default router;
