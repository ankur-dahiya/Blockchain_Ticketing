import express from "express";
import authController from "../controllers/auth.js";
const router = express.Router();

//login
//register
//logout
router.post("/register",authController.register)
router.post("/login",authController.login)

export default router;