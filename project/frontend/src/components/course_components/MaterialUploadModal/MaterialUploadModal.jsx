import React, { useState, useRef } from "react";
import { UploadMaterial } from "@/services/MaterialApi";
import styles from "./MaterialUploadModal.module.css";

const MaterialUploadModal = ({ onClose, courseId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [displayDate, setDisplayDate] = useState("");

    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (!name.trim()) {
            alert("請輸入教材名稱");
            return;
        }
        if (!displayDate) {
            alert("請選擇顯示日期");
            return;
        }
        if (!description.trim()) {
            alert("請輸入簡介/描述");
            return;
        }
        if (!file) {
            alert("請選擇檔案");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) {
            alert("請先登入");
            return;
        }

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

        try {
            await UploadMaterial(formData);
            alert("教材上傳成功！");
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

            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label htmlFor="description">簡介/描述</label>
                <textarea
                    id="description"
                    placeholder="簡介/描述"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

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
                        required
                    />
                    <span className={styles["file-name-display"]}>
                        {file ? file.name : "尚未選擇任何檔案"}
                    </span>
                </div>
            </div>

            <div className={styles["button-group"]}>
                <button onClick={onClose}>取消</button>
                <button onClick={handleUpload}>上傳</button>
            </div>
        </div>
    );
};

export default MaterialUploadModal; 