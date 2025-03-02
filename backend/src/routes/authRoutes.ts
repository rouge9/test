import { Router } from "express";
import {
  signup,
  login,
  refreshTokenHandler,
  logout,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

export default router;
