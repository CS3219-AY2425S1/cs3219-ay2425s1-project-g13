import { useTheme, Button, Box, Select, Typography, MenuItem, Card, CardContent } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import io from "socket.io-client";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";
import { CODE_SNIPPETS } from "../constants";

const socket = io(import.meta.env.VITE_USER_URL);
import axios from "axios";

export default function CodeEditor({ roomId, provider, doc, onRoomClosed}) {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState();
    const [logs, setLogs] = useState();
    const theme = useTheme();
    const editorRef = useRef();
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState('');

    useEffect(() => {
        // Join the room when component mounts
        socket.emit("joinRoom", { roomId });
        // Listen for code updates from the server
        socket.on("codeUpdate", (newCode) => {
            setCode(newCode);
            if (editorRef.current) {
                editorRef.current.getModel().setValue(newCode);
            }
        });
        // Clean up when component unmounts
        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
        editor.focus();
        // Create Yjs text type and bind to Monaco editor
        const type = doc.getText("monaco");
        new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);
    }

    const handleEditorChange = (newValue) => {
        setCode(newValue);
        socket.emit('codeUpdate', { roomId, code: newValue });
    };
{/*}
    const formatCode = () => {
        if (!editorRef.current) return;
        try {
            const currentCode = editorRef.current.getValue();
            // Check if `language` is defined and compatible with Prettier
            const formattedCode = prettier.format(currentCode, {
                parser: language === "javascript" ? "babel" : language,  // Ensure language compatibility
                plugins: [parserBabel],  // Make sure this plugin is properly imported and compatible
                tabWidth: 2,
            });
    
            editorRef.current.setValue(formattedCode);  // Set formatted code in editor
        } catch (error) {
            console.error("Error formatting code:", error);
            alert("There was an error formatting the code. Please check your setup.");
        }
    };*/}

    const handleRunCode = async () => {
        setIsRunning(true);

        if (editorRef.current) {
            const code = editorRef.current.getValue(); // Get the current code
            const body = {code: code};
            console.log(language)
            try {
                if (language == "python") {
                    const response = await axios.post(`${import.meta.env.VITE_SANDBOX_URL}/sandbox/execute-py`, body);
                    console.log(response.data.output);
                    setLogs([""]);
                    setOutput(response.data.output);
                } else if (language == "javascript") {
                    const response = await axios.post(`${import.meta.env.VITE_SANDBOX_URL}/sandbox/execute-js`, body);
                    console.log(response.data.output);
                    console.log(response.data.logs);
                    setLogs(response.data.logs);
                    setOutput(response.data.output);
                } else {
                    setOutput("Sorry, execution of this programming language is not supported yet!");
                }
            } catch (error) {
                setOutput('Error executing code');
                setLogs([""]);
                console.error('Error executing code:', error);
            }
        }

        setIsRunning(false)
    };

    return (
        <Box sx={{ width: "100%", flexGrow: 1 }}>
            <Typography variant="h6" sx={{ textAlign: "center", padding: 1 }}>
                Code Editor
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    variant="outlined"
                    size="small"
                >
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="javascript">JavaScript</MenuItem>
                </Select>
                <Button variant="contained" /*onClick={formatCode}*/>
                    Format Code
                </Button>
            </Box>

            <Editor
                height="75vh"
                width="100%"
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                value={code}
                theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                    folding: true,
                    fontSize: 14,
                    tabSize: 2,
                    minimap: {
                        enabled: false,
                    },
                }}
            />
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card variant="outlined" sx={{ width: "100%", margin: "auto", marginTop: 4, padding: 2 }}>
                    <CardContent>
                        <Typography component="pre" variant="body1" color="text.secondary">
                            {"LOGS: "}
                            {(logs || [""]).join('\n')}
                        </Typography>  
                        <Typography variant="body1" color="text.secondary">
                            {"OUTPUT: "}
                            {output}
                        </Typography>
                    </CardContent>
                </Card>
                <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleRunCode} disabled={isRunning}>
                        {isRunning ? "Running..." : "Run Code"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

// import { useTheme, Button, Box } from "@mui/material";
// import { useState, useRef, useEffect } from "react";
// import { Editor } from "@monaco-editor/react";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
// import { MonacoBinding } from "y-monaco";
// import { useNavigate } from "react-router-dom";

// const serverWsUrl = "ws://localhost:4444";

// export default function CodeEditor({ roomId, onRoomClosed }) {
//     const [isLeaving, setIsLeaving] = useState(false);
//     const theme = useTheme();
//     const navigate = useNavigate();
//     const editorRef = useRef();
//     const providerRef = useRef(null);

//     function handleEditorDidMount(editor) {
//         editorRef.current = editor;

//         // Initialize yjs
//         const doc = new Y.Doc();

//         // Connect to peers with WebSocket
//         providerRef.current = new WebsocketProvider(serverWsUrl, roomId, doc);
//         const type = doc.getText("monaco");

//         // Bind yjs doc to Monaco editor
//         new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]));

//         const chatType = doc.getArray("chatMessages");

//         // const addChatMessage = (message) => {
//         //     chatType.push([{ userId: myUserId, text: message, timestamp: Date.now() }]);
//         // };

//         // chatType.observe((event) => {
//         //     event.changes.added.forEach((item) => {
//         //         item.content.getContent().forEach((message) => {
//         //             console.log("New chat message:", message);
//         //             // Handle displaying the message in your chat UI
//         //         });
//         //     });
//         // });

//         // Set up awareness listener
//         const awarenessUpdateHandler = () => {
//             if (providerRef.current) {
//                 providerRef.current.awareness.getStates().forEach((state) => {
//                     if (state.roomClosed) {
//                         handleRoomClosed();
//                     }
//                 });
//             }
//         };

//         providerRef.current.awareness.on("update", awarenessUpdateHandler);

//         // Clean up awareness listener when unmounting or disconnecting
//         return () => {
//             if (providerRef.current) {
//                 providerRef.current.awareness.off("update", awarenessUpdateHandler);
//             }
//         };
//     }

//     const handleLeaveRoom = () => {
//         setIsLeaving(true);

//         if (providerRef.current) {
//             providerRef.current.awareness.setLocalStateField("roomClosed", true);
//         }
//         navigate("/users-match");
//     };

//     const handleRoomClosed = () => {
//         if (providerRef.current) {
//             providerRef.current.disconnect();
//             providerRef.current = null;
//         }
//         onRoomClosed();
//     };

//     useEffect(() => {
//         // Cleanup on component unmount
//         return () => {
//             if (providerRef.current) {
//                 providerRef.current.disconnect();
//                 providerRef.current = null;
//             }
//         };
//     }, []);

//     return (
//         <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
//                 <Button variant="contained" color="secondary" onClick={handleLeaveRoom} disabled={isLeaving}>
//                     {isLeaving ? "Leaving..." : "Leave Room"}
//                 </Button>
//             </Box>
//             <Box sx={{ width: "50%", flexGrow: 1 }}>
//                 <Editor
//                     height="100vh"
//                     width="100%"
//                     language="cpp"
//                     defaultValue="// your code here"
//                     theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
//                     onMount={handleEditorDidMount}
//                 />
//             </Box>
//         </Box>
//     );
// }
