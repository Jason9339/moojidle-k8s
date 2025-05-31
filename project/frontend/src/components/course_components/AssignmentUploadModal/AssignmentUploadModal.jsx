import React, { useState, useRef } from "react";
import { UploadAssignment } from "@/services/AssignmentApi";
import styles from "./AssignmentUploadModal.module.css";

const AssignmentUploadModal = ({ onClose, courseId, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [maxScore, setMaxScore] = useState("");
    const [percentage, setPercentage] = useState("");

    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (!name.trim()) {
            alert("請輸入作業名稱");
            return;
        }
        if (!startDate || !startTime) {
            alert("請選擇開始日期和時間");
            return;
        }
        if (!endDate || !endTime) {
            alert("請選擇結束日期和時間");
            return;
        }

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (endDateTime <= startDateTime) {
            alert("結束時間必須在開始時間之後");
            return;
        }

        if (!maxScore || parseFloat(maxScore) <= 0) {
            alert("請輸入有效的最高成績");
            return;
        }

        if (!percentage || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100) {
            alert("請輸入有效的百分比 (1-100)");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) {
            alert("請先登入");
            return;
        }

        const formData = new FormData();

        files.forEach((file) => {
            const renamedFile = new File(
                [file],
                encodeURIComponent(file.name),
                { type: file.type }
            );
            formData.append("uploadFile", renamedFile);
        });

        formData.append("courseId", courseId);
        formData.append("createByUserId", userId);
        formData.append("description", description);
        formData.append("assName", name);
        formData.append("startDate", startDateTime.toISOString());
        formData.append("endDate", endDateTime.toISOString());
        formData.append("maxScore", parseFloat(maxScore));
        formData.append("percentage", parseFloat(percentage));

        try {
            await UploadAssignment(formData);
            alert("作業上傳成功！");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("上傳時發生錯誤", error);
            alert("上傳失敗：" + error.message);
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className={styles["upload-modal"]}>
            <h2>上傳作業</h2>

            <div className={styles["input-group"]}>
                <label htmlFor="name">作業名稱</label>
                <input
                    id="name"
                    type="text"
                    placeholder="作業名稱"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className={styles["datetime-row"]}>
                <label>作業時間區間</label>
                <div className={styles["datetime-inline"]}>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                    <span className={styles["range-separator"]}>~</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles["score-group"]}>
                <div className={styles["input-group"]}>
                    <label htmlFor="maxScore">最高成績</label>
                    <input
                        id="maxScore"
                        type="number"
                        placeholder="100"
                        min="0"
                        step="0.1"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        required
                    />
                </div>

                <div className={styles["input-group"]}>
                    <label htmlFor="percentage">成績佔比 (%)</label>
                    <input
                        id="percentage"
                        type="number"
                        placeholder="20"
                        min="1"
                        max="100"
                        step="0.1"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        required
                    />
                </div>
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

            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label>選擇檔案 (可選擇多個) (optional)</label>
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
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />
                    <span className={styles["file-count-display"]}>
                        {files.length === 0 ? "尚未選擇任何檔案" : `已選擇 ${files.length} 個檔案`}
                    </span>
                </div>

                {files.length > 0 && (
                    <div className={styles["file-list"]}>
                        {files.map((file, index) => (
                            <div key={index} className={styles["file-item"]}>
                                <span className={styles["file-name"]}>{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className={styles["remove-file-button"]}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles["button-group"]}>
                <button onClick={onClose}>取消</button>
                <button onClick={handleUpload}>上傳</button>
            </div>
        </div>
    );
};

export default AssignmentUploadModal; 