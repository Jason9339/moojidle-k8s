import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";

import TeacherAssignmentReview from "@/components/course_components/TeacherAssignmentReview/TeacherAssignmentReview";



function AssignmentsTab() {
    const { role, course } = useOutletContext();
    const [assignments, setAssignments] = useState([]);

    // Get the assignment
    useEffect(() => {
        async function fetchAssignments() {
            const data = await GetCourseAssignments(course.courseId);
            setAssignments(data || []);
        }
        if (role.isTeacher || role.isAssistant) {
            fetchAssignments();
        }
    }, [course.courseId, role]);

    // Get the submission of assignment


    return (
        <div>
            <h3>作業列表</h3>
            <div>
                {(role.isTeacher || role.isAssistant)
                    ? <TeacherAssignment assignments={assignments} />
                    : "學生"}
            </div>
        </div>
    );
}


export default AssignmentsTab;
