import { useState } from "react";
import { useOutletContext } from "react-router-dom";

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

