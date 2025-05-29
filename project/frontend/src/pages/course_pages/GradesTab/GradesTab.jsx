import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// api call
import { GetSimpleExams, UpdateExamScore } from "@/services/ExamApi";
import { GetSimpleCourseAssignments, UpdateAssignmentScore } from "@/services/AssignmentApi";
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

    const [showSimpleGradeTable, setShowSimpleGradeTable] = useState(true);

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

    async function SaveNewAssign(assId, newMaxScore, newPercentage) {
        try {
            const newScore = {
                max_score: newMaxScore,
                percentage: newPercentage
            }
            await UpdateAssignmentScore(assId, newScore);

            // update frontend state instead of re-fetching
            let tempSimpleAssigns = structuredClone(simpleAssignsData);
            let tempSubAssigns = structuredClone(subAssignsData);

            for (let i = 0; i < tempSimpleAssigns.length; i++) {
                if (tempSimpleAssigns[i].ass_id == assId) {
                    tempSimpleAssigns[i].max_score = newMaxScore;
                    tempSimpleAssigns[i].percentage = newPercentage;
                }
            }

            for (let i = 0; i < tempSubAssigns.length; i++) {
                // for each students
                for (let j = 0; j < tempSubAssigns[i].sub_ass.length; j++) {
                    // for each submitted assigns that student has
                    if (tempSubAssigns[i].sub_ass[j].ass_id == assId) {
                        tempSubAssigns[i].sub_ass[j].percentage = newPercentage;
                    }
                }
            }

            // write back
            setSimpleAssignsData(structuredClone(tempSimpleAssigns));
            setSubAssignsData(structuredClone(tempSubAssigns));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function SaveNewExam(examId, newMaxScore, newPercentage) {
        try {
            const newScore = {
                max_score: newMaxScore,
                percentage: newPercentage
            }
            await UpdateExamScore(examId, newScore);

            // update frontend state instead of re-fetching
            let tempSimpleExams = structuredClone(simpleExamsData);
            let tempTakenExams = structuredClone(takenExamsData);

            for (let i = 0; i < tempSimpleExams.length; i++) {
                if (tempSimpleExams[i].exam_id == examId) {
                    tempSimpleExams[i].max_score = newMaxScore;
                    tempSimpleExams[i].percentage = newPercentage;
                }
            }

            for (let i = 0; i < tempTakenExams.length; i++) {
                // for each students
                for (let j = 0; j < tempTakenExams[i].taken_exams.length; j++) {
                    // for each submitted assigns that student has
                    if (tempTakenExams[i].taken_exams[j].exam_id == examId) {
                        tempTakenExams[i].taken_exams[j].percentage = newPercentage;
                    }
                }
            }

            // write back
            setSimpleExamsData(structuredClone(tempSimpleExams));
            setTakenExamsData(structuredClone(tempTakenExams));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // function
    function ToggleShowSimpleGradeTable() {
        setShowSimpleGradeTable(prev => !prev);
    }

    useEffect(() => {
        if (role.isStudent) {
            FetchSimpleAssigns(courseId);
            FetchSimpleExams(courseId);
            setSubAssignsData(-1);
            setTakenExamsData(-1);
        } else {
            FetchSimpleAssigns(courseId);
            FetchSimpleExams(courseId);
            FetchSubAssigns(courseId);
            FetchTakenExams(courseId);
        }
    }, []);

    // data hasn't fully arrived
    if (!simpleAssignsData || !simpleExamsData || !subAssignsData || !takenExamsData) {
        return (
            <>
                {/* show nothing */}
            </>
        );
    }

    // merge data (assigns + exam)
    let simpleGrades = [...simpleAssignsData, ...simpleExamsData];

    if (role.isStudent) {
        return (
            <>
                <div className={styles["grade-tab-container"]}>
                    <SimpleGradeTable
                        simpleGrades={simpleGrades}
                    />
                </div>
            </>
        );
    }

    // since subAssignsData == [] iff takenExamsData == []
    let studentGrades = subAssignsData.map(subAss => {
        const matchTakenExam = takenExamsData.find(examUser => examUser.user_id == subAss.user_id);
        return {
            ...subAss,
            taken_exams: matchTakenExam.taken_exams,
        };
    });

    return (
        <div className={styles["grade-tab-container"]}>
            <button className={styles["toggle-button"]} onClick={ToggleShowSimpleGradeTable}>
                {showSimpleGradeTable ? "−" : "+"}
            </button>

            {showSimpleGradeTable ? (
                <SimpleGradeTable
                    simpleGrades={simpleGrades}
                    canEdit={!role.isStudent}

                    // call backs
                    SaveNewAssign={SaveNewAssign}
                    SaveNewExam={SaveNewExam}
                />
            ) : null}

            <StudentsGradeTable
                studentGrades={studentGrades}
            />
        </div>
    );
}

export default GradesTab;
