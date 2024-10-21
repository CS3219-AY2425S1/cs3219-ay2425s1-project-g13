import React, { useState, useEffect } from "react";
import { Button, Box, Typography, CircularProgress, Avatar, Container, CssBaseline, Divider } from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import io from "socket.io-client";
import axios from "axios";
import Grid from '@mui/material/Grid2';

const socket = io("http://localhost:8081");

const complexities = ["Easy", "Medium", "Hard"];

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

const sampleQuestions = [
{
    id: 1,
    title: "Reverse a String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.`,
    categories: ["Strings", "Algorithms"],
    complexity: "Easy",
},
{
    id: 2,
    title: "Linked List Cycle Detection",
    description: "Implement a function to detect if a linked list contains a cycle.",
    categories: ["Data Structures", "Algorithms"],
    complexity: "Easy",
},
    // add more ltr ba
];

const MatchComponent = () => {
const [waitingTime, setWaitingTime] = useState(0);
const [isWaiting, setIsWaiting] = useState(false);
const [isCanceling, setIsCanceling] = useState(false);
const [matchedUserId, setMatchedUserId] = useState(null);
const [selectedComplexity, setSelectedComplexity] = useState("Easy");
const [selectedCategory, setSelectedCategory] = useState("Strings");

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
            return 0;
        }
        return prevTime + 1;
        });
    }, 1000);
    } else {
    setWaitingTime(0);
    }

    return () => {
    clearInterval(timer);
    };
}, [isWaiting]);

const getFilteredQuestion = () => {
    if (!selectedComplexity || !selectedCategory) return null;

    return sampleQuestions.find(
    (q) =>
        q.complexity === selectedComplexity &&
        q.categories.includes(selectedCategory)
    );
};

const filteredQuestion = getFilteredQuestion();

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
        complexity: selectedComplexity, 
        category: selectedCategory, 
    };

    await axios.post("http://localhost:8081/match/match-request", body, config);
    } catch (error) {
    console.error("Error requesting match:", error);
    setIsWaiting(false);
    }
};

const cancelMatch = async () => {
    try {
    setIsCanceling(true);
    const token = localStorage.getItem("authorization");

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const body = { socketId: socket.id };

    await axios.post("http://localhost:8081/match/cancel-request", body, config);
    setIsCanceling(false);
    setIsWaiting(false);
    } catch (error) {
    console.error("Error canceling match:", error);
    setIsCanceling(false);
    }
};

return (
    <Container maxWidth="lg">
        <CssBaseline />
        <Grid container spacing={2}>
            {/* Matching options section */}
            <Grid size={6}>
                <Box sx={{ alignItems: 'center', padding: "10px" }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <HowToRegIcon />
                    </Avatar>
                    <Typography variant="h5">User Matching Service</Typography>

                    <Box sx={{ mt: 3}}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Select Complexity
                        </Typography>
                        <Box sx={{ 
                            flexWrap: 'wrap',
                            justifyContent: 'space-around' 
                        }}>
                            {complexities.map((complexity) => (
                                <Button
                                key={complexity}
                                onClick={() => setSelectedComplexity(complexity)}
                                variant={selectedComplexity === complexity ? "contained" : "outlined"}
                                sx={{ margin: "5px" }}
                                >
                                {complexity}
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Select Category
                        </Typography>
                        <Box sx={{ 
                            flexWrap: 'wrap',
                            justifyContent: 'space-around' 
                        }}>
                            {categories.map((category) => (
                                <Button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                variant={selectedCategory === category ? "contained" : "outlined"}
                                sx={{ margin: "5px" }}
                                >
                                {category}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                

                    {isWaiting ? (
                    <>
                        <CircularProgress sx={{ mt: 3 }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Waiting for a match... {waitingTime} seconds
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={cancelMatch}
                            sx={{ mt: 3 }}
                            disabled={isCanceling}
                        >
                        {isCanceling ? "Cancelling..." : "Cancel Match"}
                        </Button>
                    </>
                    ) : matchedUserId ? (
                    <Typography variant="h6" color="green" sx={{ mt: 3 }}>
                        Matched with User ID: {matchedUserId}
                    </Typography>
                    ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={requestMatch}
                        sx={{ mt: 3 }}
                        disabled={isWaiting || isCanceling}
                    >
                        {isWaiting ? "Searching..." : "Find a Match"}
                    </Button>
                    )}
                </Box>
            </Grid>

            {/* Sample questions section */}
            <Grid size={6}>
                <Box sx={{ alignItems: 'center', padding: "10px" }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <QuestionAnswerRoundedIcon />
                    </Avatar>
                    <Typography variant="h5">Sample Questions</Typography>
                    {filteredQuestion ? (
                    <div>
                        <Typography variant="h6">{filteredQuestion.title}</Typography>
                        <Typography>{filteredQuestion.description}</Typography>
                    </div>
                    ) : (
                    <Typography>Select both complexity and category to see a sample question.</Typography>
                    )}
                </Box>
            </Grid>
        </Grid>
    </Container>
);
};

export default MatchComponent;
