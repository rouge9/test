// backend/routes/auth.ts
import express, { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();

// Login route
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Invalid username or password");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
  const userWithoutPassword = { ...user.toObject(), password: undefined };
  res.send({ userWithoutPassword, token });
});

// Register route
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(401).send("user Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("error registering user");
  }
});

export default router;
