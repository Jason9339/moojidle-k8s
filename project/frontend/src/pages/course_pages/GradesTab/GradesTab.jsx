import { useOutletContext } from "react-router-dom";

function GradesTab() {
    const { role } = useOutletContext();
    return (
        <div>
            <h3>成績</h3>
            <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
        </div>
    );
}
export default GradesTab;
