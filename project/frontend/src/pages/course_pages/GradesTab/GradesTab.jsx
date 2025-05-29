import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// api call
import { GetSimpleExams, UpdateExamScore } from "@/services/ExamApi";
import { GetSimpleCourseAssignments, UpdateAssignmentScore } from "@/services/AssignmentApi";
import { GetSubAssInCourse, GetOneStudentSubAssInCourse } from "@/services/SubmittedAssignApi";
import { GetTakenExamsInCourse, GetOneStudentTakenExamsInCourse } from "@/services/TakenExamApi";

// components
import SimpleGradeTable from "@/components/course_components/SimpleGradeTable/SimpleGradeTable";
import StudentsGradeTable from "@/components/course_components/StudentsGradeTable/StudentsGradeTable";

// css style
import styles from "./GradesTab.module.css";

function GradesTab() {
    const { role } = useOutletContext();
    let { courseId } = useParams();
    courseId = parseInt(courseId);
    const userId = (JSON.parse(localStorage.getItem("user"))).user_id;

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

    // teachers & assistants
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

    // students
    async function FetchOneSubAssigns(courseId) {
        try {
            const result = await GetOneStudentSubAssInCourse(courseId, userId);
            setSubAssignsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function FetchOneTakenExams(courseId) {
        try {
            const result = await GetOneStudentTakenExamsInCourse(courseId, userId);
            setTakenExamsData(result);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function SaveNewAssign(updatedAssigns) {
        try {
            // deep copying states
            let tempSimpleAssigns = structuredClone(simpleAssignsData);
            let tempSubAssigns = structuredClone(subAssignsData);

            // apply all updates through api
            for (let i = 0; i < updatedAssigns.length; i++) {
                const { assId, newMaxScore, newPercentage } = updatedAssigns[i];

                // Await API call
                await UpdateAssignmentScore(assId, {
                    max_score: newMaxScore,
                    percentage: newPercentage
                });

                // Update tempSimpleAssigns
                for (let j = 0; j < tempSimpleAssigns.length; j++) {
                    if (tempSimpleAssigns[j].ass_id === assId) {
                        tempSimpleAssigns[j].max_score = newMaxScore;
                        tempSimpleAssigns[j].percentage = newPercentage;
                        break;
                    }
                }

                // Update tempSubAssigns
                for (let j = 0; j < tempSubAssigns.length; j++) {
                    for (let k = 0; k < tempSubAssigns[j].sub_ass.length; k++) {
                        if (tempSubAssigns[j].sub_ass[k].ass_id === assId) {
                            tempSubAssigns[j].sub_ass[k].percentage = newPercentage;
                        }
                    }
                }
            }

            // write back instead of re-fetching
            setSimpleAssignsData(structuredClone(tempSimpleAssigns));
            setSubAssignsData(structuredClone(tempSubAssigns));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function SaveNewExam(updatedExams) {
        try {
            // deep copying states
            let tempSimpleExams = structuredClone(simpleExamsData);
            let tempTakenExams = structuredClone(takenExamsData);

            // apply all updates through api
            for (let i = 0; i < updatedExams.length; i++) {
                const { examId, newMaxScore, newPercentage } = updatedExams[i];

                // Await API call
                await UpdateExamScore(examId, {
                    max_score: newMaxScore,
                    percentage: newPercentage
                });

                // Update tempSimpleExams
                for (let j = 0; j < tempSimpleExams.length; j++) {
                    if (tempSimpleExams[j].exam_id === examId) {
                        tempSimpleExams[j].max_score = newMaxScore;
                        tempSimpleExams[j].percentage = newPercentage;
                        break;
                    }
                }

                // Update tempTakenExams
                for (let j = 0; j < tempTakenExams.length; j++) {
                    for (let k = 0; k < tempTakenExams[j].taken_exams.length; k++) {
                        if (tempTakenExams[j].taken_exams[k].exam_id === examId) {
                            tempTakenExams[j].taken_exams[k].percentage = newPercentage;
                        }
                    }
                }
            }

            // write back instead of re-fetching
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
        FetchSimpleAssigns(courseId);
        FetchSimpleExams(courseId);

        if (role.isStudent) {
            FetchOneSubAssigns(courseId);
            FetchOneTakenExams(courseId);
        } else {
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
    let studentGrades;

    // handle student cases:------------------------------------------------------------------------
    studentGrades = {
        ...subAssignsData,
        taken_exams: takenExamsData.taken_exams
    };
    // make it into an array of length of 1 for component to use
    studentGrades = [studentGrades];
    
    if (role.isStudent) {
        return (
            <>
                <div className={styles["grade-tab-container"]}>
                    <SimpleGradeTable
                        simpleGrades={simpleGrades}
                    />

                    <StudentsGradeTable
                        studentGrades={studentGrades}
                    />
                </div>
            </>
        );
    }

    // handle teacher and assistant cases:----------------------------------------------------------

    // since subAssignsData == [] iff takenExamsData == []
    studentGrades = subAssignsData.map(subAss => {
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
