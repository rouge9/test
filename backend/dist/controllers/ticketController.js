"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicket = exports.getTickets = exports.createTicket = void 0;
const Ticket_1 = __importDefault(require("../models/Ticket"));
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status } = req.body;
    try {
        const ticket = new Ticket_1.default({
            title,
            description,
            status,
            user: req.user.id, // set by auth middleware
        });
        yield ticket.save();
        res.status(201).json(ticket);
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.createTicket = createTicket;
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || "1"); // Default to page 1
    const limit = parseInt(((_b = req.query.limit) === null || _b === void 0 ? void 0 : _b.toString()) || "10"); // Default to 10 items per page
    const skip = (page - 1) * limit;
    try {
        let tickets, totalTickets;
        if (req.user.role === "admin") {
            tickets = yield Ticket_1.default.find()
                .populate("user", "email")
                .sort({ updatedAt: "desc" })
                .skip(skip)
                .limit(limit);
            totalTickets = yield Ticket_1.default.countDocuments();
        }
        else {
            tickets = yield Ticket_1.default.find({ user: req.user.id })
                .sort({ updatedAt: "desc" })
                .skip(skip)
                .limit(limit);
            totalTickets = yield Ticket_1.default.countDocuments({ user: req.user.id });
        }
        res.json({
            tickets,
            totalPages: Math.ceil(totalTickets / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.getTickets = getTickets;
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield Ticket_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!ticket)
            res.status(404).json({ message: "Ticket not found" });
        res.json(ticket);
        return;
    }
    catch (error) {
        res.status(400).json({ message: error });
        return;
    }
});
exports.updateTicket = updateTicket;
