import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import styles from "./CourseTab.module.css";

import {
    GetCourseMaterials,
    UpdateCourseMaterials,
    DeleteCourseMaterial,
} from "@/services/MaterialApi";

import { GetCourseAssignments } from "@/services/AssignmentApi";

import CourseTable from "@/components/course_components/CourseTable/CourseTable";
import UploadModal from "@/components/course_components/UploadModal/UploadModal";

export default function CourseInfoPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { role, course } = useOutletContext();
    const isEditor = role?.isTeacher || role?.isAssistant;

    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMaterials, setEditedMaterials] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [materialsData, assignmentsData] = await Promise.all([
                    GetCourseMaterials(courseId),
                    GetCourseAssignments(courseId),
                ]);
                setMaterials(materialsData);
                setAssignments(assignmentsData);
            } catch (err) {
                console.error("取得教材或作業失敗", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                if (editedMaterials.some(m => !m.name?.trim())) {
                    alert("教材名稱不能為空");
                    setIsSaving(false);
                    return;
                }

                const toUpdate = editedMaterials.filter(m =>
                    materials.some(orig => orig.id === m.id)
                );

                const toDelete = materials
                    .filter(orig => !editedMaterials.some(m => m.id === orig.id))
                    .map(m => m.id);

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
                alert("保存教材變更失敗，請稍後再試");
                return;
            } finally {
                setIsSaving(false);
            }
        }
        setIsEditMode(!isEditMode);
    };

    if (loading) return <div className={styles["loading"]}>載入中...</div>;

    return (
        <div>
            {isEditor && (
                <div className={styles["material-bar"]}>
                    <button
                        className={styles["material-button"]}
                        onClick={() => setShowUploadModal(true)}
                    >
                        上傳教材/作業
                    </button>
                    <button
                        className={`${styles["material-button"]} ${isEditMode ? styles["active"] : ""}`}
                        onClick={toggleEditMode}
                        disabled={isSaving}
                    >
                        {isSaving ? '保存中...' : isEditMode ? '完成編輯' : '編輯教材'}
                    </button>
                    {isEditMode && (
                        <button
                            className={`${styles["material-button"]} ${styles["cancel"]}`}
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
            )}

            <CourseTable
                courseId={courseId}
                course={course}
                materials={materials}
                assignments={assignments}
                isEditMode={isEditMode}
                onMaterialsChange={handleMaterialsChange}
            />

            {showUploadModal && (
                <>
                    <div
                        className={styles["modal-overlay"]}
                        onClick={() => setShowUploadModal(false)}
                    />
                    <UploadModal
                        onClose={() => setShowUploadModal(false)}
                        courseId={courseId}
                        onSuccess={() => window.location.reload()}
                    />
                </>
            )}
        </div>
    );
}
