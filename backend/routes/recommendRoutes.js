import express from "express";
import {getRecommendations , getItinerary} from "../controllers/getRecommendations.js";

const router = express.Router();


router.post("/", getRecommendations);
router.post("/itinerary" , getItinerary )

export default router;
