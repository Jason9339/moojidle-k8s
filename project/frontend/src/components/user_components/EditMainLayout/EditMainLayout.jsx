import React, { useState } from 'react';
import styles from "./EditMainLayout.module.css";
import { UpdateUserProfile } from "@/services/UserApi";
import { HiXMark } from "react-icons/hi2";
import { addAlert } from '@/utils/alert/AlertContext';

function EditMainLayout({ email, contact_ways = [], currentAvatar, onSave, onCancel }) {
    const [contacts, setContacts] = useState(contact_ways);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentAvatar || "/user_pfp/default.png");
    const [loading, setLoading] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 檢查檔案類型
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                addAlert("請選擇有效的圖片檔案 (JPG, PNG, GIF, WebP)", "error");
                return;
            }

            // 檢查檔案大小 (2MB)
            if (file.size > 2 * 1024 * 1024) {
                addAlert("檔案大小不能超過 2MB", "error");
                return;
            }

            setSelectedFile(file);

            // 創建預覽 URL
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (index, field, value) => {
        setContacts(contacts.map((c, i) =>
            i === index ? { ...c, [field]: value } : c
        ));
    };

    const handleAdd = () => {
        setContacts([...contacts, { approach: '', details: '' }]);
    };

    const handleRemove = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };
    const handleSave = async () => {
        setLoading(true);
        try {
            const validContacts = contacts
                .filter(c =>
                    c &&
                    typeof c === "object" &&
                    typeof c.approach === "string" &&
                    typeof c.details === "string" &&
                    c.approach.trim() !== "" &&
                    c.details.trim() !== ""
                )
                .map(c => ({
                    approach: c.approach.trim(),
                    details: c.details.trim()
                }));

            // 檢查是否有變更
            const isContactChanged = JSON.stringify(validContacts) !== JSON.stringify(contact_ways);
            const hasNewAvatar = selectedFile !== null;


            if (!isContactChanged && !hasNewAvatar) {
                addAlert("沒有資料需要更新", "info");
                return;
            }

            if (!isContactChanged && validContacts.length === 0) {
                addAlert("請至少添加一個聯絡方式", "error");
                return;
            }

            // 建立 FormData 來支援檔案上傳
            const formData = new FormData();

            // 添加聯絡方式資料
            if (isContactChanged) {
                formData.append('contactWays', JSON.stringify(validContacts));
            }

            // 添加頭像檔案
            if (hasNewAvatar) {
                formData.append('avatar', selectedFile);
            }

            const result = await UpdateUserProfile(userId, formData);

            // 呼叫父組件的回調函數
            onSave({
                contactWays: validContacts,
                newAvatar: result.updatedAvatar,
                hasNewAvatar: result.hasNewAvatar
            });

            addAlert("個人資料儲存成功！", "success");

        } catch (err) {
            addAlert("儲存失敗，請稍後再試", "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={loading ? styles.loading : ''}>
            {/* 頭像上傳區域 */}
            <div className={styles.avatarSection}>
                <label className={styles.avatarLabel}>Edit Profile Picture:</label>
                <div className={styles.avatarContainer}>
                    <img
                        src={previewUrl}
                        alt="預覽頭像"
                        className={styles.avatarPreview}
                        onError={() => setPreviewUrl("/user_pfp/default.png")}
                    />
                    <div className={styles.avatarControls}>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                            id="avatar-upload"
                            disabled={loading}
                        />
                        <label htmlFor="avatar-upload" className={styles.uploadBtn}>
                            選擇頭像
                        </label>
                        {selectedFile && (
                            <span className={styles.fileName}>
                                {selectedFile.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 電子郵件顯示區域 */}
            <div className={styles.emailSection}>
                <div className={styles.infoBlock}>
                    <span className={styles.label}>Registered Email:</span>
                    <span className={styles.value}>{email}</span>
                </div>
            </div>

            {/* 其他聯絡方式編輯區域 */}
            <div className={styles.contactSection}>
                <label className={styles.contactLabel}>Other Contact Ways:</label>
                <div className={styles.contactList}>
                    {contacts.map((contact, idx) => (
                        <div key={idx} className={styles.contactItem}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    value={contact.approach}
                                    onChange={e => handleChange(idx, 'approach', e.target.value)}
                                    placeholder="Type (e.g. email, phone)"
                                    className={styles.input}
                                    disabled={loading}
                                />
                                <span className={styles.separator}>:</span>
                                <input
                                    type="text"
                                    value={contact.details}
                                    onChange={e => handleChange(idx, 'details', e.target.value)}
                                    placeholder="Details"
                                    className={styles.input}
                                    disabled={loading}
                                />
                            </div>
                            <span
                                onClick={() => !loading && handleRemove(idx)}
                                className={styles.removeIcon}
                                role="button"
                                aria-label="移除聯絡方式"
                                tabIndex={0}
                            >
                                <HiXMark />
                            </span>
                        </div>
                    ))}

                    <div className={styles.addButtonContainer}>
                        <button
                            onClick={handleAdd}
                            className={styles.addBtn}
                            aria-label="新增聯絡方式"
                            disabled={loading}
                        >
                            新增聯絡方式
                        </button>
                    </div>
                </div>
            </div>

            {/* 操作按鈕 */}
            <div className={styles.buttonGroup}>
                <button
                    onClick={onCancel}
                    className={styles.cancelBtn}
                    disabled={loading}
                >
                    取消
                </button>
                <button
                    onClick={handleSave}
                    className={styles.saveBtn}
                    disabled={loading}
                >
                    {loading ? "儲存中..." : "儲存"}
                </button>
            </div>
        </div>
    );
}

export default EditMainLayout;
