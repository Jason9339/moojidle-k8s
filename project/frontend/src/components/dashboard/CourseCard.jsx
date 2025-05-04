import React from 'react';
import '@/styles/CourseCard.css';
import { useNavigate } from 'react-router-dom';
import { FaBullhorn, FaTasks, FaComments } from 'react-icons/fa';

function CourseCard({ title, courseId, color }) {
  const navigate = useNavigate();

  return (
    <div className="course-card" style={{ backgroundColor: color }}>
      <div>
        <p className="course-id">{courseId}</p>
        <h4 className="course-title">{title}</h4>
      </div>
      <div className="course-footer">
        <FaBullhorn title="Announcement" onClick={() => navigate(`/courses/${courseId}/announcements`)} />
        <FaTasks title="Assignments" onClick={() => navigate(`/courses/${courseId}/assignments`)} />
        <FaComments title="Discussion" onClick={() => navigate(`/courses/${courseId}/discussions`)} />
      </div>
    </div>
  );
}

export default CourseCard;