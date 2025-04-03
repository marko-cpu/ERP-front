import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import AuthVerify from './auth-verify';  

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setCurrentUser(storedUser);
                setRoles(storedUser.roles);
                setLoading(false);
                return;
            }

            // If no user in local storage, fetch from server
            const userFromServer = await AuthService.getCurrentUser();
            if (userFromServer) {
                localStorage.setItem('user', JSON.stringify(userFromServer));
                setCurrentUser(userFromServer);
                setRoles(userFromServer.roles);
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(null);
        setRoles([]);
    };

    const updateUser = (user) => {
        setCurrentUser(user);
        setRoles(user?.roles || []);
        localStorage.setItem('user', JSON.stringify(user));
    };

    return (
        <AuthContext.Provider value={{ currentUser, roles, updateUser, loading, logOut }}>
            {children}
            <AuthVerify logOut={logOut} /> 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
