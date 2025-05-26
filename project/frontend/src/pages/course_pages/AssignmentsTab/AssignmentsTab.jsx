import { useOutletContext } from "react-router-dom";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/TeacherAssignment";

function AssignmentsTab() {
    const { role } = useOutletContext();
    return (
        <div>
            {role.isTeacher ?  <TeacherAssignment />: role.isAssistant ? <TeacherAssignment />: "學生"}
        </div>
    );
}
export default AssignmentsTab;
