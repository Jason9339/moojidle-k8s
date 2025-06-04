import { useState, useEffect } from "react";
import styles from "./TeacherAssignment.module.css";
import AssDetail from "@/components/course_components/TeacherAssignment/ControlWhichAss/AssDetail.jsx";
import TeacherAssignmentReview from "@/components/course_components/TeacherAssignment/TeacherAssReview/TeacherAssignmentReview.jsx";

function TeacherAssignment({ assignments }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [tabStartIdx, setTabStartIdx] = useState(0);
    const groupSize = 5;

    useEffect(() => {
        if (selectedIdx < tabStartIdx) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        } else if (selectedIdx >= tabStartIdx + groupSize) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        }
    }, [selectedIdx, assignments.length, groupSize]);

    if (!assignments || assignments.length === 0) {
        return <div>No assignments yet</div>;
    }

    const showLeftArrow = tabStartIdx > 0;
    const showRightArrow = tabStartIdx + groupSize < assignments.length;
    const itemsToDisplay = assignments.slice(tabStartIdx, tabStartIdx + groupSize);

    // 取得目前選中的 assignment
    const selectedAssignment = assignments[selectedIdx];
    const assignmentId = selectedAssignment?.id || selectedAssignment?.assignmentId || 0;
    const assignmentMaxScore = selectedAssignment?.maxScore || 100;

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
            <AssDetail assignment={selectedAssignment} />
            <TeacherAssignmentReview
                assignmentId={assignmentId}
                assignmentMaxScore={assignmentMaxScore}
            />
        </div>
    );
}

export default TeacherAssignment;