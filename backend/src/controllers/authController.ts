import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// In-memory store for refresh tokens (for demo purposes only)
const refreshTokens: string[] = [];

const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "15m", // Shorter lifespan for access tokens
  });
};

const generateRefreshToken = (user: IUser) => {
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  refreshTokens.push(refreshToken);
  return refreshToken;
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const user = new User({ email, password, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const userRole = user.role;
    res.status(201).json({ accessToken, refreshToken, userRole });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const refreshTokenHandler = (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    // Optionally, you can remove the old refresh token and issue a new one (token rotation)
    const user = decoded as IUser;
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Optionally, you can implement a logout to remove refresh tokens
export const logout = (req: Request, res: Response) => {
  const { token } = req.body;
  const index = refreshTokens.indexOf(token);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }
  res.status(204).send();
};
