import express from "express";

import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { createChannel, receiveMatchResult, receiveCancelResult, receiveDeleteRoomRequest } from "../rabbit/rabbit.js";
import { requestMatch, cancelMatch } from "../controller/match-controller.js"


const router = express.Router();
let matchChannel = null;
let cancelChannel = null;

router.post("/match-request", verifyAccessToken, async (req, res, next) => {
    if (!matchChannel) {
        matchChannel = await createChannel();
        if (matchChannel) {
            receiveMatchResult(matchChannel, req.io);
        } else {
            return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
        }
    }

    await requestMatch(matchChannel)(req, res, next);
});

router.post("/cancel-request", verifyAccessToken, async (req, res, next) => {
    console.log("Received cancel request"); // Log to check if this is reached

    try {
        if (!cancelChannel) {
            cancelChannel = await createChannel();
            if (cancelChannel) {
                receiveCancelResult(cancelChannel, req.io);
            }
            
            return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
        }

        cancelMatch(cancelChannel)(req, res, next);
    } catch (error) {
        console.error("Error handling cancel request:", error);
        return res.status(500).json({ message: "Failed to cancel match. Try again later." });
    }
});



export default router;
