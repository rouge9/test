import express, { Response, Request } from "express";
import {
  getVechiles,
  createVechile,
  updateVechile,
  deletevechile,
  searchVechile,
} from "../controller/vechiles";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/:userId", authMiddleware, getVechiles);

router.post("/", authMiddleware, createVechile);

router.put("/:id", authMiddleware, updateVechile);

router.delete("/:id", authMiddleware, deletevechile);

router.post("/:userId/search", authMiddleware, searchVechile);

export default router;
