import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import styles from "./CourseTab.module.css";

import { GetCourseDetails } from "@/services/CourseApi";
import {
    GetCourseMaterials,
    UpdateCourseMaterials,
    DeleteCourseMaterial,
} from "@/services/MaterialApi";

import { GetCourseAssignments } from "@/services/AssignmentApi";

import { GetCourseExams } from "@/services/ExamApi";

import CourseTable from "@/components/course_components/CourseTable/CourseTable";
import MaterialUploadModal from "@/components/course_components/MaterialUploadModal/MaterialUploadModal";
import AssignmentUploadModal from "@/components/course_components/AssignmentUploadModal/AssignmentUploadModal";
import ExamUploadModal from "@/components/course_components/ExamUploadModal/ExamUploadModal";
import { useAlert } from "@/utils/alert/AlertContext";

export default function CourseInfoPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { role } = useOutletContext();

    const isEditor = role?.isTeacher || role?.isAssistant;

    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMaterialUploadModal, setShowMaterialUploadModal] = useState(false);
    const [showAssignmentUploadModal, setShowAssignmentUploadModal] = useState(false);
    const [showExamUploadModal, setShowExamUploadModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMaterials, setEditedMaterials] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const { addAlert } = useAlert();
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseData, materialsData, assignmentsData, examData] =
                    await Promise.all([
                        GetCourseDetails(courseId),
                        GetCourseMaterials(courseId),
                        GetCourseAssignments(courseId),
                        GetCourseExams(courseId),
                    ]);
                setCourse(courseData);
                setMaterials(materialsData);
                setAssignments(assignmentsData);
                setExams(examData);
            } catch (error) {
                console.error("獲取課程數據失敗:", error);
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    const handleMaterialsChange = (updated) => {
        setEditedMaterials(updated);
    };

    const toggleEditMode = async () => {
        if (isEditMode) {
            const confirmEdit = window.confirm("你確定要儲存這次的教材變更嗎？");
            if (!confirmEdit) {
                setEditedMaterials([]);
                setIsEditMode(false);
                return;
            }

            try {
                setIsSaving(true);

                if (editedMaterials.some((m) => !m.name?.trim())) {
                    addAlert("教材名稱不能為空");
                    setIsSaving(false);
                    return;
                }

                const toUpdate = editedMaterials.filter((m) =>
                    materials.some((orig) => orig.id === m.id)
                );

                const toDelete = materials
                    .filter((orig) => !editedMaterials.some((m) => m.id === orig.id))
                    .map((m) => m.id);

                if (toUpdate.length > 0) {
                    await UpdateCourseMaterials(courseId, toUpdate);
                }

                for (const id of toDelete) {
                    await DeleteCourseMaterial(courseId, id);
                }

                const refreshed = await GetCourseMaterials(courseId);
                setMaterials(refreshed);
                setEditedMaterials([]);
            } catch (err) {
                console.error("保存失敗", err);
                addAlert("保存教材變更失敗，請稍後再試");
                return;
            } finally {
                setIsSaving(false);
            }
        }

        setIsEditMode(!isEditMode);
    };

    if (loading || !course) {
        return <div style={{ backgroundColor: "#eff2f5", flex: 1 }} />;
    }

    return (
        <div>
            {isEditor && (
                <div className={styles["material-bar"]}>
                    <div className={styles["function-group"]}>
                        <span className={styles["function-label"]}>內容管理</span>
                        <button
                            className={styles["upload-button"]}
                            onClick={() => {
                                setShowMaterialUploadModal(true);
                            }}
                        >
                            上傳教材
                        </button>
                        <button
                            className={styles["upload-button"]}
                            onClick={() => {
                                setShowAssignmentUploadModal(true);
                            }}
                        >
                            上傳作業
                        </button>
                        <button
                            className={styles["upload-button"]}
                            onClick={() => {
                                setShowExamUploadModal(true);
                                // TODO: 上傳考試
                            }}
                        >
                            上傳考試
                        </button>
                    </div>

                    <div className={styles["function-group"]}>
                        <span className={styles["function-label"]}>編輯操作</span>
                        <button
                            className={`${styles["edit-button"]} ${isEditMode ? styles["active"] : ""}`}
                            onClick={toggleEditMode}
                            disabled={isSaving}
                        >
                            {isSaving ? "保存中..." : isEditMode ? "完成編輯" : "編輯教材"}
                        </button>
                        {isEditMode && (
                            <button
                                className={styles["cancel-button"]}
                                onClick={() => {
                                    setEditedMaterials([]);
                                    setIsEditMode(false);
                                }}
                                disabled={isSaving}
                            >
                                取消
                            </button>
                        )}
                    </div>
                </div>
            )}

            <CourseTable
                courseId={courseId}
                course={course}
                materials={materials}
                assignments={assignments}
                exams={exams}
                isEditMode={isEditMode}
                onMaterialsChange={handleMaterialsChange}
            />

            {showMaterialUploadModal && (
                <>
                    <div
                        className={styles["modal-overlay"]}
                        onClick={() => setShowMaterialUploadModal(false)}
                    />
                    <MaterialUploadModal
                        onClose={() => setShowMaterialUploadModal(false)}
                        courseId={courseId}
                        course={course}
                        onSuccess={() => window.location.reload()}
                    />
                </>
            )}

            {showAssignmentUploadModal && (
                <>
                    <div
                        className={styles["modal-overlay"]}
                        onClick={() => setShowAssignmentUploadModal(false)}
                    />
                    <AssignmentUploadModal
                        onClose={() => setShowAssignmentUploadModal(false)}
                        courseId={courseId}
                        course={course}
                        onSuccess={() => window.location.reload()}
                    />
                </>
            )}

            {showExamUploadModal && (
                <>
                    <div
                        className={styles["modal-overlay"]}
                        onClick={() => setShowExamUploadModal(false)}
                    />
                    <ExamUploadModal
                        onClose={() => setShowExamUploadModal(false)}
                        courseId={courseId}
                        course={course}
                        onSuccess={() => window.location.reload()}
                    />
                </>
            )}
        </div>
    );
}
