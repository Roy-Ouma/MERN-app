import express from "express";
import { googleSignUp, googleSignIn, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/google-signup", googleSignUp);
router.post("/google", googleSignIn);
router.post("/signup", signup);

export default router;

