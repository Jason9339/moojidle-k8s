import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// api call
import { GetSimpleExams, UpdateExamScore } from "@/services/ExamApi";
import { GetSimpleCourseAssignments, UpdateAssignmentScore } from "@/services/AssignmentApi";
import { GetSimpleSubAssInCourse, GetOneStudentSimpleSubAssInCourse } from "@/services/SubmittedAssignApi";
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
    const [isEditing, setIsEditing] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

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
            const result = await GetSimpleSubAssInCourse(courseId);
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
            const result = await GetOneStudentSimpleSubAssInCourse(courseId, userId);
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

    // editing functions
    const handleEditDone = () => {
        setIsCanceling(false);
        setIsEditing(false);
    };

    const handleEditCancel = () => {
        setIsCanceling(true);
        setIsEditing(false);
    };

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
            <div className={styles["grade-tab-container"]}>
                <button
                    className={styles["toggle-button"]}
                    onClick={ToggleShowSimpleGradeTable}
                >
                    <span className={styles["toggle-icon"]}>
                        {showSimpleGradeTable ? "−" : "+"}
                    </span>
                    <span className={styles["toggle-text"]}>
                        {showSimpleGradeTable ? "隱藏成績分配" : "顯示成績分配"}
                    </span>
                </button>

                <div
                    className={styles["section-block"]}
                    style={{ display: showSimpleGradeTable ? "block" : "none" }}
                >
                    <div className={styles["section-header"]}>
                        <div className={styles["section-title"]}>課程成績分配總覽</div>
                    </div>
                    <SimpleGradeTable simpleGrades={simpleGrades} />
                </div>

                <div className={styles["section-block"]}>
                    <div className={styles["section-header"]}>
                        <div className={styles["section-title"]}>學生成績詳情</div>
                    </div>
                    <StudentsGradeTable studentGrades={studentGrades} />
                </div>
            </div>
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
            <button
                className={`${styles["toggle-button"]} ${isEditing ? styles["toggle-disabled"] : ""}`}
                onClick={ToggleShowSimpleGradeTable}
                disabled={isEditing}
            >
                <span className={styles["toggle-icon"]}>
                    {showSimpleGradeTable ? "−" : "+"}
                </span>
                <span className={styles["toggle-text"]}>
                    {isEditing ? "編輯模式中..." : showSimpleGradeTable ? "隱藏評分設定" : "顯示評分設定"}
                </span>
            </button>

            <div
                className={styles["section-block"]}
                style={{ display: showSimpleGradeTable ? "block" : "none" }}
            >
                <div className={styles["section-header"]}>
                    <div className={styles["section-title"]}>⚙️ 課程評分設定</div>
                    {!role.isStudent && (
                        <div className={styles["edit-controls"]}>
                            {isEditing ? (
                                <>
                                    <button className={styles["cancel-button"]} onClick={handleEditCancel}>
                                        取消
                                    </button>
                                    <button className={styles["edit-button"]} onClick={handleEditDone}>
                                        完成
                                    </button>
                                </>
                            ) : (
                                <button className={styles["edit-button"]} onClick={() => setIsEditing(true)}>
                                    <img src="/icons/pencil.png" className={styles["edit-icon"]} alt="Edit" />
                                    編輯
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <SimpleGradeTable
                    simpleGrades={simpleGrades}
                    isCanceling={isCanceling}
                    isEditing={isEditing}
                    SaveNewAssign={SaveNewAssign}
                    SaveNewExam={SaveNewExam}
                />
            </div>

            <div className={styles["section-block"]}>
                <div className={styles["section-header"]}>
                    <div className={styles["section-title"]}>👥 學生成績總覽</div>
                </div>
                <StudentsGradeTable studentGrades={studentGrades} />
            </div>
        </div>
    );
}

export default GradesTab;
