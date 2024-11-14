import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = ({ handleLogout }) => {
    const isLoggedIn = Boolean(sessionStorage.getItem("authorized"));

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
                        Peerprep
                    </Link>
                </Typography>
                {isLoggedIn && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Link to="/home" style={{ textDecoration: "none" }}>
                            <Button sx={{ color: "white" }}>Home</Button>
                        </Link>
                        <Link to="/users-match" style={{ textDecoration: "none" }}>
                            <Button sx={{ color: "white" }}>Match Users</Button>
                        </Link>
                        <Button color="inherit" onClick={handleLogout} sx={{ textDecoration: "none" }}>
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
