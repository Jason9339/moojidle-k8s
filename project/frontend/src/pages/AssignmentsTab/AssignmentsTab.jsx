import { useOutletContext } from "react-router-dom";

function AssignmentsTab() {
    const { role } = useOutletContext();
    return (
        <div>
            <h3>作業列表</h3>
            <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
        </div>
    );
}
export default AssignmentsTab;
