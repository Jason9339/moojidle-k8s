import { createRef, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useAlert } from './AlertContext';
import styles from './AlertCenter.module.css';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

const iconMap = {
    info: Info,
    success: CheckCircle,
    error: AlertCircle,
};

export default function AlertCenter() {
    const { alerts } = useAlert();
    const nodeRefs = useRef({});

    return (
        <div className={styles.container}>
            <TransitionGroup component={null}>
                {alerts.map(a => {
                    if (!nodeRefs.current[a.id]) {
                        nodeRefs.current[a.id] = createRef();
                    }
                    const nodeRef = nodeRefs.current[a.id];
                    const Icon = iconMap[a.level] || Info;

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

                            onExited={() => {
                                delete nodeRefs.current[a.id];
                            }}
                        >
                            <div ref={nodeRef} className={`${styles.alertItem} ${styles[a.level]}`}>
                                <Icon className={styles.icon} size={16} />
                                {a.message}
                            </div>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </div>
    );
}

