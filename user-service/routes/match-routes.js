import express from "express";

import { verifyAccessToken } from "../middleware/basic-access-control.js";
import { createChannel, receiveMatchResult, receiveCancelResult } from "../rabbit/rabbit.js";
import { requestMatch, cancelMatch } from "../controller/match-controller.js"


const router = express.Router();
let channel = null;

router.post("/match-request", verifyAccessToken, async (req, res, next) => {
    if (!channel) {
        channel = await createChannel();
        if (channel) {
            console.log("here are the io: ", req.io)
            receiveMatchResult(channel, req.io);
        } else {
            return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
        }
    }

    await requestMatch(channel)(req, res, next);
});

router.post("/cancel-request", verifyAccessToken, async (req, res, next) => {
    console.log("Received cancel request"); // Log to check if this is reached

    try {
        if (!channel) {
            channel = await createChannel();
            if (!channel) {
                return res.status(500).json({ message: "RabbitMQ connection issue. Try again later." });
            }
        }

        const result = await cancelMatch(channel)(req, res, next);
        // console.log(result)
        // return res.status(200).json(result);
    } catch (error) {
        console.error("Error handling cancel request:", error);
        return res.status(500).json({ message: "Failed to cancel match. Try again later." });
    }
});



export default router;
