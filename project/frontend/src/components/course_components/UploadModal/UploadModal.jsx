import React, { useState, useRef, useEffect } from "react"; // 引入 useRef
import { UploadMaterial } from "@/services/MaterialApi";
import { UploadAssignment, SubmitAssignment, GetAssignmentSubmission, DeleteSubmittedFile, DeleteSubmissionRecord } from "@/services/AssignmentApi";
import styles from "./UploadModal.module.css";

// mode: "material" | "assignment" | "student-assignment"
const UploadModal = ({ onClose, courseId, assignmentId, onSuccess, mode = "material" }) => {
    const [files, setFiles] = useState([]); // 改為多檔案支援
    const [existingFiles, setExistingFiles] = useState([]); // 已提交的檔案
    const [existingSubmission, setExistingSubmission] = useState(null); // 完整的已提交作業記錄
    const [deletedFiles, setDeletedFiles] = useState([]); // 標記要刪除的檔案
    const [type, setType] = useState("material");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);// 根據 mode 自動設定 type
    useEffect(() => {
        if (mode === "student-assignment") {
            setType("student-assignment");
            // 載入已提交的檔案
            loadExistingSubmission();
        } else if (mode === "assignment") {
            setType("assignment");
        } else {
            setType("material");
        }
    }, [mode, assignmentId]);    // 載入已提交的作業
    const loadExistingSubmission = async () => {
        if (mode === "student-assignment" && assignmentId) {
            try {
                const submission = await GetAssignmentSubmission(assignmentId);
                if (submission) {
                    setExistingSubmission(submission); // 保存完整的提交記錄
                    setExistingFiles(submission.attachments || []);
                    setDescription(submission.description || "");
                } else {
                    setExistingSubmission(null);
                    setExistingFiles([]);
                    setDescription("");
                }
            } catch (error) {
                console.error("載入已提交作業失敗:", error);
                setExistingSubmission(null);
                setExistingFiles([]);
                setDescription("");
            }
        }
    };const handleUpload = async () => {
        if (loading) return;
        
        if (type === "material" || type === "assignment") {
            if (!name.trim()) {
                alert("請輸入名稱");
                return;
            }
        }
        if (type === "assignment") {
            if (!startDate) {
                alert("請選擇開始日期時間");
                return;
            }
            if (!endDate) {
                alert("請選擇結束日期時間");
                return;
            }
            if (new Date(endDate) <= new Date(startDate)) {
                alert("結束日期必須在開始日期之後");
                return;
            }
        }        if (type === "material" && !displayDate) {
            alert("請選擇顯示日期");
            return;
        }
        // 只有非學生提交模式才需要驗證描述欄位
        if (type !== "student-assignment" && !description.trim()) {
            alert("請輸入簡介/描述");
            return;
        }
        
        // 學生提交作業可以不需要檔案（只更新描述）
        if (type !== "student-assignment" && files.length === 0) {
            alert("請選擇檔案");
            return;
        }
    
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) {
            alert("請先登入");
            return;
        }

        setLoading(true);
    
        const formData = new FormData();
        
        // 添加所有選擇的檔案
        files.forEach((file, index) => {
            const renamedFile = new File([file], encodeURIComponent(file.name), { type: file.type });
            formData.append("uploadFile", renamedFile);
        });        formData.append("courseId", courseId);
        formData.append("description", description);
        
        // 調試信息
        console.log('[UploadModal] 準備提交的描述:', {
            description: description,
            描述長度: description.length,
            描述是否為空字串: description === "",
            描述內容: JSON.stringify(description)
        });
    
        if (type === "assignment") {
            formData.append("createByUserId", userId);
            formData.append("assName", name);
            formData.append("startDate", new Date(startDate).toISOString());
            formData.append("endDate", new Date(endDate).toISOString());
        } else if (type === "material") {
            formData.append("createByUserId", userId);
            formData.append("mName", name);
            formData.append("displayDate", displayDate);
        } else if (type === "student-assignment") {
            // 學生繳交作業
            formData.append("assignmentId", assignmentId);
            formData.append("submitByUserId", userId);
            // 只需檔案與描述
        }
        
        try {
            if (type === "assignment") {
                await UploadAssignment(formData);
                alert("作業上傳成功！");
            } else if (type === "material") {
                await UploadMaterial(formData);
                alert("教材上傳成功！");            } else if (type === "student-assignment") {
                // 學生繳交作業 - 處理檔案新增和刪除
                
                // 檢查是否要完全清空所有內容的情況
                const isEmptyDescription = !description.trim();
                const hasNoNewFiles = files.length === 0;
                const willDeleteAllExistingFiles = existingFiles.length > 0 && 
                    deletedFiles.length === existingFiles.length;
                const hasAnyExistingContent = existingFiles.length > 0 || 
                    (existingSubmission && existingSubmission.description && existingSubmission.description.trim());
                  // 情況1: 用戶想要完全清空所有內容（描述為空，沒有新檔案，且要刪除所有現有檔案）
                // 情況2: 用戶提交空的描述和空的檔案列表，但有現有內容存在
                if ((isEmptyDescription && hasNoNewFiles && willDeleteAllExistingFiles) ||
                    (isEmptyDescription && hasNoNewFiles && deletedFiles.length === 0 && hasAnyExistingContent)) {
                    try {
                        await DeleteSubmissionRecord(assignmentId);
                        alert("作業提交記錄已完全清除！");
                        
                        // 重新載入以更新 UI 狀態
                        await loadExistingSubmission();
                        setDeletedFiles([]);
                        
                        // 清空檔案選擇
                        setFiles([]);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        
                        // 通知父組件更新狀態
                        onSuccess && onSuccess();
                        return; // 結束處理，不需要繼續執行其他邏輯
                    } catch (error) {
                        console.error("清除作業提交記錄失敗:", error);
                        alert("清除失敗：" + error.message);
                        return;
                    }
                }
                
                let submissionDeleted = false;
                let deletedCount = 0;
                
                // 先處理要刪除的檔案
                for (const fileUrl of deletedFiles) {
                    try {
                        const deleteResult = await DeleteSubmittedFile(assignmentId, fileUrl);
                        console.log(`檔案已刪除: ${fileUrl}`, deleteResult);
                        
                        // 檢查是否整個提交記錄被刪除
                        if (deleteResult.data && deleteResult.data.deleted === true) {
                            submissionDeleted = true;
                            console.log(`提交記錄已完全刪除: ${deleteResult.data.reason}`);
                        }
                        deletedCount++;
                    } catch (error) {
                        console.error(`刪除檔案失敗: ${fileUrl}`, error);
                        // 繼續處理其他檔案，不中斷整個流程
                    }
                }                // 處理剩餘的檔案操作和提交
                if (files.length > 0 || deletedCount === 0 || description !== (existingSubmission?.description || "")) {
                    // 有新檔案、沒有刪除操作、或描述有變更，需要調用 SubmitAssignment
                    try {
                        const submitResult = await SubmitAssignment(assignmentId, formData);
                        
                        // 檢查後端是否因為內容為空而自動刪除了提交記錄
                        if (submitResult.data && submitResult.data.deleted === true) {
                            alert("作業提交記錄已完全清除（描述和檔案都為空）");
                        } else {
                            // 正常的更新或提交
                            if (submissionDeleted && files.length > 0) {
                                alert(`作業已重新提交！原提交記錄已清除，新增了 ${files.length} 個檔案`);
                            } else if (files.length > 0) {
                                alert(`作業更新成功！新增了 ${files.length} 個檔案${deletedCount > 0 ? `，刪除了 ${deletedCount} 個檔案` : ''}`);
                            } else if (deletedCount > 0) {
                                alert(`作業更新成功！刪除了 ${deletedCount} 個檔案`);
                            } else {
                                alert("作業描述更新成功！");
                            }
                        }
                    } catch (error) {
                        console.error("提交作業失敗:", error);
                        alert("提交失敗：" + error.message);
                        return;
                    }
                } else if (submissionDeleted && files.length === 0) {
                    // 只有刪除操作，沒有新內容，且提交記錄已被刪除
                    alert(`作業提交記錄已完全清除！刪除了 ${deletedCount} 個檔案`);
                }
                
                // 重新載入已提交的檔案
                await loadExistingSubmission();
                // 清空暫存的刪除列表
                setDeletedFiles([]);
            }
            
            // 清空檔案選擇
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            onSuccess && onSuccess();
            
            // 只有非學生提交模式才關閉視窗
            if (type !== "student-assignment") {
                onClose && onClose();
            }        } catch (error) {
            console.error("上傳時發生錯誤", error);
            alert("上傳失敗：" + error.message);        } finally {
            setLoading(false);
        }
    };

    // 清空所有內容的處理函數
    const handleClearAll = async () => {
        if (!window.confirm("確定要清空所有作業內容嗎？此操作將刪除所有已提交的檔案和描述，且無法復原。")) {
            return;
        }
        
        setLoading(true);
        try {
            await DeleteSubmissionRecord(assignmentId);
            alert("作業提交記錄已完全清除！");
            
            // 清空前端狀態
            setFiles([]);
            setExistingFiles([]);
            setExistingSubmission(null); // 清空完整的提交記錄
            setDeletedFiles([]);
            setDescription("");
            
            // 清空檔案輸入
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            onSuccess && onSuccess();
        } catch (error) {
            console.error("清空作業內容失敗:", error);
            alert("清空失敗：" + error.message);
        } finally {
            setLoading(false);
        }
    };

    // 標記檔案為刪除（暫存操作）
    const handleDeleteExistingFile = (fileUrl) => {
        //if (!window.confirm("確定要刪除這個檔案嗎？此操作將在您按下「更新作業」後生效。")) {
          //  return;
        //}
        
        // 將檔案加入刪除列表
        setDeletedFiles(prev => [...prev, fileUrl]);
    };

    // 處理檔案選擇按鈕點擊事件
    const handleFileButtonClick = () => {
        fileInputRef.current?.click(); // 觸發隱藏的 file input 的點擊事件
    };    // 檔案驗證函數
    const validateFiles = (newFiles) => {
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const maxTotalFiles = 10; // 最多10個檔案
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/zip',
            'application/x-zip-compressed'
        ];

        for (const file of newFiles) {
            // 檢查檔案大小
            if (file.size > maxFileSize) {
                alert(`檔案 "${file.name}" 超過 10MB 限制`);
                return false;
            }
            
            // 檢查檔案類型
            if (!allowedTypes.includes(file.type) && file.type !== '') {
                // 如果 MIME type 不在允許清單中，檢查副檔名
                const extension = file.name.split('.').pop().toLowerCase();
                const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
                if (!allowedExtensions.includes(extension)) {
                    alert(`不支援的檔案類型: "${file.name}"`);
                    return false;
                }
            }
        }

        // 檢查總檔案數量
        if (type === "student-assignment") {
            const totalFiles = files.length + existingFiles.length + newFiles.length;
            if (totalFiles > maxTotalFiles) {
                alert(`檔案總數不能超過 ${maxTotalFiles} 個`);
                return false;
            }
        }

        return true;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            
            // 驗證檔案
            if (!validateFiles(newFiles)) {
                // 清空 input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            
            if (type === "student-assignment") {
                // 學生提交支援多檔案累加
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
            } else {
                // 其他模式保持單檔案
                setFiles([newFiles[0]]);
            }
        }
    };

    // 移除選擇的檔案
    const removeSelectedFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };    return (
        <div className={styles["upload-modal"]}>
            <h2>{mode === "student-assignment" ? "繳交作業" : "上傳檔案"}</h2>
            
            <div className={styles["modal-content"]}>
                {/* 類型選擇只在一般模式顯示 */}
                {mode === "material" || mode === "assignment" ? (
                    <div className={styles["input-group"]}>
                        <label htmlFor="type">選擇類型</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="material">教材</option>
                            <option value="assignment">作業</option>
                        </select>
                    </div>
                ) : null}
            {/* 名稱欄位只在非學生繳交時顯示 */}
            {mode !== "student-assignment" && (
                <div className={styles["input-group"]}>
                    <label htmlFor="name">
                        {type === "assignment" ? "作業名稱" : "教材名稱"}
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder={type === "assignment" ? "作業名稱" : "教材名稱"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
            )}
            {/* 作業起訖日僅在新增作業時顯示 */}
            {type === "assignment" && mode !== "student-assignment" && (
                <>
                    <div className={styles["input-group"]}>
                        <label htmlFor="startDate">開始日期時間</label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles["input-group"]}>
                        <label htmlFor="endDate">結束日期時間</label>
                        <input
                            id="endDate"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </>
            )}
            {/* 顯示日期僅在教材時顯示 */}
            {type === "material" && mode !== "student-assignment" && (
                <div className={styles["input-group"]}>
                    <label htmlFor="displayDate">顯示日期</label>
                    <input
                        id="displayDate"
                        type="date"
                        value={displayDate}
                        onChange={(e) => setDisplayDate(e.target.value)}
                        required
                    />
                </div>
            )}            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label htmlFor="description">簡介/描述</label>
                <textarea
                    id="description"
                    placeholder="簡介/描述"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required={mode !== "student-assignment"}
                />
            </div>{/* 顯示已提交的檔案（僅學生繳交模式） */}
            {mode === "student-assignment" && existingFiles.length > 0 && (
                <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                    <label>已提交的檔案 ({existingFiles.filter(f => !deletedFiles.includes(f.url || f.filename)).length} 個)</label>
                    <div className={styles["existing-files-list"]}>
                        {existingFiles.map((attachment, index) => {
                            const fileName = attachment.filename || attachment.url?.split('/').pop() || `檔案${index + 1}`;
                            const fileSize = attachment.size ? `(${(attachment.size / 1024).toFixed(1)} KB)` : '';
                            const fileIdentifier = attachment.url || attachment.filename;
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
                                        {/* 下載按鈕已移除 */}
                                        {isMarkedForDeletion ? (
                                            <button
                                                type="button"
                                                onClick={() => setDeletedFiles(prev => prev.filter(url => url !== fileIdentifier))}
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
            )}<div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label>
                    {mode === "student-assignment" ? "新增檔案" : "選擇檔案"}
                    {mode === "student-assignment" && (
                        <span className={styles["file-limits"]}>
                            (支援多檔案，單檔最大10MB，總數最多10個)
                        </span>
                    )}
                </label>
                <div className={styles["file-input-custom-area"]}>
                    <button
                        type="button"
                        onClick={handleFileButtonClick}
                        className={styles["custom-file-button"]}
                    >
                        {mode === "student-assignment" ? "選擇要新增的檔案" : "選擇檔案"}
                    </button>
                    <input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        multiple={mode === "student-assignment"} // 學生模式支援多檔案選擇
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
                        {mode === "student-assignment" ? (
                            <span>點擊上方按鈕選擇要新增的檔案</span>
                        ) : (
                            <span>尚未選擇任何檔案</span>
                        )}
                    </div>                )}
            </div>
              {/* 學生提交模式的狀態提示 */}
            {mode === "student-assignment" && (
                <div className={styles["status-info"]}>
                    <div className={styles["status-item"]}>
                        <strong>目前狀態：</strong>
                        {existingFiles.length > 0 ? (
                            <span className={styles["status-submitted"]}>
                                已提交 {existingFiles.filter(f => !deletedFiles.includes(f.url || f.filename)).length} 個檔案
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
            )}
            </div>
              <div className={styles["button-group"]}>
                <button onClick={onClose} disabled={loading}>取消</button>
                  {/* 學生作業提交模式下顯示清空按鈕 */}
                {mode === "student-assignment" && existingSubmission && (
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
                    className={mode === "student-assignment" ? styles["submit-button"] : styles["upload-button"]}
                >
                    {loading ? "處理中..." : (
                        mode === "student-assignment" ? 
                            (files.length > 0 ? `新增 ${files.length} 個檔案` : "更新作業") : 
                            "上傳"
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadModal;