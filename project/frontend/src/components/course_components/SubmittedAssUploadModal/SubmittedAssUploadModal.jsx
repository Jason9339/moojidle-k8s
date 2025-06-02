import React, { useState, useRef, useEffect } from "react";
import { CreateSubAssign, UpdateSubAssign, DeleteSubAssign } from "@/services/SubmittedAssignmentApi";
import { checkFilesAndAlert } from "@/utils/fileValidation";
import styles from "./SubmittedAssUploadModal.module.css";

const SubmittedAssUploadModal = ({ 
    onClose, 
    courseId, 
    assignmentId, 
    existingSubmission,
    onSuccess 
}) => {
    const [files, setFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [description, setDescription] = useState(existingSubmission?.description || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // 從 props 中取得已存在的檔案和提交ID
    const existingFiles = existingSubmission?.attachments || [];
    const submissionId = existingSubmission?.s_ass_id;

    // 監聽 existingSubmission 變化，更新本地狀態
    useEffect(() => {
        setDescription(existingSubmission?.description || "");
        setFiles([]);
        setDeletedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [existingSubmission]);

    const handleUpload = async () => {
        if (loading) return;
        
        // 獲取用戶 ID
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) {
            alert("請先登入");
            setLoading(false);
            return;
        }
        
        setLoading(true);

        const formData = new FormData();
        
        files.forEach((file, index) => {
            const renamedFile = new File([file], encodeURIComponent(file.name), { type: file.type });
            formData.append("uploadFile", renamedFile);
        });

        formData.append("description", description);
        formData.append("courseId", courseId);
        // 添加 userId（雖然後端應該從 token 獲取，但為了兼容性保留）
        formData.append("userId", userId);
        
        try {
            const isEmptyDescription = !description.trim();
            const hasNoNewFiles = files.length === 0;

            if (submissionId) {
                const remainingExistingFiles = existingFiles.filter(
                    (file) => !(deletedFiles.includes(file.path_to_file) || deletedFiles.includes(file.filename))
                );

                if (isEmptyDescription && hasNoNewFiles && remainingExistingFiles.length === 0) {
                    if (existingFiles.length > 0 || (existingSubmission?.description || "").trim()) {
                        await DeleteSubAssign(submissionId);
                        alert("作業提交記錄已因內容清空而被刪除！");
                    } else {
                        alert("沒有內容可更新。");
                        setLoading(false);
                        return;
                    }
                } else {
                    const originalDescription = existingSubmission?.description || "";
                    const noChangeInDescription = description === originalDescription;
                    const noFilesMarkedForDeletion = deletedFiles.length === 0;

                    if (noChangeInDescription && hasNoNewFiles && noFilesMarkedForDeletion) {
                        alert("內容未作修改。");
                        setLoading(false);
                        return;
                    }

                    if (existingFiles.length > 0) {
                        const keepFilesData = remainingExistingFiles.map(f => ({
                            path_to_file: f.path_to_file,
                            filename: f.filename,
                            size: f.size 
                        }));
                        formData.append("keepFiles", JSON.stringify(keepFilesData));
                    }
                    
                    await UpdateSubAssign(submissionId, formData);
                    
                    let message = "作業更新成功！";
                    const numNewFiles = files.length;
                    const numActuallyDeleted = existingFiles.length - remainingExistingFiles.length;

                    if (numNewFiles > 0 && numActuallyDeleted > 0) {
                        message += ` 新增 ${numNewFiles} 個檔案，刪除 ${numActuallyDeleted} 個檔案。`;
                    } else if (numNewFiles > 0) {
                        message += ` 新增 ${numNewFiles} 個檔案。`;
                    } else if (numActuallyDeleted > 0) {
                        message += ` 刪除 ${numActuallyDeleted} 個檔案。`;
                    } else if (description !== originalDescription) {
                         message = "作業描述更新成功！";
                    }
                    alert(message);
                }
            } else {
                if (isEmptyDescription && hasNoNewFiles) {
                    alert("沒有內容可以提交。");
                    setLoading(false);
                    return;
                }
                await CreateSubAssign(assignmentId, formData);
                alert("作業提交成功！");
            }
            
            setFiles([]);
            setDeletedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            onSuccess && onSuccess();
        } catch (error) {
            console.error("處理作業提交失敗:", error);
            alert("處理失敗：" + (error.response?.data?.message || error.message || "發生未知錯誤"));
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("確定要清空所有作業內容嗎？此操作將刪除所有已提交的檔案和描述，且無法復原。")) {
            return;
        }
        
        setLoading(true);
        
        try {
            // 先清空本地狀態
            setFiles([]);
            setDeletedFiles([]);
            setDescription("");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            if (submissionId) {
                // 有後端提交記錄，需要調用 API 刪除
                await DeleteSubAssign(submissionId);
                alert("作業提交記錄已完全清除！");
            } else {
                // 沒有後端提交記錄，只清空本地狀態
                alert("本地內容已清空！");
            }
            
            // 通知父組件更新並關閉 modal
            onSuccess && onSuccess();
            onClose(); // 直接關閉 modal
        } catch (error) {
            console.error("清空作業內容失敗:", error);
            alert("清空失敗：" + (error.response?.data?.message || error.message || "發生未知錯誤"));
        } finally {
            setLoading(false);
        }
    };

    // 標記檔案為刪除（暫存操作）
    const handleDeleteExistingFile = (fileUrl) => {
        setDeletedFiles(prev => [...prev, fileUrl]);
    };

    // 處理檔案選擇按鈕點擊事件
    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            
            if (!checkFilesAndAlert(newFiles)) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    // 移除選擇的檔案
    const removeSelectedFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className={styles["upload-modal"]}>
            <h2>繳交作業</h2>
            
            <div className={styles["modal-content"]}>
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
                            // 限制500字
                            if (e.target.value.length <= 500) {
                                setDescription(e.target.value);
                            }
                        }}
                        maxLength={500}
                    />
                </div>

                {/* 顯示已提交的檔案 */}
                {existingFiles.length > 0 && (
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
                                                    onClick={() => setDeletedFiles(prev => prev.filter(path => path !== fileIdentifier))}
                                                    className={styles["restore-file-button"]}
                                                >
                                                    取消刪除
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteExistingFile(fileIdentifier)}
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
                )}

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
                    
                    {/* 顯示選擇的檔案 */}
                    {files.length > 0 && (
                        <div className={styles["selected-files-list"]}>
                            <div className={styles["files-header"]}>
                                <span>待上傳檔案 ({files.length} 個)</span>
                                <button
                                    type="button"
                                    onClick={() => setFiles([])}
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
                                        onClick={() => removeSelectedFile(index)}
                                        className={styles["remove-file-button"]}
                                    >
                                        移除
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {files.length === 0 && (
                        <div className={styles["file-placeholder"]}>
                            <span>點擊上方按鈕選擇要新增的檔案</span>
                        </div>
                    )}
                </div>

                {/* 狀態提示 */}
                <div className={styles["status-info"]}>
                    <div className={styles["status-item"]}>
                        <strong>目前狀態：</strong>
                        {existingFiles.length > 0 ? (
                            <span className={styles["status-submitted"]}>
                                已提交 {existingFiles.filter(f => !deletedFiles.includes(f.path_to_file)).length} 個檔案
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
            </div>

            <div className={styles["button-group"]}>
                <button onClick={onClose} disabled={loading}>取消</button>
                
                {/* 顯示清空按鈕 */}
                {existingSubmission && (
                    existingFiles.length > 0 || 
                    (existingSubmission.description && existingSubmission.description.trim()) ||
                    description.trim()
                ) && (
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