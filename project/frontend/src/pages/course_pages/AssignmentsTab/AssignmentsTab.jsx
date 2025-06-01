import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";

function AssignmentsTab() {
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