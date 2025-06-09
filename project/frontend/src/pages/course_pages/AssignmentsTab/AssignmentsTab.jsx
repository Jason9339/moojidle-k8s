import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TeacherAssignment from "@/components/course_components/TeacherAssignment/ControlWhichAss/TeacherAssignment";
import AssignmentsStudentsTab from "@/components/course_components/AssignmentStudentTab/AssignmentsStudentsTab";
import { GetCourseAssignments, DownloadAssignment } from "@/services/AssignmentApi";
import { GetTheAssignSubAssForOneStuednt } from "@/services/SubmittedAssignApi";
import { useAlert } from "@/utils/alert/AlertContext";



function AssignmentsTab() {
    const { role, course } = useOutletContext();
    const [TeacherAssignments, setTeacherAssignments] = useState([]);

    // 學生相關的狀態
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submissionMap, setSubmissionMap] = useState({});
    const { addAlert } = useAlert();
    // 檢查是否為學生
    const isStudent = role.isStudent;

    // Get the Teacher assignment
    useEffect(() => {
        async function fetchTeacherAssignments() {
            const data = await GetCourseAssignments(course.courseId);
            setTeacherAssignments(data || []);
        }
        if (role.isTeacher || role.isAssistant) {
            fetchTeacherAssignments();
        }
    }, [course.courseId, role]);


    // --- fetch function(學生) --- //
    // 獲取作業列表
    const fetchAssignments = async () => {
        if (!course?.courseId || !isStudent) return;

        setLoading(true);
        setError(null);
        try {
            const assignmentsData = await GetCourseAssignments(course.courseId);
            setAssignments(assignmentsData);
            // 立即獲取提交記錄
            await fetchSubmissionMapWithAssignments(assignmentsData);
        } catch (error) {
            setError("無法取得作業列表");
        } finally {
            setLoading(false);
        }
    };

    // 獲取提交記錄
    const fetchSubmissionMapWithAssignments = async (assignmentsList) => {
        if (!course?.courseId || !assignmentsList || assignmentsList.length === 0) return;

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;

        try {
            const results = await Promise.all(assignmentsList.map(a =>
                GetTheAssignSubAssForOneStuednt(a.id, userId)
                    .then(data => ({ assId: a.id, submission: data }))
                    .catch((err) => {
                        if (!(err.response && err.response.status === 404)) {
                            console.error(`獲取作業 ${a.id} 提交記錄失敗:`, err);
                        }
                        return { assId: a.id, submission: null };
                    })
            ));
            const map = {};
            results.forEach(({ assId, submission }) => {
                map[assId] = submission;
            });
            setSubmissionMap(map);
        } catch (error) {
            console.error("刷新繳交紀錄失敗:", error);
        }
    };
    // ----------------------------- //

    // --- callback function (學生) --- //
    // 處理作業附件下載（老師上傳的檔案）
    const handleAssignmentDownload = async (attachment) => {
        try {
            await DownloadAssignment(attachment.path_to_file, attachment.filename);
        } catch (error) {
            addAlert(`下載失敗：${attachment.filename}`, "error");
            console.error("下載作業附件錯誤:", error);
        }
    };

    // 處理學生繳交檔案下載
    const handleSubmittedFileDownload = async (attachment) => {
        try {
            await DownloadAssignment(attachment.path_to_file, attachment.filename);
        } catch (error) {
            addAlert(`下載失敗：${attachment.filename}`, "error");
            console.error("下載學生繳交檔案錯誤:", error);
        }
    };

    // 上傳成功後的回調
    const handleUploadSuccess = async () => {
        await fetchAssignments();
    };

    // ----------------------------- //

    // 初始化數據獲取
    useEffect(() => {
        if (isStudent && course?.courseId) {
            fetchAssignments();
        }
    }, [isStudent, course?.courseId]);

    // 只顯示學生畫面
    if (isStudent) {
        return (
            <div>
                <AssignmentsStudentsTab
                    courseId={course?.courseId}
                    assignments={assignments}
                    loading={loading}
                    error={error}
                    submissionMap={submissionMap}
                    onAssignmentDownload={handleAssignmentDownload}
                    onSubmittedFileDownload={handleSubmittedFileDownload}
                    onUploadSuccess={handleUploadSuccess}
                />
            </div>
        );
    }
    else {
        return (
            <div>

                <TeacherAssignment assignments={TeacherAssignments} />
            </div>
        )
    }

}
export default AssignmentsTab;
