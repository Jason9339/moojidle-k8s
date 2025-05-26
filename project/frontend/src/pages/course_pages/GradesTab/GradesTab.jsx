import { useOutletContext } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// api call
import { GetSimpleExams } from "@/services/ExamApi";
import { GetSimpleCourseAssignments } from "@/services/AssignmentApi";
import { GetSubAssInCourse } from "@/services/SubmittedAssignApi";
import { GetTakenExamsInCourse } from "@/services/TakenExamApi";

function GradesTab() {
    const { role } = useOutletContext();
    let { courseId } = useParams();
    courseId = parseInt(courseId);

    // use states
    const [simpleAssignsData, setSimpleAssignsData] = useState(null);
    const [simpleExamsData, setSimpleExamsData] = useState(null);
    const [subAssignsData, setSubAssignsData] = useState(null);
    const [takenExamsData, setTakenExamsData] = useState(null);

    // fetching async functions
    async function FetchSimpleAssigns(courseId) {
        try {
            const result = await GetSimpleCourseAssignments(courseId);
            setSimpleAssignsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function FetchSimpleExams(courseId) {
        try {
            const result = await GetSimpleExams(courseId);
            setSimpleExamsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function FetchSubAssigns(courseId) {
        try {
            const result = await GetSubAssInCourse(courseId);
            setSubAssignsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function FetchTakenExams(courseId) {
        try {
            const result = await GetTakenExamsInCourse(courseId);
            setTakenExamsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    useEffect(() => {
        FetchSimpleAssigns(courseId);
        FetchSimpleExams(courseId);
        FetchSubAssigns(courseId);
        FetchTakenExams(courseId);
    }, []);

    if (!simpleAssignsData || !simpleExamsData || !subAssignsData) {
        return (
            <div>
                <h3>成績</h3>
                <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
            </div>
        );
    }

    // console.error(simpleAssignsData);
    // console.error(simpleExamsData);
    // console.error(subAssignsData);
    // console.error(takenExamsData);

    return (
        <div>
            <h3>成績</h3>
            <p>身分: {role.isTeacher ? "老師" : role.isAssistant ? "助教" : "學生"}</p>
        </div>
    );
}
export default GradesTab;
