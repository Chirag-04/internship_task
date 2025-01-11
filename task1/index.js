import express from "express";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
const port = 3000;
const app = express();
dotenv.config();
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

const MONGO_URI = process.env.MONGO_URI;

// connect to schema
mongoose.connect(MONGO_URI);

// define schema
const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: [Number], required: true, default: [] },
  market_cap: { type: Number, required: true },
  change_24h: { type: Number, required: true },
});

// create models
const Crypto = mongoose.model("Crypto", cryptoSchema);

// creating API
app.use(express.json());


//fucntion to return standar deviation
function findStandardDeviation(arr) {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
      sum += arr[i];
  }
  const mean = sum / n;
  let variance = 0;
  for (let i = 0; i < n; i++) {
      variance += Math.pow(arr[i] - mean, 2);
  }
  const standardDeviation = Math.sqrt(variance / n);
  return standardDeviation;
}

app.get("/", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      res.status(400).json({
        msg: "Check ids once again",
      });
    }
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );

    if (!response.ok) {
      return res.status(400).json({
        msg: "Failed to fetch data",
      });
    }

    const data = await response.json();
    const values = data[id];
    console.log("values", values);

    // if exact entry is found we need to return the same and dont change anything

    const existingDoc = await Crypto.findOne({ name: id });

    if (existingDoc) {
      console.log("existing doc", existingDoc);

      const priceArray = existingDoc.price;
      const newPrice = values.usd;
      const isPresent = priceArray.some((price) => price === newPrice);
      
      existingDoc.market_cap = values.usd_market_cap;
      existingDoc.change_24h = values.usd_24h_change;
      if (!isPresent) existingDoc.price.push(values.usd);

      await existingDoc.save();
      console.log("Updated Data:", existingDoc);
      return res.status(200).json(data);
    } else {
      console.log("No document found, creating new document...");
      const newData = new Crypto({
        name: id,
        market_cap: values.usd_market_cap,
        change_24h: values.usd_24h_change,
        price: [values.usd],
      });

      await newData.save();
      console.log("New Data saved:", newData);
    }

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

// api :2
app.get("/stats", async (req, res) => {
  const coin = req.query.coin;
  try {
    const response = await Crypto.findOne({ name: coin });
    if (!response) {
      res.status(400).json({
        msg: "Error in fetching stats",
      });
    }
    console.log(response);

    const coinData = {
      price: response.price[response.price.length - 1],
      market_cap: response.market_cap,
      change_24h: response.change_24h,
    };
    res.json({
      coinData,
    });
  } catch (err) {
    console.log("error is stats api", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get('/deviation', async (req, res) => {
  const coin = req.query.coin;
  try {
    const response = await Crypto.findOne({ name: coin });
    if (!response) return res.status(400).json({msg: "Coin does not exist"});

    let priceArray = response.price;
    let n = priceArray.length;

    if (n < 100) {
      const val = findStandardDeviation(priceArray, n);
      console.log(val);
      return res.json({ deviation: val });
    } else {
      let newArray = priceArray.slice(-100);  // slice the last 100 prices
      const val = findStandardDeviation(newArray, 100);
      console.log(val);
      return res.json({ deviation: val });
    }
  } catch (err) {
    console.log("Error in deviation API", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
