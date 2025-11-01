import React, { createContext, useState, useContext } from 'react';
import type { Player } from '../types';
import { DataContext } from './DataContext';

// This is the shape of the user object that will be exposed to the app
export type CurrentUser = (Player & { type: 'player' }) | { id: string; type: 'admin'; email: string } | null;

interface IAuthContext {
    currentUser: CurrentUser;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<CurrentUser>;
    loginWithGoogleCredential: (credential: string) => Promise<CurrentUser>;
    logout: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

// Helper to decode JWT
const decodeJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Error decoding JWT", e);
        return null;
    }
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
    const [loading, setLoading] = useState(false);
    const { registeredPlayers, findOrCreatePlayerByGoogle } = useContext(DataContext);
    
    const isAuthenticated = !!currentUser;

    const login = async (email: string, pass: string): Promise<CurrentUser> => {
        setLoading(true);
        // Add a small delay to simulate a network request
        await new Promise(res => setTimeout(res, 500));

        const emailToLogin = email.toLowerCase() === 'admin' ? 'admin@mouloudiatiznit.com' : email;
        
        if (email.toLowerCase() === 'admin' && pass === 'password') {
            const adminUser: CurrentUser = { id: 'admin-user', type: 'admin', email: emailToLogin };
            setCurrentUser(adminUser);
            setLoading(false);
            return adminUser;
        }

        const player = registeredPlayers.find(p => p.email === emailToLogin);
        // NOTE: In this mock version, we are not checking the password for players.
        if (player && player.status !== 'pending' && player.status !== 'rejected') {
            const playerUser: CurrentUser = { ...player, type: 'player' };
            setCurrentUser(playerUser);
            setLoading(false);
            return playerUser;
        }

        setLoading(false);
        throw new Error('Invalid credentials or registration not approved. Please try again.');
    };

    const loginWithGoogleCredential = async (credential: string): Promise<CurrentUser> => {
        setLoading(true);
        const decodedToken = decodeJwt(credential);
        
        if (!decodedToken || !decodedToken.email || !decodedToken.name) {
            setLoading(false);
            throw new Error("Invalid Google credential.");
        }
        
        const googleUser = { email: decodedToken.email, name: decodedToken.name };
        const player = findOrCreatePlayerByGoogle(googleUser);

        if (player) {
             const playerUser: CurrentUser = { ...player, type: 'player' };
             setCurrentUser(playerUser);
             setLoading(false);
             return playerUser;
        }
        
        setLoading(false);
        throw new Error("Failed to create or find player account.");
    };

    const logout = async () => {
        setCurrentUser(null);
    };
    
    const value = {
        currentUser,
        isAuthenticated,
        login,
        loginWithGoogleCredential,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};