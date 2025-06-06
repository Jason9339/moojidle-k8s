import React from 'react';
import { useAlert } from './Alert';

// 根據 level 決定背景色（可自行調整）
const levelStyles = {
    info: { backgroundColor: '#007bff', color: '#fff' },
    success: { backgroundColor: '#28a745', color: '#fff' },
    error: { backgroundColor: '#dc3545', color: '#fff' },
    // 如果需要其他等級就加在這裡
};

const containerStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    width: '300px',
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};

const baseAlertStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    fontSize: '0.9rem',
    lineHeight: '1.3',
};

export default function AlertCenter() {
    const { alerts } = useAlert();

    return (
        <div style={containerStyle}>
            {alerts.map((a) => {
                const styleForLevel = levelStyles[a.level] || levelStyles.info;
                return (
                    <div key={a.id} style={{ ...baseAlertStyle, ...styleForLevel }}>
                        {a.message}
                    </div>
                );
            })}
        </div>
    );
}

