import express from "express";
import passport from "passport";
import userController from "../controllers/user.js";

const router = express.Router();

router.post("/check",passport.authenticate("jwt"));
router.get("/orders",passport.authenticate("jwt"),userController.getUserOrders);

export default router;