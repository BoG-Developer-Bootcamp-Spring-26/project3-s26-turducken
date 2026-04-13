"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { UserContextType } from "../types/types";

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/me");
                if (res.ok) {
                    const data = await res.json();
                    setUserId(data.userId);
                } else {
                    setUserId(null);
                }
            } catch (error) {
                setUserId(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ userId, setUserId, loading }}>
            {children}
        </UserContext.Provider>
    );
}