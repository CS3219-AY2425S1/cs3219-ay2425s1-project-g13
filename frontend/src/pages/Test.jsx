import { useTheme, Button, Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Test() {
    const [isRunning, setIsRunning] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const editorRef = useRef();
    const providerRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor; // Store editor instance in the ref
    };

    const handleRunCode = async () => {
        setIsRunning(true);

        if (editorRef.current) {
            const code = editorRef.current.getValue(); // Get the current code
            const body = {code: code}
            try {
                const response = await axios.post("http://localhost:8085/sandbox/execute", body)
                console.log('Execution result:', response.data.output);
                // Handle the response data as needed (e.g., display output to the user)
            } catch (error) {
                console.error('Error executing code:', error);
            }
        }

        setIsRunning(false)
    };

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ width: "50%", flexGrow: 1 }}>
                <Editor
                    height="100vh"
                    width="100%"
                    language="cpp"
                    defaultValue="// your code here"
                    theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                    onMount={handleEditorDidMount}
                />
            </Box>
            <Box sx={{ alignSelf: "flex-start", margin: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleRunCode} disabled={isRunning}>
                    {isRunning ? "Running..." : "Run Code"}
                </Button>
            </Box>
        </Box>
    );
}