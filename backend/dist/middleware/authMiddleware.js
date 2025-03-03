"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../../.env" });
const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded);
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
        return;
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied, admin only" });
        return;
    }
};
exports.adminOnly = adminOnly;
