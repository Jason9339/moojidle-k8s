import { useState, useEffect, useRef } from "react";
import styles from "./AssDetail.module.css";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { DownloadAssignment } from "@/services/AssignmentApi";
import { useAlert } from "@/utils/alert/AlertContext";

function AssDetail({ assignment }) {
    const [descExpanded, setDescExpanded] = useState(false);
    const [descOverflow, setDescOverflow] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const { addAlert } = useAlert();
    useEffect(() => {
        setDescExpanded(false);
        if (descRef.current && titleRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
            const maxLines = 7;
            const maxHeight = lineHeight * maxLines;
            const totalHeight =
                titleRef.current.offsetHeight +
                descRef.current.scrollHeight;
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
            addAlert(`下載失敗：${attachment.filename}`);
        }
    };

    if (!assignment) return null;

    return (
        <div className={styles.descBox}>
            {/* 只包住標題和內容 */}
            <div style={getContentWrapperStyle()}>
                <div ref={titleRef} className={styles.descTitle}>
                    {assignment.name}
                </div>
                <div className={styles.verticalSpacer} />
                <div ref={descRef} className={styles.descContent}>
                    {assignment.description}
                </div>
            </div>
            {/* 展開/縮合按鈕放在附件上方 */}
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
            {/* 附件永遠顯示 */}
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
    );
}

export default AssDetail;
