import { useOutletContext } from "react-router-dom";

import TeacherAssignmentReview from "@/components/course_components/TeacherAssignmentReview/TeacherAssignmentReview";

function AssignmentsTab() {
    const { role } = useOutletContext();

    // Mock data with additional fields for the new table format
    const mockSubmissions = [
        { 
            studentName: "王小明", 
            submissionDate: "2023-11-01", 
            status: "Graded", 
            grade: "85", 
            description: "Teacher, Fuck off!!!"
        },
        { 
            studentName: "李小華", 
            submissionDate: "2023-11-02", 
            status: "Pending", 
            grade: "-", 
            description: ""
        }
    ];


    return (
        <div>
            <h3>作業列表</h3>
            <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
                {role.isTeacher && <TeacherAssignmentReview assignmentId="1" submissions={mockSubmissions} />}
        </div>
    );
}
export default AssignmentsTab;

