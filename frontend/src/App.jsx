import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmLogout from "./pages/ConfirmLogout";
import AccountSettings from "./pages/AccountSettings";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import NavBar from "./components/NavBar";

function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="*" element={<NotFound />} />
                {/* Public Routes */}
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/home" element={<Home />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/account-settings" element={<AccountSettings />} />
                    <Route path="/confirm-logout" element={<ConfirmLogout />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
