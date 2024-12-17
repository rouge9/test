import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import dotenv from "dotenv";
import vechilesRoute from "./routes/vechiles";
import auth from "./routes/auth";
import path from "path";
dotenv.config({ path: "../.env" });

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
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
    app.listen(PORT, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
