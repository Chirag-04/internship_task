import express from "express"
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose"
const port =  3000
const app = express();
dotenv.config();
const COINGECKO_API_KEY =  process.env.COINGECKO_API_KEY;

const MONGO_URI  = process.env.MONGO_URI;


// connect to schema
mongoose.connect(MONGO_URI)

// define schema 
const cryptoSchema = new mongoose.Schema({
    name : String,
    price : Number,
    market_cap : Number,
    change_24h : Number,
    last_updated : {type : Date, default : Date.now},
})

// create models 
const Crypto =  mongoose.model("Crypto", cryptoSchema);

// creating API
app.use(express.json());

app.get('/' , async(req,res)=>{
    try{
        const id =  req.query.id;
        if(!id){
            res.status(400).json({
                msg : "Check ids once again"
            })
        }
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`);

        if(!response.ok){
            return res.status(400).json({
                msg : "Failed to fetch data"
            })
        }

        const data = await response.json();

        // const data = {
        //     bitcoin: { usd: 45000, market_cap: 840000000000, usd_24h: -3 },
        const values =  data[id];
        console.log("values" , values);
        const cryptoData = {
            name: id,
            price: values.usd, 
            market_cap: values.usd_market_cap, 
            change_24h: values.usd_24h_change,
            last_updated: new Date(), 
          };


        // save to momgodb

        await Crypto.findOneAndUpdate(
            {name : id},
            cryptoData,
            {upsert : true , new:true}
        )
        res.json(data);
    }catch(err){
        console.log(err)  
        res.status(500).json("internal server error")
    }
})

// api :2 
app.get('/stats', async(req, res)=>{

    const coin = req.query.coin;
    try{
        const response = await Crypto.findOne(
            {name : coin}
        )
        if(!response){
            res.status(400).json({
                msg : "Error in fetching stats"
            })
        }
        console.log(response);
        res.json({
            price: response.price,
	      marketCap: response.market_cap,
	        "24hChange": response.change_24h
        });
    }catch(err){
        console.log("error is stats api" , err);
        res.status(500).json({msg : "Internal server error"});
    }
})



app.listen(port , ()=>{
    console.log(`Server is running at ${port}`);
})
