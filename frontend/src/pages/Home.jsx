// src/components/HomePage.jsx

import React, { useEffect, useState } from "react";
import { questionAPI } from "../api.js";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const HomePage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // State for Add/Edit Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
    const [currentQuestion, setCurrentQuestion] = useState({
        title: "",
        description: "",
        category: "",
        complexity: "",
    });

    // State for Description Dialog
    const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");

    // State for Snackbar Notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // 'success' | 'error' | 'warning' | 'info'
    });

    // Fetch all questions on component mount
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Function to fetch all questions
    const fetchQuestions = async () => {
        try {
            const response = await questionAPI.get("/questions");
            setQuestions(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching questions:", err);
            setError(true);
            setLoading(false);
        }
    };

    // Handle opening the dialog for adding/editing
    const handleOpenDialog = (mode, question = null) => {
        setDialogMode(mode);
        if (mode === "edit" && question) {
            setCurrentQuestion({
                _id: question._id,
                title: question.title,
                description: question.description,
                category: question.category,
                complexity: question.complexity,
            });
        } else {
            setCurrentQuestion({
                title: "",
                description: "",
                category: "",
                complexity: "",
            });
        }
        setOpenDialog(true);
    };

    // Handle closing the add/edit dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentQuestion({
            title: "",
            description: "",
            category: "",
            complexity: "",
        });
    };

    // Handle input changes in the add/edit dialog
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission for Add/Edit
    const handleSubmit = async () => {
        if (dialogMode === "add") {
            // Add new question
            try {
                const response = await questionAPI.post("/questions", currentQuestion);
                setQuestions((prev) => [...prev, response.data]);
                setSnackbar({
                    open: true,
                    message: "Question added successfully!",
                    severity: "success",
                });
                handleCloseDialog();
            } catch (err) {
                console.error("Error adding question:", err);
                setSnackbar({
                    open: true,
                    message: "Failed to add question.",
                    severity: "error",
                });
            }
        } else if (dialogMode === "edit") {
            // Update existing question
            try {
                const { _id, ...updatedData } = currentQuestion;
                await questionAPI.put(`${"/questions"}/${_id}`, updatedData);
                setQuestions((prev) => prev.map((q) => (q._id === _id ? { ...q, ...updatedData } : q)));
                setSnackbar({
                    open: true,
                    message: "Question updated successfully!",
                    severity: "success",
                });
                handleCloseDialog();
            } catch (err) {
                console.error("Error updating question:", err);
                setSnackbar({
                    open: true,
                    message: "Failed to update question.",
                    severity: "error",
                });
            }
        }
    };

    // Handle deleting a question
    const handleDelete = async (_id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await questionAPI.delete(`${"/questions"}/${_id}`);
                setQuestions((prev) => prev.filter((q) => q._id !== _id));
                setSnackbar({
                    open: true,
                    message: "Question deleted successfully!",
                    severity: "success",
                });
            } catch (err) {
                console.error("Error deleting question:", err);
                setSnackbar({
                    open: true,
                    message: "Failed to delete question.",
                    severity: "error",
                });
            }
        }
    };

    // Handle opening the description dialog
    const handleOpenDescriptionDialog = (description) => {
        setSelectedDescription(description);
        setOpenDescriptionDialog(true);
    };

    // Handle closing the description dialog
    const handleCloseDescriptionDialog = () => {
        setOpenDescriptionDialog(false);
        setSelectedDescription("");
    };

    // Handle closing the snackbar
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Loading Questions...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h4" align="center" color="error" gutterBottom>
                    Failed to Load Questions.
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog("add")} style={{ marginBottom: "20px" }}>
                Add New Question
            </Button>
            <TableContainer component={Paper}>
                <Table aria-label="questions table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Title</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Category</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Complexity</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Actions</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question._id}>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        onClick={() => handleOpenDescriptionDialog(question.description)}
                                        style={{ textTransform: "none", padding: 0 }}
                                    >
                                        {question.title}
                                    </Button>
                                </TableCell>
                                <TableCell>{question.category}</TableCell>
                                <TableCell>{question.complexity}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpenDialog("edit", question)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(question._id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {questions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No questions available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>{dialogMode === "add" ? "Add New Question" : "Edit Question"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentQuestion.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={currentQuestion.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="category"
                        label="Category"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentQuestion.category}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="complexity"
                        label="Complexity"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentQuestion.complexity}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {dialogMode === "add" ? "Add" : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Description Dialog */}
            <Dialog open={openDescriptionDialog} onClose={handleCloseDescriptionDialog} fullWidth>
                <DialogTitle>Question Description</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{selectedDescription}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDescriptionDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default HomePage;
