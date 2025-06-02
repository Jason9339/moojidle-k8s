// 學生作業列表元件
import React, { useState } from "react";
import styles from "./AssignmentsStudentsTab.module.css";
import SubmittedAssUploadModal from "@/components/course_components/SubmittedAssUploadModal/SubmittedAssUploadModal";
import AssignmentStudentCard from "@/components/course_components/AssignmentStudentCard/AssignmentStudentCard";

export default function AssignmentsStudentsTab({ 
    courseId,
    assignments,
    loading,
    error,
    submissionMap,
    onAssignmentDownload,
    onSubmittedFileDownload,
    onUploadSuccess
}) {
    const [expanded, setExpanded] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // 依照週次分組作業
    const groupedAssignments = assignments.reduce((acc, assignment) => {
        const week = assignment.week || 'Unassigned';
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(assignment);
        return acc;
    }, {});

    // 轉換為數組並排序
    const sortedWeeks = Object.keys(groupedAssignments)
        .sort((a, b) => a === 'Unassigned' ? 1 : b === 'Unassigned' ? -1 : parseInt(a) - parseInt(b));

    // 處理上傳點擊
    const handleUploadClick = (assignment) => {
        setCurrentAssignment(assignment);
        setShowUploadModal(true);
    };

    // 處理上傳成功
    const handleUploadSuccessInternal = async () => {
        if (onUploadSuccess) {
            await onUploadSuccess();
        }
        setShowUploadModal(false);
    };

    if (loading) return <div className={styles["loading-container"]} />;
    if (error) return <div className={styles["error-message"]}>{error}</div>;

    return (
        <div className={styles["assignments-container"]}>
            {showUploadModal && currentAssignment && (
                <>
                    <div
                        className={styles["modal-overlay"]}
                        onClick={() => setShowUploadModal(false)}
                    />
                    <SubmittedAssUploadModal
                        onClose={() => setShowUploadModal(false)}
                        courseId={courseId}
                        assignmentId={currentAssignment.id}
                        existingSubmission={submissionMap[currentAssignment.id] || null}
                        onSuccess={handleUploadSuccessInternal}
                    />
                </>
            )}
            {sortedWeeks.length === 0 ? (
                <div className={styles["empty-assignments-card"]}>
                    <p>此課程目前沒有作業</p>
                </div>
            ) : (
                sortedWeeks.map(week => (
                    <div key={week} className={styles["week-section"]}>
                        <div className={styles["assignments-list"]}>
                            {groupedAssignments[week].map(assignment => (
                                <AssignmentStudentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    submissionMap={submissionMap}
                                    expanded={expanded}
                                    onToggleExpand={toggleExpand}
                                    onAssignmentDownload={onAssignmentDownload}
                                    onSubmittedFileDownload={onSubmittedFileDownload}
                                    onUploadClick={handleUploadClick}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
