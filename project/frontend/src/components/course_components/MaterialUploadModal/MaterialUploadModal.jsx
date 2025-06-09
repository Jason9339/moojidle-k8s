import React, { useState, useRef, useMemo } from "react";
import { UploadMaterialFile, UploadMaterialLink } from "@/services/MaterialApi";
import styles from "./MaterialUploadModal.module.css";
import { addAlert } from "@/utils/alert/AlertContext";

const MaterialUploadModal = ({ onClose, courseId, course, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [uploadType, setUploadType] = useState("file"); // "file" 或 "link"
    const [url, setUrl] = useState("");

    const fileInputRef = useRef(null);

    // 計算課程的開始和結束日期範圍
    const dateRange = useMemo(() => {
        if (!course?.start_date || !course?.week_num) {
            return { min: null, max: null };
        }

        const startDate = new Date(course.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (course.week_num * 7) - 1);

        return {
            min: startDate.toISOString().split('T')[0],
            max: endDate.toISOString().split('T')[0]
        };
    }, [course]);

    const handleUpload = async () => {
        if (!name.trim()) {
            addAlert("請輸入教材名稱", "error");
            return;
        }
        if (!displayDate) {
            addAlert("請選擇顯示日期", "error");
            return;
        }

        if (uploadType === "file") {
            if (!file) {
                addAlert("請選擇檔案", "error");
                return;
            }
        } else {
            if (!url.trim()) {
                addAlert("請輸入連結", "error");
                return;
            }
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) {
            addAlert("請先登入", "error");
            return;
        }

        try {
            if (uploadType === "file") {
                const formData = new FormData();

                // 解決中文檔案名稱亂碼問題
                const renamedFile = new File(
                    [file],
                    encodeURIComponent(file.name),
                    { type: file.type }
                );
                formData.append("uploadFile", renamedFile);
                formData.append("courseId", courseId);
                formData.append("createByUserId", userId);
                formData.append("description", description);
                formData.append("mName", name);
                formData.append("displayDate", displayDate);

                await UploadMaterialFile(formData);
                addAlert("教材檔案上傳成功！", "success");
            } else {
                const linkData = {
                    createByUserId: userId,
                    mName: name,
                    description: description,
                    displayDate: displayDate,
                    url: url
                };

                await UploadMaterialLink(courseId, linkData);
                addAlert("教材連結新增成功！", "success");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("上傳時發生錯誤", error);
            addAlert("上傳失敗", "error");
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    return (
        <div className={styles["upload-modal"]}>
            <h2>上傳教材</h2>

            <div className={styles["input-group"]}>
                <label htmlFor="name">教材名稱</label>
                <input
                    id="name"
                    type="text"
                    placeholder="教材名稱"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label htmlFor="displayDate">
                    顯示日期
                    {dateRange.min && dateRange.max && (
                        <small style={{ color: '#6c757d', fontSize: '12px', marginLeft: '8px' }}>
                            (可選擇範圍：{dateRange.min} 至 {dateRange.max})
                        </small>
                    )}
                </label>
                <input
                    id="displayDate"
                    type="date"
                    value={displayDate}
                    onChange={(e) => setDisplayDate(e.target.value)}
                    min={dateRange.min}
                    max={dateRange.max}
                    required
                />
            </div>

            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label htmlFor="description">簡介/描述 (optional)</label>
                <textarea
                    id="description"
                    placeholder="簡介/描述"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className={styles["input-group"]}>
                <label>教材類型</label>
                <div className={styles["radio-group"]}>
                    <label className={`${styles["radio-label"]} ${uploadType === "file" ? styles["radio-label-selected"] : ""}`}>
                        <input
                            type="radio"
                            value="file"
                            checked={uploadType === "file"}
                            onChange={(e) => setUploadType(e.target.value)}
                        />
                        <span>檔案</span>
                    </label>
                    <label className={`${styles["radio-label"]} ${uploadType === "link" ? styles["radio-label-selected"] : ""}`}>
                        <input
                            type="radio"
                            value="link"
                            checked={uploadType === "link"}
                            onChange={(e) => setUploadType(e.target.value)}
                        />
                        <span>連結</span>
                    </label>
                </div>
            </div>

            {uploadType === "file" ? (
                <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                    <label>選擇檔案</label>
                    <div className={styles["file-input-custom-area"]}>
                        <button
                            type="button"
                            onClick={handleFileButtonClick}
                            className={styles["custom-file-button"]}
                        >
                            選擇檔案
                        </button>
                        <input
                            id="file"
                            type="file"
                            accept="*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                        />
                        <span className={styles["file-name-display"]}>
                            {file ? file.name : "尚未選擇任何檔案"}
                        </span>
                    </div>
                </div>
            ) : (
                <div className={styles["input-group"]}>
                    <label htmlFor="url">連結網址</label>
                    <input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
            )}

            <div className={styles["button-group"]}>
                <button onClick={onClose}>取消</button>
                <button onClick={handleUpload}>上傳</button>
            </div>
        </div>
    );
};

export default MaterialUploadModal; 
