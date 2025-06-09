import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ToDoItem.module.css";

function ToDoItem({ todoList, courses }) {
    const Navigate = useNavigate();

    const courseMap = new Map(courses.map(course => [course.courseId, course]));

    const Show = (item) => {
        const course = courseMap.get(item.course_id);
        if (!course) {
            return false;
        }

        const now = new Date();
        const courseStartDate = new Date(course.start_date);
        const courseEndDate = new Date(courseStartDate);
        courseEndDate.setDate(courseStartDate.getDate() + course.week_num * 7);

        // 如果課程已過期，則不顯示
        if (now > courseEndDate) {
            return false;
        }

        return true;
    };

    // 判斷作業狀態
    const getAssignmentStatus = (assignment) => {
        const now = new Date();
        const dueDate = new Date(assignment.due);
        
        if (now > dueDate) {
            return { status: 'overdue', label: '遲交', cssClass: 'status-overdue' };
        } else {
            return { status: 'pending', label: '未繳交', cssClass: 'status-pending' };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("zh-TW", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    };

    return (
        <div>
            {todoList.map((item, index) => {
                const statusInfo = getAssignmentStatus(item);
                return Show(item) ? (
                    <div key={index} className={`${styles["todo-item"]}`} onClick={() => Navigate(`/course/${item.course_id}/assignment`)}>
                        <div className={styles["todo-title-row"]}>
                            <p className={`${styles["todo-title"]}`} title={item.title}>
                                {item.title}
                            </p>
                            <span className={`${styles["todo-status"]} ${styles[statusInfo.cssClass]}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                        <p className={`${styles["todo-course"]}`}>
                            {item.course}
                        </p>
                        <p className={`${styles["todo-meta-row"]}`}>
                            <span>截止：{formatDate(item.due)}</span>
                        </p>
                    </div>
                ) : null
            })}
        </div>
    );
}

export default ToDoItem;
