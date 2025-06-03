import { useState, useEffect, useRef } from "react";
import styles from "./AssDetail.module.css";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { DownloadAssignment } from "@/services/AssignmentApi";

function AssDetail({ assignment }) {
    const [descExpanded, setDescExpanded] = useState(false);
    const [descOverflow, setDescOverflow] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const attachmentsRef = useRef(null);

    useEffect(() => {
        setDescExpanded(false);
        if (descRef.current && titleRef.current && attachmentsRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
            const maxLines = 7;
            const maxHeight = lineHeight * maxLines;
            const totalHeight =
                titleRef.current.offsetHeight +
                descRef.current.scrollHeight +
                attachmentsRef.current.offsetHeight;
            setDescOverflow(totalHeight > maxHeight + 1);
        }
    }, [assignment]);

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

    const handleDownload = async (attachment) => {
        try {
            await DownloadAssignment(attachment.path_to_file, attachment.filename);
        } catch (error) {
            alert(`下載失敗：${attachment.filename}`);
        }
    };

    if (!assignment) return null;

    return (
        <div className={styles.descBox}>
            <div style={getContentWrapperStyle()}>
                <div ref={titleRef} className={styles.descTitle}>
                    {assignment.name}
                </div>
                <div className={styles.verticalSpacer} />
                <div ref={descRef} className={styles.descContent}>
                    {assignment.description}
                </div>
                <div ref={attachmentsRef}>
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className={styles.attachmentsBox}>
                            <span className={styles.attachmentsLabel}>附件：</span>
                            <div className={styles.attachmentsList}>
                                {assignment.attachments.map((file, idx) => (
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
    );
}

export default AssDetail;