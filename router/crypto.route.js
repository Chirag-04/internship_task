import express from "express"
import { getCryptoData, getDeviation, getStats } from "../controller/crypto.controller.js";
const router =  express.Router();


router.get("/", getCryptoData);
router.get("/stats", getStats);
router.get("/deviation", getDeviation);


export default router;