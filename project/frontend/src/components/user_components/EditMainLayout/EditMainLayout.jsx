import React, { useState } from 'react';
import styles from "./EditMainLayout.module.css";
import { UpdateUserData } from "@/services/UserApi";
import { HiXMark } from "react-icons/hi2";

function EditMainLayout({ contact_ways = [], onSave, onCancel }) {
    const [contacts, setContacts] = useState(contact_ways);
    const [loading, setLoading] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

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

            // 檢查資料是否有變更
            const isDataChanged = JSON.stringify(validContacts) !== JSON.stringify(contact_ways);

            if (!isDataChanged && validContacts.length === 0) {
                alert("請至少添加一個聯絡方式");
                return;
            }

            if (!isDataChanged) {
                alert("資料未更改");
                return;
            }

            await UpdateUserData(userId, { contactWays: validContacts });
            onSave(validContacts);
        } catch (err) {
            console.error("儲存失敗:", err);
            alert("儲存失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={loading ? styles.loading : ''}>
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
        </div>
    );
}

export default EditMainLayout;