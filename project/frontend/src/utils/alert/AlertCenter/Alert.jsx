
// src/AlertContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

// 每個 alert 物件結構：{ id: number, level: string, message: string }
const AlertContext = createContext({
    alerts: [],
    addAlert: ({ level, message }) => { }
});

let nextAlertId = 0;

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    // 根據 id 移除 alert
    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    // 新增 alert，並在 5 秒後自動移除
    const addAlert = useCallback(({ level, message }) => {
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

// 方便外部呼叫
export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error('useAlert 必須在 <AlertProvider> 之下使用');
    }
    return ctx;
}

