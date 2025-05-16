import React, { useEffect, useState } from 'react';
import {
  getCourseMembers,
  manualAddStudent,
  switchCharacter,
  getInviteCode,
} from '@/services/coursepage_api/CoursepageApi';
import styles from './MembersTab.module.css';

function MembersTab({ courseId, userId }) {
  const [members, setMembers] = useState({ students: [], assistants: [], teachers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ userId: '', studentId: '' });
  const [code, setCode] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getCourseMembers(courseId);
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching course members:', err);
      setError('無法載入課程成員，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const fetchCode = async () => {
    try {
      const data = await getInviteCode(courseId);
      setCode(data.code);
    } catch (err) {
      console.error('Error fetching invite code:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchCode();
  }, [courseId]);

  const handleAddStudentFormSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.userId || !newStudent.studentId) {
      setError('請填寫所有欄位');
      return;
    }
    try {
      await manualAddStudent(courseId, newStudent.userId, newStudent.studentId);
      fetchMembers();
      setNewStudent({ userId: '', studentId: '' });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding student:', err);
      setError('加入學生失敗，請檢查輸入資料。');
    }
  };

  const handleMakeAssistant = async (userId) => {
    try {
      await switchCharacter(userId, courseId);
      fetchMembers();
    } catch (err) {
      console.error('Error switching user role:', err);
      setError('無法變更角色，請稍後再試。');
    }
  };

  const isTeacher = () => {
    return members.teachers?.some((t) => t.user_id === parseInt(userId));
  };

  const isAssistant = (uid) => {
    return members.assistants?.some((a) => a.user_id === parseInt(uid));
  };

  const renderMemberTable = (title, list, isStudent = false, showSwitch = false) => (
    <div className={styles.memberSection}>
      <h4>{title} ({list?.length || 0})</h4>
      {list?.length > 0 ? (
        <table className={styles.memberTable}>
          <thead>
            <tr>
              <th>姓名</th>
              <th>Email</th>
              {isStudent && <th>學號</th>}
              <th>聯絡方式</th>
              {showSwitch && <th>操作</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr key={user.user_id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {isStudent && <td>{user.student_id}</td>}
                <td>
                  {Array.isArray(user.contact_ways) && user.contact_ways.length > 0 ? (
                    user.contact_ways.map((contact, idx) => (
                      <div key={idx} className={styles.contactItem}>
                        <strong>{contact.approach}:</strong> {contact.details}
                      </div>
                    ))
                  ) : (
                    'N/A'
                  )}
                </td>
                {showSwitch && (
                  <td>
                    {isStudent && !isAssistant(user.user_id) && (
                      <button
                        className={styles.roleButton}
                        onClick={() => handleMakeAssistant(user.user_id)}
                      >
                        設為助教
                      </button>
                    )}
                    {!isStudent && (
                      <button
                        className={`${styles.roleButton} ${styles.removeButton}`}
                        onClick={() => handleMakeAssistant(user.user_id)}
                      >
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
      <h3>成員管理</h3>
      <div className={styles.inviteCodeBox}>
        <strong>課程邀請碼：</strong> <code>{code}</code>
      </div>

      {isTeacher() && (
        <div className={styles.addStudentSection}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '取消' : '手動加入學生'}
          </button>

          {showAddForm && (
            <form className={styles.addStudentForm} onSubmit={handleAddStudentFormSubmit}>
              <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
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
              <button type="submit" className={styles.submitButton}>加入學生</button>
            </form>
          )}
        </div>
      )}

      {loading && <p className={styles.loading}>載入中...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          {renderMemberTable('老師', members.teachers)}
          {renderMemberTable('助教', members.assistants, false, isTeacher())}
          {renderMemberTable('學生', members.students, true, isTeacher())}
        </>
      )}
    </div>
  );
}

export default MembersTab;
