import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, role: userRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/connexion" />;
    }

    if (role !== userRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
