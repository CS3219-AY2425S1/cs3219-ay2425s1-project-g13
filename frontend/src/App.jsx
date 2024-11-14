import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmLogout from "./pages/ConfirmLogout";
import AccountSettings from "./pages/AccountSettings";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import NavBar from "./components/NavBar";
import MatchUsers from "./pages/MatchUsers";
import CollabSpace from "./pages/CollabSpace";

function App() {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("authorized");
        sessionStorage.removeItem("authorization");
        sessionStorage.removeItem('username')
        navigate("/login");
    };

    return (
        <>
            <NavBar handleLogout={handleLogout}/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                {/* Public Routes */}
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/account-settings" element={<AccountSettings />} />
                    <Route path="/collab/:roomId" element={<CollabSpace />} />
                    <Route path="/users-match" element={<MatchUsers />} />
                    <Route path="/confirm-logout" element={<ConfirmLogout />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
