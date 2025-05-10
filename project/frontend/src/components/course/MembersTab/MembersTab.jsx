import React from 'react';

import { getCourseMembers } from "@/services/CoursepageApi"
import { useEffect, useState } from 'react';
import * as styles from './MembersTab.css';



function MembersTab({ courseId }) {
    const [members, setMembers] = useState({
        students: [],
        assistants: [],
        teachers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const data = await getCourseMembers(courseId);
                console.log('Fetched course members:', data);
                setMembers(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching course members:', err);
                setError('Failed to load course members. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [courseId]);

    const handleMakeAssistant = async (userId) => {
        try {
            console.log("Change ", userId, " to assistant or student");
            // await axios.post(`/api/course/member/switch/${userId}/${courseId}`);
            // // Refresh the member lists after switching
            // const response = await axios.get(`/api/course/member/${courseId}`);
            // setMembers(response.data);

        } catch (err) {
            console.error('Error switching user role:', err);
            setError('Failed to update user role. Please try again.');
        }
    };




    return (
        <div className={styles.membersContainer}>
            <h3>助教與學生管理</h3>

            {loading && <p className={styles.loading}>Loading course members...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
                <>
                    <div className={styles.memberSection}>
                        <h4>老師 ({members.teachers?.length || 0})</h4>
                        {members.teachers?.length > 0 ? (
                            <table className={styles.memberTable}>
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
                                                            <div key={index} className={styles.contactItem}>
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
                                <div className={styles.emptyState}>尚無教師</div>
                            )}
                    </div>

                    <div className={styles.memberSection}>
                        <h4>助教 ({members.assistants?.length || 0})</h4>
                        {members.assistants?.length > 0 ? (
                            <table className={styles.memberTable}>
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
                                                            <div key={index} className={styles.contactItem}>
                                                                <strong>{contact.approach}:</strong> {contact.details}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                        'N/A'
                                                    )}
                                            </td>
                                            <td>
                                                <button className={`${styles.roleButton} ${styles.removeButton}`} 
                                                    onClick={() => handleMakeAssistant(assistant.user_id)}>
                                                    移除助教權限
                                                </button>
                                            </td>
                                        </tr>
                                    ))}                                </tbody>
                            </table>
                        ) : (
                                <div className={styles.emptyState}>尚無助教</div>
                            )}
                    </div>

                    <div className={styles.memberSection}>
                        <h4>學生 ({members.students?.length || 0})</h4>
                        {members.students?.length > 0 ? (
                            <table className={styles.memberTable}>
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
                                                            <div key={index} className={styles.contactItem}>
                                                                <strong>{contact.approach}:</strong> {contact.details}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                        'N/A'
                                                    )}
                                            </td>
                                            <td>
                                                <button className={styles.roleButton}
                                                    onClick={() => handleMakeAssistant(student.user_id)}>
                                                    設為助教
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                                <div className={styles.emptyState}>尚無學生</div>
                            )}
                    </div>
                </>
            )}
        </div>
    );
}
export default MembersTab;
