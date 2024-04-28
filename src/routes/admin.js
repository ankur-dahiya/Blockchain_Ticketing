import express from "express";
import adminControllers from "../controllers/admin.js";
import passport from "passport";
import { isAdmin } from "../middleware/adminCheck.js";
const router = express.Router();

router.use(passport.authenticate('jwt'),isAdmin);

router.get("/users",adminControllers.getAllUsers);
router.get("/orders",adminControllers.getAllOrders);
router.get("/tickets",adminControllers.getAllTickets);

export default router;