import { Router } from "express";
import {
    createUser,
    deleteUser,
    fetchUsers
} from "../Controller/UserController.js";

const router = Router();

router.post("/", createUser);
router.get("/", fetchUsers);

export default router;
