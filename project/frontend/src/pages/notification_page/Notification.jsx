import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import LeftBar from "@/components/LeftBar/LeftBar.jsx";
import { useNavigate } from "react-router-dom";

import { GetnotificationData, DeleteNotification, ReadNotification } from "@/services/NotificationApi.js";
import NotificationCard from "@/components/notification_components/NotificationCard.jsx";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterCategory, setFilterCategory] = useState("all");
    const navigate = useNavigate();
    

    const categoryMap = {
        all: "全部",
        course: "課程",
        post: "討論版",
        course_status: "課程身分",
        course_announcement: "課程公告",
        login: "登入",
        commend: "新留言",
        homework: "作業",
        score: "成績",
        test: "考試",
    };

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
            fetchNotifications();
            setSelectedIds([]);
        } catch (err) {
            alert("刪除失敗，請稍後再試");
        }
    };

    const handleBatchClick = async (item) => {
        console.log(item);
        try {
            ReadNotification({
                n_id: item.n_id,
                user_id: item.user_id
            })
            switch (item.notification.event_category) {
                case "commend":
                    navigate(`/post/${item.notification.event_id}`);
                case "login":
                    navigate(`/user/profile`);    
                case "course":
                    navigate(`/course/${item.notification.event_id}`);  
            }
        } catch (err) {
            alert("刪除失敗，請稍後再試");
        }
    };

    const filteredNotifications = filterCategory === "all"
        ? notifications
        : notifications.filter((item) => item.notification.event_category === filterCategory);

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            <div className={styles["page-container"]}>
                <div className={styles["notification-left"]}>
                    <div className={styles["notification-heading-row"]}>
                        <h2 className={styles["notification-heading"]}>Notifications</h2>

                        <div className={styles["filter-row"]}>
                            <select
                                className={styles["category-select"]}
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {Object.entries(categoryMap).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            <button className={styles["delete-button"]} onClick={handleBatchDelete}>
                                刪除選取項目
                            </button>
                        </div>
                    </div>
                    <hr className={styles["heading-divider"]} />

                    <div className={styles["main-container"]}>
                        {error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredNotifications.length === 0 ? (
                            <p>目前沒有通知。</p>
                        ) : (
                            filteredNotifications.map((item) => (
                                <NotificationCard
                                    key={item._id}
                                    item={item}
                                    isSelected={selectedIds.includes(item.n_id)}
                                    onSelectChange={handleSelectChange}
                                    categoryMap={categoryMap} // 把 categoryMap 傳下去
                                    onClick={(item) => handleBatchClick(item)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification;
