import React from 'react'
import styles from './Toolbar.module.css'

export default function Toolbar({ label, onNavigate, onView, view }) {
    return (
        <div className={styles.toolbar}>
            {/* Today + 檢視切換 */}
            <div className={styles.toolbarGroup}>
                <button
                    className={styles.toolbarButton}
                    onClick={() => onNavigate('TODAY')}
                >
                    今天
                </button>
                <button
                    className={`${styles.toolbarButton} ${view === 'month' ? styles.toolbarButtonActive : ''
                        }`}
                    onClick={() => onView('month')}
                >
                    月
                </button>
                <button
                    className={`${styles.toolbarButton} ${view === 'week' ? styles.toolbarButtonActive : ''
                        }`}
                    onClick={() => onView('week')}
                >
                    週
                </button>
                <button
                    className={`${styles.toolbarButton} ${view === 'day' ? styles.toolbarButtonActive : ''
                        }`}
                    onClick={() => onView('day')}
                >
                    日
                </button>
            </div>

            {/* current time */}
            <div className={styles.toolbarLabel}>{label}</div>


            {/* Prev/Next */}
            <div className={styles.toolbarGroup}>
                <button
                    className={styles.toolbarButton}
                    onClick={() => onNavigate('PREV')}
                >
                    ‹
                </button>
                <button
                    className={styles.toolbarButton}
                    onClick={() => onNavigate('NEXT')}
                >
                    ›
                </button>
            </div>


        </div>
    )
}

