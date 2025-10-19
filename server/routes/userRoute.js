import express from "express";
import { getUser } from "../controllers/userController.js"; // adjust import if different

const router = express.Router();

// Get all users
router.get("/get-user", getUser);

// Get single user by id
router.get("/get-user/:id", getUser);

export default router;

