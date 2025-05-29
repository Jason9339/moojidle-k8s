import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import LeftBar from "@/components/LeftBar/LeftBar.jsx";
import { GetnotificationData, DeleteNotification} from "@/services/NotificationApi.js";
import NotificationCard from "@/components/notification_components/NotificationCard.jsx";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchNotifications = async () => {
        try {
            const uid = JSON.parse(localStorage.getItem("user")).user_id;
            const data = await GetnotificationData(uid);
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError("無法載入通知資料");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSelectChange = (id, checked) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((n_id) => n_id !== id)
        );
    };

    const handleBatchDelete = async () => {
        if (selectedIds.length === 0) {
            alert("請先勾選欲刪除的通知");
            return;
        }

        const uid = JSON.parse(localStorage.getItem("user")).user_id;
        try {
            await Promise.all(
                selectedIds.map((n_id) =>
                    DeleteNotification({ n_id, user_id: uid })
                )
            );
            alert("已刪除選取的通知");
            fetchNotifications(); // 重新載入不使用 reload
            setSelectedIds([]);
        } catch (err) {
            alert("刪除失敗，請稍後再試");
        }
    };

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            <div className={styles["page-container"]}>
                <div className={styles["heading-row"]}>
                    <h2 className={styles["heading-title"]}>Notifications</h2>
                </div>
                <hr className={styles["heading-divider"]} />

                <div className={styles["button-row"]}>
                    <button className={styles["delete-button"]} onClick={handleBatchDelete}>
                        刪除選取項目
                    </button>
                </div>
                <div className={styles["main-container"]}>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : notifications.length === 0 ? (
                        <p>目前沒有通知。</p>
                    ) : (
                        notifications.map((item) => (
                            <NotificationCard
                                key={item._id}
                                item={item}
                                isSelected={selectedIds.includes(item.n_id)}
                                onSelectChange={handleSelectChange}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}


export default Notification;
