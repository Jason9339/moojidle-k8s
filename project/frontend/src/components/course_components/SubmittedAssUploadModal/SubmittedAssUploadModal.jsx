import React from "react";
import { useSubmissionForm } from "@/components/course_components/SubmittedAssUploadModal/hooks/useSubmissionForm";
import { ExistingFilesList, NewFilesList } from "./FilesList";
import { StatusInfo } from "./StatusInfo";
import styles from "./SubmittedAssUploadModal.module.css";

const SubmittedAssUploadModal = ({ 
    onClose, 
    courseId, 
    assignmentId, 
    existingSubmission,
    onSuccess 
}) => {
    const {
        files,
        deletedFiles,
        description,
        loading,
        fileInputRef,
        existingFiles,
        setFiles,
        setDescription,
        handleUpload,
        handleClearAll,
        handleFileChange,
        removeSelectedFile,
        handleDeleteExistingFile,
        handleRestoreFile
    } = useSubmissionForm({ courseId, assignmentId, existingSubmission, onSuccess });

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const shouldShowClearButton = existingSubmission && (
        existingFiles.length > 0 || 
        (existingSubmission.description && existingSubmission.description.trim()) ||
        description.trim()
    );

    return (
        <div className={styles["upload-modal"]}>
            <h2>繳交作業</h2>
            
            <div className={styles["modal-content"]}>
                {/* 描述輸入區域 */}
                <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                    <label htmlFor="description">
                        簡介/描述
                        <span className={styles["char-counter"]}>
                            ({description.length}/500字)
                        </span>
                    </label>
                    <textarea
                        id="description"
                        placeholder="簡介/描述"
                        value={description}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setDescription(e.target.value);
                            }
                        }}
                        maxLength={500}
                    />
                </div>

                {/* 已提交的檔案列表 */}
                <ExistingFilesList 
                    existingFiles={existingFiles}
                    deletedFiles={deletedFiles}
                    onDeleteFile={handleDeleteExistingFile}
                    onRestoreFile={handleRestoreFile}
                />

                {/* 新增檔案區域 */}
                <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                    <label>
                        新增檔案
                        <span className={styles["file-limits"]}>
                            (支援多檔案選擇)
                        </span>
                    </label>
                    <div className={styles["file-input-custom-area"]}>
                        <button
                            type="button"
                            onClick={handleFileButtonClick}
                            className={styles["custom-file-button"]}
                        >
                            選擇要新增的檔案
                        </button>
                        <input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            multiple
                        />
                    </div>
                    
                    {/* 新檔案列表 */}
                    <NewFilesList 
                        files={files}
                        onRemoveFile={removeSelectedFile}
                        onClearAll={() => setFiles([])}
                    />
                </div>

                {/* 狀態信息 */}
                <StatusInfo 
                    existingFiles={existingFiles}
                    deletedFiles={deletedFiles}
                    files={files}
                />
            </div>

            {/* 按鈕組 */}
            <div className={styles["button-group"]}>
                <button onClick={onClose} disabled={loading}>
                    取消
                </button>
                
                {shouldShowClearButton && (
                    <button 
                        onClick={handleClearAll}
                        disabled={loading}
                        className={styles["clear-button"]}
                        style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "1px solid #dc3545"
                        }}
                    >
                        {loading ? "清空中..." : "清空所有內容"}
                    </button>
                )}
                
                <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className={styles["submit-button"]}
                >
                    {loading ? "處理中..." : (
                        files.length > 0 ? `新增 ${files.length} 個檔案` : "更新作業"
                    )}
                </button>
            </div>
        </div>
    );
};

export default SubmittedAssUploadModal;