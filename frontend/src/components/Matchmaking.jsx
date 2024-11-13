import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Avatar,
    Container,
    CssBaseline,
    Backdrop,
    Paper,
    AppBar,
    Toolbar,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import io from "socket.io-client";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import { COMPLEXITIES, CATEGORIES, SAMPLE_QUESTIONS } from "../constants";

const socket = io(import.meta.env.VITE_USER_URL);

const MatchComponent = () => {
    const [waitingTime, setWaitingTime] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [matchedUserId, setMatchedUserId] = useState(null);
    const [matchedRoomId, setMatchedRoomId] = useState(null);
    const [matchedQuestion, setMatchedQuestion] = useState(null);
    const [selectedComplexity, setSelectedComplexity] = useState("Easy");
    const [selectedCategory, setSelectedCategory] = useState("Strings");
    const [showMatchedMessage, setShowMatchedMessage] = useState(false);

    const complexities = COMPLEXITIES;
    const categories = CATEGORIES;
    const sampleQuestions = SAMPLE_QUESTIONS;

    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        socket.on("connect", (data) => {
            console.log("data: ", data);
        });

        socket.on("match_found", (data) => {
            console.log("match data: ", data)
            setMatchedUserId(data.matchedUser.id);
            setMatchedRoomId(data.roomId);
            setMatchedQuestion(data.question);
            setIsWaiting(false);
            console.log(data);
        });

        socket.on("cancel_success", () => {
            setIsCanceling(false);
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

        if (matchedUserId && matchedQuestion) {
            setShowMatchedMessage(true);
            const timer = setTimeout(() => {
                navigate(`/collab/${matchedRoomId}`, { state: { question: matchedQuestion } }); // Navigate to '/collab' after 3 seconds
            }, 3000); // 3000ms = 3 seconds

            // Clean up the timer if the component unmounts
            return () => clearTimeout(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isWaiting, matchedUserId]);

    const getFilteredQuestion = () => {
        if (!selectedComplexity || !selectedCategory) return null;
        return sampleQuestions.find((q) => q.complexity === selectedComplexity && q.categories.includes(selectedCategory));
    };

    const filteredQuestion = getFilteredQuestion();

    const requestMatch = async () => {
        try {
            setIsWaiting(true);
            setMatchedUserId(null);
            const token = sessionStorage.getItem("authorization");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const body = {
                socketId: socket.id,
                complexity: selectedComplexity,
                category: selectedCategory,
            };

            await axios.post(`${import.meta.env.VITE_USER_URL}/match/match-request`, body, config);
        } catch (error) {
            console.error("Error requesting match:", error);
            setIsWaiting(false);
        }
    };

    const cancelMatch = async () => {
        try {
            setIsCanceling(true);
            const token = sessionStorage.getItem("authorization");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const body = { socketId: socket.id };

            await axios.post(`${import.meta.env.VITE_USER_URL}/match/cancel-request`, body, config);
        } catch (error) {
            console.error("Error canceling match:", error);
            setIsCanceling(false);
        }
    };

    const paperStyles = {
        padding: "20px 40px",
        borderRadius: "8px",
        textAlign: "center",
    };

    return (
        <>
            <Container maxWidth="lg">
                {matchedUserId && (
                    <Backdrop open={showMatchedMessage} style={{ zIndex: 1300 }} transitionDuration={500}>
                        <Paper style={paperStyles}>
                            <Typography variant="h6" align="center">
                                Matched! Redirecting to collaborative space...
                            </Typography>
                        </Paper>
                    </Backdrop>
                )}
                <CssBaseline />
                <Grid container spacing={2}>
                    {/* Matching options section */}
                    <Grid size={6}>
                        <Box sx={{ alignItems: "center", padding: "10px" }}>
                            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                                <HowToRegIcon />
                            </Avatar>
                            <Typography variant="h5">User Matching Service</Typography>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Select Complexity
                                </Typography>
                                <Box sx={{ flexWrap: "wrap", justifyContent: "space-around" }}>
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
                                <Box sx={{ flexWrap: "wrap", justifyContent: "space-around" }}>
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
                </Grid>
                {/* Sample questions section */}
                <Grid size={6}>
                    <Box sx={{ alignItems: "center", padding: "10px" }}>
                        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                            <QuestionAnswerRoundedIcon />
                        </Avatar>
                        <Typography variant="h5">Sample Questions</Typography>
                        {filteredQuestion ? (
                            <Box sx={{ bgcolor: '#f5f5f5' }}>
                                <Typography variant="h6">{filteredQuestion.title}</Typography>
                                <Typography>{filteredQuestion.description}</Typography>
                            </Box>
                        ) : (
                            <Typography>Select both complexity and category to see a sample question.</Typography>
                        )}
                    </Box>
                </Grid>
            </Container>
        </>
    );
};

export default MatchComponent;
