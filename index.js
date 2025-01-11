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

app.use("/", (req, res) => {
  res.json({
    message: "Welcome to the Crypto API!",
    guide: {
      "GET /": "Lists all available API endpoints and their descriptions.",
      "GET /stats": "Fetches statistical data about cryptocurrencies, including aggregated metrics.",
      "GET /deviation": "Calculates and provides the price deviation of cryptocurrencies over a specific period.",
    },
  });
});


app.use('/api',cryptoRouter );

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
