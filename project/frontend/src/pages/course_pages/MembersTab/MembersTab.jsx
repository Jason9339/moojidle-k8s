import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
    GetCourseMembers,
    ManualAddStudent,
    SwitchCharacter,
    GetInviteCode,
} from "@/services/CourseApi";
import styles from "./MembersTab.module.css";

export default function MembersPage() {
    const { courseId } = useParams();
    const { role } = useOutletContext();
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const isTeacher = role?.isTeacher;

    const [members, setMembers] = useState({ students: [], assistants: [], teachers: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ userId: "", studentId: "" });
    const [code, setCode] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [memberData, inviteCode] = await Promise.all([
                    GetCourseMembers(courseId),
                    GetInviteCode(courseId),
                ]);
                setMembers(memberData);
                setCode(inviteCode);
            } catch (err) {
                console.error("Error loading data:", err);
                setError("無法載入課程成員資訊");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [courseId]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!newStudent.userId || !newStudent.studentId) return setError("請填寫所有欄位");

        try {
            await ManualAddStudent(courseId, newStudent.userId, newStudent.studentId);
            setNewStudent({ userId: "", studentId: "" });
            setShowAddForm(false);
            setError(null);
            setMembers(await GetCourseMembers(courseId));
        } catch (err) {
            console.error("加入學生失敗:", err);
            setError("加入學生失敗，請確認資料");
        }
    };

    const handleSwitchRole = async (uid) => {
        try {
            await SwitchCharacter(uid, courseId);
            setMembers(await GetCourseMembers(courseId));
        } catch (err) {
            console.error("切換角色失敗:", err);
            setError("無法切換角色");
        }
    };

    const isAssistant = (uid) => members.assistants?.some(a => a.user_id === parseInt(uid));

    const renderTable = (title, list, isStudent = false, showSwitch = false) => (
        <div className={styles.memberSection}>
            <h4 className={styles.memberTitle}>{title} ({list?.length || 0})</h4>
            {list?.length > 0 ? (
                <table className={styles.memberTable}>
                    <thead>
                        <tr>
                            <th>姓名</th><th>Email</th>{isStudent && <th>學號</th>}<th>聯絡方式</th>{showSwitch && <th>操作</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {isStudent && <td>{user.student_id}</td>}
                                <td>
                                    {(user.contact_ways?.length > 0)
                                        ? user.contact_ways.map((c, i) => (
                                            <div key={i} className={styles.contactItem}>
                                                <strong>{c.approach}:</strong> {c.details}
                                            </div>
                                        ))
                                        : "N/A"}
                                </td>
                                {showSwitch && (
                                    <td>
                                        {isStudent && !isAssistant(user.user_id) ? (
                                            <button className={styles.roleButton} onClick={() => handleSwitchRole(user.user_id)}>
                                                設為助教
                                            </button>
                                        ) : (
                                            <button className={`${styles.roleButton} ${styles.removeButton}`} onClick={() => handleSwitchRole(user.user_id)}>
                                                移除助教權限
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>尚無{title}</div>
            )}
        </div>
    );

    return (
        <div className={styles.membersContainer}>
            <h3 className={styles.sectionTitle}>成員管理</h3>
            <div className={styles.inviteCodeBox}>
                <strong>課程邀請碼：</strong> <code>{code}</code>
            </div>

            {isTeacher && (
                <div className={styles.addStudentSection}>
                    <button className={styles.addButton} onClick={() => setShowAddForm(prev => !prev)}>
                        {showAddForm ? "取消" : "手動加入學生"}
                    </button>
                    {showAddForm && (
                        <form className={styles.addStudentForm} onSubmit={handleAddStudent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="userId">User ID:</label>
                                <input type="text" name="userId" value={newStudent.userId} onChange={e => setNewStudent(prev => ({ ...prev, userId: e.target.value }))} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="studentId">學號:</label>
                                <input type="text" name="studentId" value={newStudent.studentId} onChange={e => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))} />
                            </div>
                            <button type="submit" className={styles.submitButton}>加入學生</button>
                        </form>
                    )}
                </div>
            )}

            {loading && <p className={styles.loading}>載入中...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
                <>
                    {renderTable("老師", members.teachers)}
                    {renderTable("助教", members.assistants, false, isTeacher)}
                    {renderTable("學生", members.students?.filter(s => !members.assistants?.some(a => a.user_id === s.user_id)), true, isTeacher)}
                </>
            )}
        </div>
    );
}
