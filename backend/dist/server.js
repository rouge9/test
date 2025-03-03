"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: "../.env" });
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
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
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tickets", ticketRoutes_1.default);
// Global error handler
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
