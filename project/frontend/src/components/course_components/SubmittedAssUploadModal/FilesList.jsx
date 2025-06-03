import React from "react";
import styles from "./SubmittedAssUploadModal.module.css";

export const ExistingFilesList = ({ existingFiles, deletedFiles, onDeleteFile, onRestoreFile }) => {
  if (existingFiles.length === 0) return null;

  return (
    <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
      <label>已提交的檔案 ({existingFiles.filter(f => !deletedFiles.includes(f.path_to_file)).length} 個)</label>
      <div className={styles["existing-files-list"]}>
        {existingFiles.map((attachment, index) => {
          const fileName = attachment.filename || attachment.path_to_file?.split('/').pop() || `檔案${index + 1}`;
          const fileSize = attachment.size ? `(${(attachment.size / 1024).toFixed(1)} KB)` : '';
          const fileIdentifier = attachment.path_to_file || attachment.filename;
          const isMarkedForDeletion = deletedFiles.includes(fileIdentifier);
          
          return (
            <div 
              key={index} 
              className={`${styles["existing-file-item"]} ${isMarkedForDeletion ? styles["file-marked-for-deletion"] : ""}`}
            >
              <div className={styles["file-info"]}>
                <span className={styles["file-name"]}>
                  {isMarkedForDeletion && <span className={styles["deletion-mark"]}>[待刪除] </span>}
                  {fileName}
                </span>
                <span className={styles["file-size"]}>{fileSize}</span>
              </div>
              <div className={styles["file-actions"]}>
                {isMarkedForDeletion ? (
                  <button
                    type="button"
                    onClick={() => onRestoreFile(fileIdentifier)}
                    className={styles["restore-file-button"]}
                  >
                    取消刪除
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onDeleteFile(fileIdentifier)}
                    className={styles["delete-file-button"]}
                  >
                    刪除
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const NewFilesList = ({ files, onRemoveFile, onClearAll }) => {
  if (files.length === 0) {
    return (
      <div className={styles["file-placeholder"]}>
        <span>點擊上方按鈕選擇要新增的檔案</span>
      </div>
    );
  }

  return (
    <div className={styles["selected-files-list"]}>
      <div className={styles["files-header"]}>
        <span>待上傳檔案 ({files.length} 個)</span>
        <button
          type="button"
          onClick={onClearAll}
          className={styles["clear-all-button"]}
        >
          清空全部
        </button>
      </div>
      {files.map((file, index) => (
        <div key={index} className={styles["selected-file-item"]}>
          <div className={styles["file-info"]}>
            <span className={styles["file-name"]}>{file.name}</span>
            <span className={styles["file-size"]}>({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            type="button"
            onClick={() => onRemoveFile(index)}
            className={styles["remove-file-button"]}
          >
            移除
          </button>
        </div>
      ))}
    </div>
  );
}; 