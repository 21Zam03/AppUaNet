import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Crear un proveedor
export const AuthProvider = ({ children }) => {
    const [autenticado, setAutenticado] = useState(false);

    const handleLogin = (username, password) => {
        if (username === "21zam03" && password === "extergcw") {
            setAutenticado(true);
        } else {
            setAutenticado(false);
            return "¡El usuario u contraseña son incorrectas!";
        }
    };

    const handleLogout = () => {
        setAutenticado(false);
    };

    const value = {
        autenticado,
        handleLogin,
        handleLogout
    };

    return (
        <AuthContext.Provider value={{autenticado, handleLogin, handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Crear un hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);