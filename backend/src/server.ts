import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import "express-async-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

dotenv.config({ path: "../.env" });
connectDB();

const app = express();
app.use(
  cors({
    origin: "https://test-gu6z.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

// Session middleware setup
// app.use(
//   session({
//     secret: process.env.JWT_SECRET!, // or use a separate secret for sessions
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI!,
//       collectionName: "sessions",
//     }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day (adjust as needed)
//     },
//   })
// );

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
