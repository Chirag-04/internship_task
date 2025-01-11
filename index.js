import express from "express";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import cryptoRouter from "./router/crypto.route.js";
import connectDB from "./db/connection.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Crypto API!",
    guide: [
      {
        endpoint: "GET /api",
        description: "Fetches detailed data for a specific cryptocurrency.",
        example: "/api/?id=bitcoin",
      },
      {
        endpoint: "GET /api/stats",
        description: "Provides statistical data for a specific cryptocurrency.",
        example: "/api/stats?coin=bitcoin",
      },
      {
        endpoint: "GET /api/deviation",
        description: "Calculates and returns the price deviation for a specific cryptocurrency.",
        example: "/api/deviation?coin=bitcoin",
      },
    ],
  });
});



app.use('/api',cryptoRouter );

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
