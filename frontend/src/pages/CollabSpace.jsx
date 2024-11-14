// CollabSpace.jsx

import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import { Snackbar, Alert, Box, Button, Card, CardContent, Typography, Chip, Divider } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const serverWsUrl = import.meta.env.VITE_WS_COLLAB_URL;

const CollabSpace = () => {
    const { roomId } = useParams();
    const location = useLocation();

    const [question, setQuestion] = useState(location.state ? location.state.question : null);

    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const docRef = useRef(null);
    const providerRef = useRef(null);
    const hasClosedRef = useRef(false);
    const customWsRef = useRef(null); // Custom WebSocket for messages

    const handleRoomClosed = () => {
        if (hasClosedRef.current) return; // Prevent multiple triggers
        hasClosedRef.current = true;
        setIsLeaving(true);
        setShowRedirectMessage(true);
        setTimeout(() => {
            setShowRedirectMessage(false);
            navigate("/users-match");
        }, 3000);
    };

    const handleLeaveRoom = () => {
        if (!providerRef.current) {
            console.warn("Provider already destroyed or not initialized.");
            return;
        }

        setIsLeaving(true);

        providerRef.current.awareness.setLocalStateField("roomClosed", true);

        setTimeout(() => {
            navigate("/users-match");
            setIsLeaving(false);
        }, 3000);
    };

    useEffect(() => {
        
        docRef.current = new Y.Doc();

        const awarenessUpdateHandler = ({ added, updated, removed }) => {
            const states = providerRef.current.awareness.getStates();
            console.log("Awareness states updated:", states);

            
            for (const [clientID, state] of states.entries()) {
                if (state.roomClosed && !hasClosedRef.current) {
                    console.log("Room closure detected!");
                    handleRoomClosed();
                    break;
                }
            }
        };
        try {
            const wsUrl = `${serverWsUrl}?room=${roomId}`;
            console.log("Attempting Yjs WebSocket connection to:", wsUrl);
            sessionStorage.setItem('coding-session', roomId)
            providerRef.current = new WebsocketProvider(wsUrl, roomId, docRef.current);

            providerRef.current.awareness.on("update", awarenessUpdateHandler);

            providerRef.current.on("status", ({ status }) => {
                console.log("Yjs WebSocket status changed:", status);
                setConnectionStatus(status);
            });

            providerRef.current.on("sync", (isSynced) => {
                console.log("Document sync status:", isSynced);
                setIsInitialized(isSynced);
            });

            providerRef.current.on("error", (err) => {
                console.error("Yjs WebSocket error:", err);
                setError(err.message);
            });
        } catch (err) {
            console.error("Failed to initialize Yjs WebSocket provider:", err);
            setError(err.message);
        }

        const customWsUrl = `${serverWsUrl}?room=${roomId}&custom=true`;
        customWsRef.current = new WebSocket(customWsUrl);

        customWsRef.current.addEventListener("open", () => {
            console.log("Custom WebSocket connected.");

            const message = JSON.stringify(
                question
                    ? {
                          type: "SEND_QUESTION",
                          question: question,
                          roomId: roomId,
                      }
                    : {
                          type: "REQUEST_QUESTION",
                          roomId: roomId,
                      }
            );
            customWsRef.current.send(message);
            console.log("Custom message sent on WebSocket open:", message);
        });

        customWsRef.current.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Custom message received:", data);
                if (data.type === "RECEIVE_QUESTION") {
                    setQuestion(data.question);
                }
                
            } catch (error) {
                console.error("Error parsing custom WebSocket message:", error);
            }
        });

        customWsRef.current.addEventListener("error", (error) => {
            console.error("Custom WebSocket error:", error);
        });

        return () => {
            console.log("Cleaning up CollabSpace...");
            if (isLeaving) {
                const monacoText = docRef.current.getText('monaco')
                docRef.current.getText('monaco').delete(0, monacoText.length)
                const chatMessages = docRef.current.getArray('chatMessages')
                docRef.current.getArray('chatMessages').delete(0, chatMessages.length)
                sessionStorage.removeItem('session')
            }

            if (providerRef.current) {
                providerRef.current.awareness.off("update", awarenessUpdateHandler);
                providerRef.current.disconnect();
                providerRef.current.destroy();
                providerRef.current = null;
            }

            if (docRef.current) {
                docRef.current.destroy();
                docRef.current = null;
            }

            if (customWsRef.current) {
                customWsRef.current.close();
                customWsRef.current = null;
            }

            hasClosedRef.current = false;
        };
    }, [roomId]);

    return (
        <>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error" variant="filled" onClose={() => setError(null)}>
                    Connection error: {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showRedirectMessage}
                autoHideDuration={3000}
                onClose={() => setShowRedirectMessage(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info" variant="filled" onClose={() => setShowRedirectMessage(false)}>
                    You will be redirected soon as the room is closed.
                </Alert>
            </Snackbar>


            <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
                <Box
                    sx={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 2,
                    }}
                >
                    <Box sx={{ flexGrow: 4, marginBottom: 2, overflowY: "auto" }}>
                        {question && <QuestionCard question={question} />}
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 2,
                            flexBasis: "50vh",
                            marginBottom: 2,
                            overflowY: "auto",
                        }}
                    >
                        {providerRef.current && <Chat provider={providerRef.current} />}
                    </Box>

                    <Box sx={{ width: "100%", alignSelf: "flex-start" }}>
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            color="secondary"
                            onClick={handleLeaveRoom}
                            disabled={isLeaving}
                        >
                            {isLeaving ? "Leaving..." : "Leave Room"}
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ flexGrow: 1, margin: 2, overflowY: "auto" }}>
                        {isInitialized && providerRef.current && docRef.current ? (
                            <CodeEditor roomId={roomId} provider={providerRef.current} doc={docRef.current} />
                        ) : (
                            <Typography>Loading editor...</Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

const QuestionCard = ({ question }) => {
    return (
        <Card variant="outlined" sx={{ maxWidth: 600, margin: "auto", marginTop: 4, padding: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {question.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
                    <Chip label={question.category} color="primary" variant="outlined" />
                    <Chip label={`Complexity: ${question.complexity}`} color="secondary" variant="outlined" />
                </Box>

                <Divider variant="middle" sx={{ marginBottom: 2 }} />

                <Typography variant="body1" color="text.secondary">
                    {question.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CollabSpace;
