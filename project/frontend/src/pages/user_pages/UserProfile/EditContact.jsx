import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserDataById, EditUserData } from "@/services/UserApi";
import Button from "@/components/Button/Button";
import LeftBar from "@/components/LeftBar/LeftBar";
import styles from "./EditContact.module.css";

function EditContact() {
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const [contactWays, setContactWays] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await GetUserDataById(userId);
                const existing = data.contact_ways || [];
                setContactWays(existing.length > 0 ? existing : [{ approach: "", details: "" }]);
            } catch (e) {
                setError("無法載入聯絡資訊。");
            }
        }
        fetchData();
    }, [userId]);


    const handleContactChange = (index, field, value) => {
        const updated = [...contactWays];
        updated[index][field] = value;
        setContactWays(updated);
    };

    const handleAddContact = () => {
        setContactWays([...contactWays, { approach: "", details: "" }]);
    };

    const handleRemoveContact = (index) => {
        const updated = [...contactWays];
        updated.splice(index, 1);
        setContactWays(updated);
    };

    const handleSave = async () => {
        try {
            const validContactWays = contactWays
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

            if (validContactWays.length === 0) {
                setError("請至少填寫一筆有效的聯絡方式");
                return;
            }

            console.log("✔ 要送出的 contact_ways:", validContactWays);

            await EditUserData(userId, { contactWays });
            navigate("/user/profile");
        } catch (e) {
            console.error("❌ 更新失敗:", e?.response?.data || e.message);
            setError("更新失敗，請確認資料格式。");
        }
    };


    const handleCancel = () => {
        navigate("/user/profile");
    };

    return (
        <div className="flex">
            <LeftBar />
            <div className={styles.container}>
                <h2 className={styles.heading}>編輯聯絡方式</h2>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.form}>
                    {contactWays.map((contact, index) => (
                        <div key={index} className={styles.contactRow}>
                            <input
                                type="text"
                                placeholder="方式 (如 Discord)"
                                value={contact.approach}
                                onChange={(e) => handleContactChange(index, "approach", e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="詳細資訊"
                                value={contact.details}
                                onChange={(e) => handleContactChange(index, "details", e.target.value)}
                                className={styles.input}
                            />
                            <button
                                className={styles.removeButton}
                                onClick={() => handleRemoveContact(index)}
                            >
                                移除
                            </button>
                        </div>
                    ))}
                    <button onClick={handleAddContact} className={styles.addButton}>+ 新增聯絡方式</button>
                    <div className={styles.actions}>
                        <Button onClick={handleCancel} className="bg-gray-300 text-gray-800">取消</Button>
                        <Button onClick={handleSave} className="bg-blue-600 text-white">儲存</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditContact;
