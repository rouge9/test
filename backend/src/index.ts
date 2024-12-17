import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import dotenv from "dotenv";
import vechilesRoute from "./routes/vechiles";
import auth from "./routes/auth";
import path from "path";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/vehicles", vechilesRoute);
app.use("/api", auth);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
