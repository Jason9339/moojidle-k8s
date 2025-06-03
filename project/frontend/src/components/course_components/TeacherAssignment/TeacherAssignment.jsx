import { useState, useEffect, useRef } from "react"; 
import styles from "./TeacherAssignment.module.css";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import TeacherAssignmentReview from "@/components/course_components/TeacherAssignmentReview/TeacherAssignmentReview";
import { DownloadAssignment } from "@/services/AssignmentApi";

function TeacherAssignment({ assignments }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [tabStartIdx, setTabStartIdx] = useState(0);
    const [descExpanded, setDescExpanded] = useState(false);
    const [descOverflow, setDescOverflow] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const attachmentsRef = useRef(null);
    const contentWrapperRef = useRef(null);

    // only show 5 assignments at a time
    const groupSize = 5;

    useEffect(() => {
        if (selectedIdx < tabStartIdx) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        } else if (selectedIdx >= tabStartIdx + groupSize) {
            setTabStartIdx(Math.floor(selectedIdx / groupSize) * groupSize);
        }
    }, [selectedIdx, assignments.length, groupSize]);

    // 監控 標題+描述+附件 是否超過 7 行
    useEffect(() => {
        setDescExpanded(false); // 切換 assignment 時自動收合
        if (descRef.current && titleRef.current && attachmentsRef.current) {
            // 取 description 的 lineHeight
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
            const maxLines = 7;
            const maxHeight = lineHeight * maxLines;
            // 計算三個區塊的高度總和
            const totalHeight =
                titleRef.current.offsetHeight +
                descRef.current.scrollHeight +
                attachmentsRef.current.offsetHeight;
            setDescOverflow(totalHeight > maxHeight + 1);
        }
    }, [selectedIdx, assignments]);

    if (!assignments || assignments.length === 0) {
        return <div>No assignments yet</div>; 
    }

    const showLeftArrow = tabStartIdx > 0;
    const showRightArrow = tabStartIdx + groupSize < assignments.length;

    const itemsToDisplay = assignments.slice(tabStartIdx, tabStartIdx + groupSize);

    const assignmentId = assignments[selectedIdx]?.id || 0;
    const assignmentMaxScore = assignments[selectedIdx]?.maxScore || 100;

    const handleDownload = async (attachment) => {
        try {
            await DownloadAssignment(attachment.path_to_file, attachment.filename);
        } catch (error) {
            alert(`下載失敗：${attachment.filename}`);
        }
    };

    const getContentWrapperStyle = () => {
        if (!descOverflow || descExpanded) return {};
        if (descRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
            const maxLines = 7;
            const maxHeight = lineHeight * maxLines;
            return {
                maxHeight: maxHeight,
                overflow: "hidden",
            };
        }
        return {};
    };

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
                <div
                    ref={contentWrapperRef}
                    style={getContentWrapperStyle()}
                >
                    <div ref={titleRef} className={styles.descTitle}>
                        {assignments[selectedIdx]?.name}
                    </div>
                    <div className={styles.verticalSpacer} /> 
                    <div
                        ref={descRef}
                        className={styles.descContent}
                    >
                        {assignments[selectedIdx]?.description}
                    </div>
                    <div ref={attachmentsRef}>
                        {assignments[selectedIdx]?.attachments && assignments[selectedIdx].attachments.length > 0 && (
                            <div className={styles.attachmentsBox}>
                                <span className={styles.attachmentsLabel}>附件：</span>
                                <div className={styles.attachmentsList}>
                                    {assignments[selectedIdx].attachments.map((file, idx) => (
                                        <div key={idx} className={styles.attachmentItem}>
                                            <span className={styles.attachmentIcon}>📎</span>
                                            <a
                                                href="#"
                                                className={styles.attachmentLink}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleDownload(file);
                                                }}
                                                title={file.filename}
                                            >
                                                {file.filename}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {descOverflow && (
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
            <TeacherAssignmentReview assignmentId={assignmentId} assignmentMaxScore={assignmentMaxScore} />
        </div>
    );
}

export default TeacherAssignment;
