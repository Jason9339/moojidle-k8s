import { useState, useEffect } from "react";
import styles from "./TeacherExam.module.css";
import ExamDetail from "@/components/course_components/TeacherExam/TeacherExamDetail/TeacherExamDetail.jsx";
import TeacherExamReview from "@/components/course_components/TeacherExam/TeacherExamReview/TeacherExamReview.jsx";

function TeacherExam({ exams }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [tabStartIdx, setTabStartIdx] = useState(0);
    const groupSize = 5;

    useEffect(() => {
        if (selectedIdx < tabStartIdx) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        } else if (selectedIdx >= tabStartIdx + groupSize) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        }
    }, [selectedIdx, exams.length, groupSize]);

    if (!exams || exams.length === 0) {
        return <div>No exams yet</div>;
    }

    const showLeftArrow = tabStartIdx > 0;
    const showRightArrow = tabStartIdx + groupSize < exams.length;
    const itemsToDisplay = exams.slice(tabStartIdx, tabStartIdx + groupSize);

    const selectedExam = exams[selectedIdx];
    const examId = selectedExam?.id || selectedExam?.examId || 0;
    const examMaxScore = selectedExam?.maxScore || 100;

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
            <ExamDetail exam = {selectedExam} 
            />
                
            <TeacherExamReview
                examId={examId}
                examMaxScore={examMaxScore}
            /> 
        </div>
    );
}

export default TeacherExam;
