import { useOutletContext } from "react-router-dom";
import AssignmentsStudentsTab from "@/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab";

function AssignmentsTab() {
    const { role, course } = useOutletContext();
    // 只顯示學生畫面
    if (!role.isTeacher && !role.isAssistant) {
        return (
            <div>
                <AssignmentsStudentsTab courseId={course?.courseId} />
            </div>
        );
    }
    // 其他身分暫不顯示內容
    return (
        <div>
            <h3>作業列表（教師/助教）</h3>
            <p>身分: {role.isTeacher ? "教師" : "助教"}</p>
        </div>
    );
}
export default AssignmentsTab;
