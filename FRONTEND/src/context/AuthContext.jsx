import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    const login = (token, userRole) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        setIsAuthenticated(true);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
