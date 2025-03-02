import { Router } from "express";
import {
  createTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticketController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.put("/:id", protect, adminOnly, updateTicket);

export default router;
