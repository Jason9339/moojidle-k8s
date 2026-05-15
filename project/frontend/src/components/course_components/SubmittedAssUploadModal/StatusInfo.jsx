import React from "react";
import styles from "./SubmittedAssUploadModal.module.css";

export const StatusInfo = ({ existingFiles, deletedFiles, files }) => {
    return (
        <div className={styles["status-info"]}>
            <div className={styles["status-item"]}>
                <strong>目前狀態：</strong>
                {existingFiles.length > 0 ? (
                    <span className={styles["status-submitted"]}>
                        已提交 {existingFiles.filter(f => !deletedFiles.includes(f.url)).length} 個檔案
                    </span>
                ) : (
                    <span className={styles["status-not-submitted"]}>尚未提交</span>
                )}
            </div>
            {files.length > 0 && (
                <div className={styles["status-item"]}>
                    <strong>準備新增：</strong>
                    <span className={styles["status-pending"]}>{files.length} 個檔案</span>
                </div>
            )}
            {deletedFiles.length > 0 && (
                <div className={styles["status-item"]}>
                    <strong>準備刪除：</strong>
                    <span className={styles["status-delete"]}>{deletedFiles.length} 個檔案</span>
                </div>
            )}
        </div>
    );
}; 
