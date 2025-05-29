import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import LeftBar from "@/components/LeftBar/LeftBar.jsx";
import { GetnotificationData, DeleteNotification} from "@/services/NotificationApi.js";
import NotificationCard from "@/components/notification_components/NotificationCard.jsx";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

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

    const handleDelete = async (notificationId) => {
        try {
            const uid = JSON.parse(localStorage.getItem("user")).user_id;
            const body = {
                n_id: notificationId,
                user_id: uid
            };
            await DeleteNotification(body); 
            alert("刪除成功");
            window.location.reload(); // 重新載入頁面
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
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notification;
