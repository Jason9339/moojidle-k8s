import { useOutletContext } from "react-router-dom";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";

function AssignmentsTab() {
    const { role, course } = useOutletContext();
    return (
        <div>
            {(role.isTeacher || role.isAssistant)
                ? <TeacherAssignment courseId={course.courseId} />
                : "學生"}
        </div>
    );
}
export default AssignmentsTab;
