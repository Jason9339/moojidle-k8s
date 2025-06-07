import React, { createContext, useContext, useState, useCallback } from 'react';

/*
 *  Alert 
 *  { id: number, level: string, message: string }
*/
const AlertContext = createContext({
    alerts: [],
    addAlert: ({ level, message }) => { }
});

let nextAlertId = 0;

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const addAlert = useCallback((message, level = "info") => {
        const id = nextAlertId++;
        const newAlert = { id, level, message };
        setAlerts((prev) => [...prev, newAlert]);

        setTimeout(() => {
            removeAlert(id);
        }, 5000);

        return id;
    }, [removeAlert]);

    return (
        <AlertContext.Provider value={{ alerts, addAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

// Hook for outside
export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error('useAlert 必須在 <AlertProvider> 之下使用');
    }
    return ctx;
}

