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
exports.logout = exports.refreshTokenHandler = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../../.env" });
// In-memory store for refresh tokens (for demo purposes only)
const refreshTokens = [];
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "15m", // Shorter lifespan for access tokens
    });
};
const generateRefreshToken = (user) => {
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const user = new user_1.default({ email, password, role });
        yield user.save();
        res.status(201).json({ message: "User created" });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const userRole = user.role;
        res.status(201).json({ accessToken, refreshToken, userRole });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.login = login;
const refreshTokenHandler = (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        // Optionally, you can remove the old refresh token and issue a new one (token rotation)
        const user = decoded;
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
};
exports.refreshTokenHandler = refreshTokenHandler;
// Optionally, you can implement a logout to remove refresh tokens
const logout = (req, res) => {
    const { token } = req.body;
    const index = refreshTokens.indexOf(token);
    if (index > -1) {
        refreshTokens.splice(index, 1);
    }
    res.status(204).send();
};
exports.logout = logout;
