import React, { useState } from 'react';
import styles from "./EditMainLayout.module.css";
import { UpdateUserData } from "@/services/UserApi";
// import { IoAddCircle } from "react-icons/io5";
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

            if (!isDataChanged) {
                alert("資料未更改或有空缺欄位");
                return;
            }

            await UpdateUserData(userId, { contactWays: validContacts });
            onSave(validContacts);
        } catch (err) {
            alert("儲存失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.contactList}>
                {contacts.map((contact, idx) => (
                    <li key={idx} className={styles.contactItem}>
                        <span
                            onClick={() => handleRemove(idx)}
                            className={styles.removeIcon}
                            role="button"
                            aria-label="移除聯絡方式"
                        >
                            ×
                        </span>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                value={contact.approach}
                                onChange={e => handleChange(idx, 'approach', e.target.value)}
                                placeholder="Type (e.g. email, phone)"
                                className={styles.input}
                            />
                            <input
                                type="text"
                                value={contact.details}
                                onChange={e => handleChange(idx, 'details', e.target.value)}
                                placeholder="Details"
                                className={styles.input}
                            />
                        </div>
                    </li>
                ))}
                <li className={styles.contactItem}>
                    <div className={styles.inputGroup}>
                        <button onClick={handleAdd} className={styles.addBtn} aria-label="新增聯絡方式">
                            +
                        </button>
                    </div>
                </li>
                <li className={styles.contactItem}>
                    <div className={styles.buttonGroup}>
                        <button onClick={onCancel} className={styles.cancelBtn}>取消</button>
                        <button onClick={handleSave} className={styles.saveBtn}>儲存</button>
                    </div>
                </li>
            </div>
        </div>
    );
}

export default EditMainLayout;