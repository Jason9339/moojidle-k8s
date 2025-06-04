import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from './VerticalScrollIndicator.module.css';

export default function VerticalOverflowIndicator({
    children,
    className = "",
    height = "100%",
}) {
    const containerRef = useRef(null);

    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);

    const checkShadows = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const isOverflowing = el.scrollHeight > el.clientHeight;

        if (!isOverflowing) {
            setShowTopShadow(false);
            setShowBottomShadow(false);
            return;
        }

        // Top
        if (el.scrollTop === 0) {
            setShowTopShadow(false);
            setShowBottomShadow(true);
        }

        // Bottom
        else if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
            setShowTopShadow(true);
            setShowBottomShadow(false);
        }


        else {
            setShowTopShadow(true);
            setShowBottomShadow(true);
        }
    }, []);

    console.log("show shadow:", showBottomShadow);
    useEffect(() => {
        checkShadows();
    }, [checkShadows]);

    useEffect(() => {
        window.addEventListener("resize", checkShadows);
        return () => window.removeEventListener("resize", checkShadows);
    }, [checkShadows]);

    const handleScroll = () => {
        checkShadows();
    };

    return (
        <div
            className={`${styles['vertical-scroll-wrapper']} ${className}`}
            styles={{
                height: typeof height === "number" ? `${height}px` : height,
            }}
        >
            <div
                ref={containerRef}
                className={styles['vertical-scroll-container']}
                onScroll={handleScroll}
            >
                {children}
            </div>

            {showTopShadow && <div className={styles['shadow-top']} />}
            {showBottomShadow && <div className={styles["shadow-bottom"]} />}
        </div>
    );
}
