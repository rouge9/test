import { Vehicle } from "../models/vechile";
import { Request, Response } from "express";

const getVechiles = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req?.query?.page?.toString()) : 1; // Default to page 1
  const limit = req.query.limit ? parseInt(req?.query?.limit?.toString()) : 10; // Default to 10 items per page
  const userId = req.params.userId;
  const skip = (page - 1) * limit;

  try {
    const vehicles = await Vehicle.find({ userId })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit);
    const totalVehicles = await Vehicle.countDocuments({ userId });
    res.json({
      vehicles,
      totalPages: Math.ceil(totalVehicles / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createVechile = async (req: Request, res: Response) => {
  const { name, status, userId } = req.body;
  const newVehicle = new Vehicle({ name, status, userId });
  await newVehicle.save();
  res.status(201).json(newVehicle);
};

const updateVechile = async (req: Request, res: Response) => {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedVehicle);
};

const deletevechile = async (req: Request, res: Response) => {
  const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
  res.json(deletedVehicle);
};

const searchVechile = async (req: Request, res: Response) => {
  const query = req.body.q;
  const userId = req.params.userId;
  const vehicles = await Vehicle.find({
    userId,
    name: { $regex: query, $options: "i" },
  });
  res.json(vehicles);
};

export {
  getVechiles,
  createVechile,
  updateVechile,
  deletevechile,
  searchVechile,
};
