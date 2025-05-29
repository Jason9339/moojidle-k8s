import React, { useState, useRef } from "react"; // 引入 useRef
import { UploadMaterial } from "@/services/MaterialApi";
import { UploadAssignment } from "@/services/AssignmentApi";
import styles from "./UploadModal.module.css";

const UploadModal = ({ onClose, courseId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("material");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [startDate, setStartDate] = useState("");

    // 建立一個 ref 來存取隱藏的 file input
    const fileInputRef = useRef(null);

    const handleUpload = async () => {
        if (!name.trim()) {
            alert("請輸入名稱");
            return;
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
        }
        if (type === "material" && !displayDate) {
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
    
        if (type === "assignment") {
            formData.append("assName", name);
            formData.append("startDate", new Date(startDate).toISOString());
            formData.append("endDate", new Date(endDate).toISOString());
        } else {
            formData.append("mName", name);
            formData.append("displayDate", displayDate);
        }
    
        try {
            if (type === "assignment") {
                await UploadAssignment(formData);
                alert("作業上傳成功！");
            } else {
                await UploadMaterial(formData);
                alert("教材上傳成功！");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("上傳時發生錯誤", error);
            alert("上傳失敗：" + error.message);
        }
    };

    // 處理檔案選擇按鈕點擊事件
    const handleFileButtonClick = () => {
        fileInputRef.current?.click(); // 觸發隱藏的 file input 的點擊事件
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
            <h2>上傳檔案</h2>

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

            {type === "assignment" && (
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

            {type === "material" && (
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
            )}

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

            {/* 修改後的檔案選擇區塊 */}
            <div className={`${styles["input-group"]} ${styles["vertical-group"]}`}>
                <label>選擇檔案</label> {/* 這個 label 是給整個檔案選擇區塊的 */}
                <div className={styles["file-input-custom-area"]}>
                    <button
                        type="button"
                        onClick={handleFileButtonClick}
                        className={styles["custom-file-button"]}
                    >
                        選擇檔案
                    </button>
                    <input
                        id="file" // id 仍然需要，但 input 本身被隱藏
                        type="file"
                        accept="*"
                        onChange={handleFileChange}
                        ref={fileInputRef} // 綁定 ref
                        style={{ display: "none" }} // 直接隱藏 input
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

export default UploadModal;