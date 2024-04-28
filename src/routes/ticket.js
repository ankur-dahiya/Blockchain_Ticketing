import express from "express";
import ticketController from "../controllers/ticket.js";
import passport from "passport";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

//purchase ticket
// transfer ticket
// create ticket by vendors
router.post("/create",passport.authenticate('jwt'),upload.single("ticketImage"),ticketController.createTicket);
router.post("/buy",passport.authenticate('jwt'),ticketController.purchaseTicket);

export default router;