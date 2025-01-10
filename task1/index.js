import express from "express"
import dotenv from "dotenv";
const port =  3000
const app = express();
dotenv.config();

const COINGECKO_API_KEY =  process.env.COINGECKO_API_KEY;

app.use(express.json());

app.get('/' , async(req,res)=>{
    try{
        const ids =  req.query.ids;
        const vs_currencies = req.query.vs_currencies;
        if(!ids || !vs_currencies){
            res.status(400).json({
                msg : "Check ids and vs_currencies once again"
            })
        }
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_market_cap=true&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`);

        if(!response.ok){
            return res.status(400).json({
                msg : "Failed to fetch data"
            })
        }

        const data = await response.json();
        res.json(data);
    }catch(err){
        console.log(err)  
        res.status(500).json("internal server error")
    }
})

app.listen(port , ()=>{
    console.log(`Server is running at ${port}`);
})
