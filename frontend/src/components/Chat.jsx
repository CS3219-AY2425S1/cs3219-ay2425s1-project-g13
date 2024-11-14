import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function Chat({ provider }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const username = sessionStorage.getItem("username");

    // Use a Yjs array for chat messages
    const chatArray = provider.doc.getArray("chatMessages");

    useEffect(() => {
        // Load existing messages and listen for new ones
        setMessages(chatArray.toArray());
        
        const updateMessages = () => setMessages(chatArray.toArray());
        chatArray.observe(updateMessages);

        return () => chatArray.unobserve(updateMessages);
    }, [chatArray]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            chatArray.push([{ userId: username, text: newMessage, timestamp: Date.now() }]);
            setNewMessage("");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "70vh", // Limits the message area height
                    margin: 1,
                    padding: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px"
                }}
            >
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={`${msg.userId}: ${msg.text}`}
                                secondary={new Date(msg.timestamp).toLocaleTimeString()}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
}
