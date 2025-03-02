import { Request, Response } from "express";
import Ticket from "../models/Ticket";

export const createTicket = async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  try {
    const ticket = new Ticket({
      title,
      description,
      status,
      user: req.user.id, // set by auth middleware
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page?.toString() || "1"); // Default to page 1
  const limit = parseInt(req.query.limit?.toString() || "10"); // Default to 10 items per page
  const skip = (page - 1) * limit;

  try {
    let tickets, totalTickets;
    if (req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("user", "email")
        .sort({ updatedAt: "desc" })
        .skip(skip)
        .limit(limit);
      totalTickets = await Ticket.countDocuments();
    } else {
      tickets = await Ticket.find({ user: req.user.id })
        .sort({ updatedAt: "desc" })
        .skip(skip)
        .limit(limit);
      totalTickets = await Ticket.countDocuments({ user: req.user.id });
    }
    res.json({
      tickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ticket) res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
    return;
  } catch (error) {
    res.status(400).json({ message: error });
    return;
  }
};
