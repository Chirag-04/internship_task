import express from "express";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import cryptoRouter from "./router/crypto.route.js";
import connectDB from "./db/connection.js";


dotenv.config();
const app = express();
const port = 3000;
// const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

app.use(express.json());
connectDB();

app.use('/api',cryptoRouter );

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
