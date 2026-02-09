'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, pin: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAdmin: false,
    loading: true,
    login: async () => false,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check initial session
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/check');
            const data = await res.json();
            setIsAdmin(data.isAdmin);
        } catch (e) {
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, pin: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pin }), // Send both
            });

            if (res.ok) {
                setIsAdmin(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/login', { method: 'DELETE' });
            setIsAdmin(false);
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
