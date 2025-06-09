
// src/utils/alert/AlertCenter.jsx
import React, { useState, useEffect, useRef } from 'react'
import { onAlert } from '../AlertContext'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Info, CheckCircle, AlertCircle } from 'lucide-react'
import styles from './AlertCenter.module.css'

const iconMap = { info: Info, success: CheckCircle, error: AlertCircle }
const AUTO_DISMISS = 5000

export default function AlertCenter() {
    const [alerts, setAlerts] = useState([])
    const nodeRefs = useRef({})

    // subscribe once at mount
    useEffect(() => {
        return onAlert(a => {
            setAlerts(curr => [...curr, a])
            // schedule removal
            setTimeout(() => {
                setAlerts(curr => curr.filter(x => x.id !== a.id))
                delete nodeRefs.current[a.id]
            }, AUTO_DISMISS)
        })
    }, [])

    return (
        <div className={styles.container}>
            <TransitionGroup component={null}>
                {alerts.map(a => {
                    if (!nodeRefs.current[a.id]) nodeRefs.current[a.id] = React.createRef()
                    const nodeRef = nodeRefs.current[a.id]
                    const Icon = iconMap[a.level] || Info

                    return (
                        <CSSTransition
                            key={a.id}
                            nodeRef={nodeRef}
                            timeout={300}
                            classNames={{
                                enter: styles.enter,
                                enterActive: styles.enterActive,
                                exit: styles.exit,
                                exitActive: styles.exitActive
                            }}
                        >
                            <div ref={nodeRef} className={`${styles.alertItem} ${styles[a.level]}`}>
                                <Icon className={styles.icon} size={16} />
                                {a.message}
                            </div>
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        </div>
    )
}

