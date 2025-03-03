"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, ticketController_1.createTicket);
router.get("/", authMiddleware_1.protect, ticketController_1.getTickets);
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, ticketController_1.updateTicket);
exports.default = router;
