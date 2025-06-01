import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";

import TeacherAssignmentReview from "@/components/course_components/TeacherAssignmentReview/TeacherAssignmentReview";


function AssIdHelper({ assignmentId, setAssignmentId }) {
    const handleAssignmentIdChange = (e) => {
        setAssignmentId(e.target.value);
    };
    
    return (
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="assignmentId">Assignment ID: </label>
            <input type="number" id="assignmentId" value={assignmentId} onChange={handleAssignmentIdChange} min="1" style={{ width: '60px', marginRight: '10px' }} />
        </div>
    );
}

function AssignmentsTab() {
    const { role } = useOutletContext();
    const [assignmentId, setAssignmentId] = useState("1");

    return (
        <div>
            <h3>作業列表</h3>
            <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
            
            {role.isTeacher && (       
                <>
                    <AssIdHelper assignmentId={assignmentId} setAssignmentId={setAssignmentId} />
                    <TeacherAssignmentReview assignmentId={assignmentId} />
                </>
            )}
        </div>
    );
}

export default AssignmentsTab;

    const { role, course } = useOutletContext();
    const [assignments, setAssignments] = useState([]);
    useEffect(() => {
        async function fetchAssignments() {
            const data = await GetCourseAssignments(course.courseId);
            setAssignments(data || []);
        }
        if (role.isTeacher || role.isAssistant) {
            fetchAssignments();
        }
    }, [course.courseId, role]);

    return (
        <div>
            {(role.isTeacher || role.isAssistant)
                ? <TeacherAssignment assignments={assignments} />
                : "學生"}
        </div>
    );
}
export default AssignmentsTab;
