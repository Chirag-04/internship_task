import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: [Number], required: true, default: [] },
  market_cap: { type: Number, required: true },
  change_24h: { type: Number, required: true },
});

export default mongoose.model("Crypto", cryptoSchema);
