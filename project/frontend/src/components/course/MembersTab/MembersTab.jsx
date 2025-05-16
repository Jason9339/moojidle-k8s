import React from 'react';

import { getCourseMembers, manualAddStudent, switchCharacter,getInviteCode  } from "@/services/CoursepageApi"
import { useEffect, useState } from 'react';
import styles from './MembersTab.module.css';

// 模擬目前登入的 user_id
// const currentUserId = 1;

function MembersTab({ courseId, userId }) {
    const [members, setMembers] = useState({
        students: [],
        assistants: [],
        teachers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ userId: '', studentId: '' });

    const [code, setCode] = useState(''); // 邀請碼


    const handleAddStudentFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!newStudent.userId || !newStudent.studentId) {
                setError('Please fill in all required fields.');
                return;
            }

            await manualAddStudent(courseId, newStudent.userId, newStudent.studentId);

            // Refresh the member list after adding
            fetchMembers();

            // Reset form and hide it
            setNewStudent({ userId: '', studentId: '' });
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            console.error('Error adding student:', err);
            setError('Failed to add student. Please check the information and try again.');
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };
    
    // Check if current user is a teacher or assistant
    const isTeacher = () => {
        if (!userId) return false;
        
        const userIdNum = parseInt(userId);
        const isTeacher = members.teachers?.some(teacher => teacher.user_id === userIdNum);
        return isTeacher;
    };

    const isAssistant = (stu_userId) => {
        if (!stu_userId) return false;
        
        const userIdNum = parseInt(stu_userId);
        const isAssistant = members.assistants?.some(assistant => assistant.user_id === userIdNum);
        return isAssistant;
    };

    const fetchMembers = async () => {
            try {
                setLoading(true);
                const data = await getCourseMembers(courseId);
                // console.log('Fetched course members:', data);
                setMembers(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching course members:', err);
                setError('Failed to load course members. Please try again later.');
            } finally {
                setLoading(false);
            }
    };
    const fetchCode = async () => {
        try {
            setLoading(true);
            const data = await getInviteCode(courseId);
            setCode(data.code);
            setError(null);
        } catch (err) {
            console.error('Error fetching course invite code:', err);
            setError('Failed to load course invite code. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {    
        fetchMembers();
        fetchCode();
    }, [courseId]);

    const handleMakeAssistant = async (userId) => {
        try {
            console.log("Change ", userId, " to assistant or student");
            await switchCharacter(userId, courseId);
            fetchMembers();
        } catch (err) {
            console.error('Error switching user role:', err);
            setError('Failed to update user role. Please try again.');
        }
    };


    return (
        <div className={`${styles["membersContainer"]}`}>
            <h3>助教與學生管理</h3>
            <h3>邀請碼：{code}</h3>

            {isTeacher() && false && (
                <div className={`${styles["addStudentSection"]}`}>
                    <button 
                        className={`${styles["addButton"]}`}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? '取消' : '手動加入學生'}
                    </button>
                    
                    {showAddForm && (
                        <form className={`${styles["addStudentForm"]}`} onSubmit={handleAddStudentFormSubmit}>
                            <div className={`${styles["formGroup"]}`}>
                                <label htmlFor="userId">User ID:</label>
                                <input
                                    type="text"
                                    id="userId"
                                    name="userId"
                                    value={newStudent.userId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className={`${styles["formGroup"]}`}>
                                <label htmlFor="studentId">學號:</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={newStudent.studentId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <button type="submit" className={`${styles["submitButton"]}`}>加入學生</button>
                        </form>
                    )}
                </div>
            )}


            {loading && <p className={`${styles["loading"]}`}>Loading course members...</p>}
            {error && <p className={`${styles["error"]}`}>{error}</p>}

            {!loading && !error && (
                <>
                    <div className={`${styles["memberSection"]}`}>
                        <h4>老師 ({members.teachers?.length || 0})</h4>
                        {members.teachers?.length > 0 ? (
                            <table className={`${styles["memberTable"]}`}>
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>Email</th>
                                        <th>聯絡方式</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.teachers?.map(teacher => (
                                        <tr key={teacher.user_id}>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.email}</td>
                                            <td>
                                                {Array.isArray(teacher.contact_ways) && teacher.contact_ways.length > 0 ? (
                                                    <div>
                                                        {teacher.contact_ways.map((contact, index) => (
                                                            <div key={index} className={`${styles["contactItem"]}`}>
                                                                <strong>{contact.approach}:</strong> {contact.details}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                        'N/A'
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                                <div className={`${styles["emptyState"]}`}>尚無教師</div>
                            )}
                    </div>

                    <div className={`${styles["memberSection"]}`}>
                        <h4>助教 ({members.assistants?.length || 0})</h4>
                        {members.assistants?.length > 0 ? (
                            <table className={`${styles["memberTable"]}`}>
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>Email</th>
                                        <th>聯絡方式</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.assistants?.map(assistant => (
                                        <tr key={assistant.user_id}>
                                            <td>{assistant.name}</td>
                                            <td>{assistant.email}</td>
                                            <td>
                                                {Array.isArray(assistant.contact_ways) && assistant.contact_ways.length > 0 ? (
                                                    <div>
                                                        {assistant.contact_ways.map((contact, index) => (
                                                            <div key={index} className={`${styles["contactItem"]}`}>
                                                                <strong>{contact.approach}:</strong> {contact.details}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                        'N/A'
                                                    )}
                                            </td>
                                            <td>
                                                {isTeacher() && (
                                                    <button className={`$"roleButton" $"removeButton"`} 
                                                        onClick={() => handleMakeAssistant(assistant.user_id)}>
                                                        移除助教權限
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}                                </tbody>
                            </table>
                        ) : (
                                <div className={`${styles["emptyState"]}`}>尚無助教</div>
                            )}
                    </div>

                    <div className={`${styles["memberSection"]}`}>
                        <h4>學生 ({members.students?.length || 0})</h4>
                        {members.students?.length > 0 ? (
                            <table className={`${styles["memberTable"]}`}>
                                <thead>
                                    <tr>
                                        <th>姓名</th>
                                        <th>Email</th>
                                        <th>學號</th>
                                        <th>聯絡方式</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {members.students?.map(student => (
                                        <tr key={student.user_id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.student_id}</td>
                                            <td>
                                                {Array.isArray(student.contact_ways) && student.contact_ways.length > 0 ? (
                                                    <div>
                                                        {student.contact_ways.map((contact, index) => (
                                                            <div key={index} className={`${styles["contactItem"]}`}>
                                                                <strong>{contact.approach}:</strong> {contact.details}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                        'N/A'
                                                    )}
                                            </td>
                                            <td>
                                                {isTeacher()  && !isAssistant(student.user_id)&& (
                                                <button className={`${styles["roleButton"]}`}
                                                    onClick={() => handleMakeAssistant(student.user_id)}>
                                                    設為助教
                                                </button>
                                                )}
                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                                <div className={`${styles["emptyState"]}`}>尚無學生</div>
                            )}
                    </div>
                </>
            )}
        </div>
    );
}
export default MembersTab;
