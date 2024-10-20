import React, { useState, useEffect } from "react";
import { Button, Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8081");

const MatchComponent = () => {
    const [waitingTime, setWaitingTime] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false); // Track canceling state
    const [matchedUserId, setMatchedUserId] = useState(null);
    const [complexity, setComplexity] = useState("medium"); // State for complexity
    const [category, setCategory] = useState("Algorithms"); // State for category

    const categories = [
        'Strings', 
        'Algorithms', 
        'Data Structures', 
        'Bit Manipulation', 
        'Recursion', 
        'Databases', 
        'Brainteaser', 
        'Arrays'
    ];

    useEffect(() => {
        let timer;
        socket.on("connect", (data) => {
            console.log("data: ", data);
        });

        socket.on("match_found", (data) => {
            setMatchedUserId(data.matchedUser.id);
            setIsWaiting(false);
        });

        if (isWaiting) {
            timer = setInterval(() => {
                setWaitingTime((prevTime) => {
                    if (prevTime + 1 === 30) {
                        setIsWaiting(false);
                        cancelMatch();
                        return 0; // Reset waiting time
                    }
                    return prevTime + 1; // Increment waiting time
                });
            }, 1000);
        } else {
            setWaitingTime(0);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isWaiting]);

    const requestMatch = async () => {
        try {
            setIsWaiting(true);
            setMatchedUserId(null);
            const token = localStorage.getItem("authorization");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const body = {
                socketId: socket.id,
                complexity: complexity, 
                category: category, 
            };

            await axios.post("http://localhost:8081/match/match-request", body, config);
        } catch (error) {
            console.error("Error requesting match:", error);
            setIsWaiting(false);
        }
    };

    const cancelMatch = async () => {
        try {
            setIsCanceling(true); // Disable the UI during cancellation
            const token = localStorage.getItem("authorization");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const body = { socketId: socket.id };

            await axios.post("http://localhost:8081/match/cancel-request", body, config);
            setIsCanceling(false); // Enable UI once cancellation is done
            setIsWaiting(false);
        } catch (error) {
            console.error("Error canceling match:", error);
            setIsCanceling(false); // Enable UI even if an error occurs
        }
    };

    return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4">User Matching Service</Typography>
            <FormControl sx={{ minWidth: 120, mt: 2 }}>
                <InputLabel id="complexity-label">Complexity</InputLabel>
                <Select
                    labelId="complexity-label"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                </Select>
            </FormControl>

            {/* Category Selection */}
            <FormControl sx={{ minWidth: 200, mt: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {isWaiting ? (
                <Box>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Waiting for a match... {waitingTime} seconds
                    </Typography>
                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={cancelMatch} disabled={isCanceling}>
                        {isCanceling ? "Cancelling..." : "Cancel Match"}
                    </Button>
                </Box>
            ) : matchedUserId ? (
                <Typography variant="h6" color="green">
                    Matched with User ID: {matchedUserId}
                </Typography>
            ) : (
                <Typography variant="h6">Click to start searching for a match!</Typography>
            )}

            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={requestMatch} disabled={isWaiting || isCanceling}>
                {isWaiting ? "Searching..." : "Find a Match"}
            </Button>
        </Box>
    );
};

export default MatchComponent;
