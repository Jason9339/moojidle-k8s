import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";




function AssignmentsTab() {
    const { role, course } = useOutletContext();
    const [TeacherAssignments, setTeacherAssignments] = useState([]);

    // Get the Teacher assignment
    useEffect(() => {
        async function fetchTeacherAssignments() {
            const data = await GetCourseAssignments(course.courseId);
            setTeacherAssignments(data || []);
        }
        if (role.isTeacher || role.isAssistant) {
            fetchTeacherAssignments();
        }
    }, [course.courseId, role]);



    return (
        <div>
            <div>
                {(role.isTeacher || role.isAssistant)
                    ? <TeacherAssignment assignments={TeacherAssignments} />
                    : "學生"}
            </div>
        </div>
    );
}


export default AssignmentsTab;
