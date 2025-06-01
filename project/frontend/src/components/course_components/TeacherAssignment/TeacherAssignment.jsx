import { useState, useEffect, useRef } from "react"; 
import styles from "./TeacherAssignment.module.css";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

function TeacherAssignment({ assignments }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [tabStartIdx, setTabStartIdx] = useState(0);
    const [descExpanded, setDescExpanded] = useState(false);
    const [descOverflow, setDescOverflow] = useState(false);
    const descRef = useRef(null);

    // only show 5 assignments at a time
    const groupSize = 5;

    // 當 assignments 或 selectedIdx 變動時，確保 selectedIdx 在顯示範圍內
    useEffect(() => {
        if (selectedIdx < tabStartIdx) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        } else if (selectedIdx >= tabStartIdx + groupSize) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        }
    }, [selectedIdx, assignments.length, groupSize]);

    // 監控 description 是否超過 5 行
    useEffect(() => {
        setDescExpanded(false); // 切換 assignment 時自動收合
        if (descRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
            const maxLines = 5;
            const maxHeight = lineHeight * maxLines;
            setDescOverflow(descRef.current.scrollHeight > maxHeight + 1);
        }
    }, [selectedIdx, assignments]);

    if (!assignments || assignments.length === 0) {
        return <div>No assignments yet</div>; 
    }

    const showLeftArrow = tabStartIdx > 0;
    const showRightArrow = tabStartIdx + groupSize < assignments.length;

    const itemsToDisplay = assignments.slice(tabStartIdx, tabStartIdx + groupSize);
    
    return (
        <div>
            <div className={styles.tabListBox}>
                <div className={styles.tabList}>
                    <button
                        className={`${styles.arrowBtn} ${!showLeftArrow ? styles.arrowBtnDisabled : ""}`}
                        onClick={() => showLeftArrow && setTabStartIdx(tabStartIdx - groupSize)}
                        disabled={!showLeftArrow}
                    >
                        ◀
                    </button>
                    <div
                      className={
                        itemsToDisplay.length > 0 && itemsToDisplay.length < groupSize
                            ? `${styles.tabBtnGroup} ${styles.tabBtnGroupLeft}`
                            : styles.tabBtnGroup
                      }
                    >
                        {itemsToDisplay.map((a, idx) => {
                            const realIdx = tabStartIdx + idx;
                            return (
                                <button
                                    key={a.id}
                                    onClick={() => setSelectedIdx(realIdx)}
                                    className={`${styles.tabBtn} ${realIdx === selectedIdx ? styles.tabBtnActive : ""}`}
                                >
                                    {a.name}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className={`${styles.arrowBtn} ${!showRightArrow ? styles.arrowBtnDisabled : ""}`}
                        onClick={() => showRightArrow && setTabStartIdx(tabStartIdx + groupSize)}
                        disabled={!showRightArrow}
                    >
                        ▶
                    </button>
                </div>
            </div>
            <div className={styles.descBox}>
                <div className={styles.descTitle}>
                    {assignments[selectedIdx]?.name}
                </div>
                <div className={styles.verticalSpacer} /> 
                <div
                    ref={descRef}
                    className={`${styles.descContent} ${!descExpanded && descOverflow ? styles.descContentCollapsed : ""}`}
                >
                    {assignments[selectedIdx]?.description}
                </div>
                {descOverflow && assignments[selectedIdx] && (
                    <div className={styles.descToggleWrapper}>
                        <button
                            className={styles.descToggle}
                            onClick={() => setDescExpanded(e => !e)}
                            aria-label={descExpanded ? "縮合" : "展開"} 
                            type="button"
                        >
                            <span> 
                                {descExpanded ? "縮合" : "展開"} 
                            </span>
                            {descExpanded
                                ? <GoChevronUp color="#1976d2" size="1.2em" />
                                : <GoChevronDown color="#1976d2" size="1.2em" />
                            }
                        </button>
                    </div>
                )}
            </div>
             <div>hello</div>
        </div>
    );
}

export default TeacherAssignment;