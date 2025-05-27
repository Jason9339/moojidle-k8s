import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// api call
import { GetSimpleExams } from "@/services/ExamApi";
import { GetSimpleCourseAssignments } from "@/services/AssignmentApi";
import { GetSubAssInCourse } from "@/services/SubmittedAssignApi";
import { GetTakenExamsInCourse } from "@/services/TakenExamApi";

// components
import SimpleGradeTable from "@/components/course_components/SimpleGradeTable/SimpleGradeTable";
import StudentsGradeTable from "@/components/course_components/StudentsGradeTable/StudentsGradeTable";

// css style
import styles from "./GradesTab.module.css";

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

    // data hasn't fully arrived
    if (!simpleAssignsData || !simpleExamsData || !subAssignsData || !takenExamsData) {
        return (
            <>
                {/* show nothing */}
            </>
        );
    }

    // console.error(simpleAssignsData);
    // console.error(simpleExamsData);
    // console.error(subAssignsData);
    // console.error(takenExamsData);
    // console.error(role);

    // merge data (assigns + exam)
    let simpleGrades = [...simpleAssignsData, ...simpleExamsData];

    let studentGrades = subAssignsData.map(subAss => {
        const matchTakenExam = takenExamsData.find(examUser => examUser.user_id == subAss.user_id);
        return {
            ...subAss,
            taken_exams: matchTakenExam.taken_exams,
        };
    });

    return (
        <>
            <div className={styles["grade-tab-container"]}>
                {/* <button className={styles["toggle-button"]}>
                    &#9660;
                </button> */}

                <SimpleGradeTable 
                    simpleGrades = {simpleGrades}
                />

                <StudentsGradeTable
                    studentGrades = {studentGrades}
                />
            </div>
        </>
    );
}

export default GradesTab;
