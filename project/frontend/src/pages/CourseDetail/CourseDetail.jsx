import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import styles from "./CourseDetail.module.css";

import { GetCourseDetails } from "@/services/CourseApi";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import {
    GetCourseMaterials,
    UpdateCourseMaterials,
    DeleteCourseMaterial,
} from "@/services/MaterialApi";

import LeftBar from "@/components/LeftBar/LeftBar";
import CourseTab from "@/components/course_components/CourseTab/CourseTab";
import GradesTab from "@/components/course_components/GradesTab/GradesTab";
import DiscussionTab from "@/components/course_components/DiscussionTab/DiscussionTab";
import AssignmentsTab from "@/components/course_components/AssignmentsTab/AssignmentsTab";
import AnnouncementsTab from "@/components/course_components/AnnouncementsTab/AnnouncementsTab";
import UploadModal from "@/components/course_components/UploadModal/UploadModal";
import MembersTab from "@/components/course_components/MembersTab/MembersTab";

function CourseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = useParams();

    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.user_id;

    const savedRole = JSON.parse(localStorage.getItem("courseRole")) || {};
    const isTeacher = location.state?.isTeacher ?? savedRole.isTeacher ?? false;
    const isAssistant =
        location.state?.isAssistant ?? savedRole.isAssistant ?? false;
    const isEditor = isTeacher || isAssistant;

    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("課程");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMaterials, setEditedMaterials] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseData, materialsData, assignmentsData] =
                    await Promise.all([
                        GetCourseDetails(courseId),
                        GetCourseMaterials(courseId),
                        GetCourseAssignments(courseId),
                    ]);
                setCourse(courseData);
                setMaterials(materialsData);
                setAssignments(assignmentsData);
            } catch (error) {
                console.error("獲取課程數據失敗:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    useEffect(() => {
        const storedCourseId = localStorage.getItem("courseId");
        if (!storedCourseId || storedCourseId !== courseId) {
            alert("請從 Dashboard 或課程頁進入課程。");
            navigate("/dashboard");
        }
    }, [courseId]);

    const handleMaterialsChange = (updatedMaterials) => {
        setEditedMaterials(updatedMaterials);
    };

    const toggleEditMode = async () => {
        if (isEditMode) {
            const confirmEdit = window.confirm(
                "你確定要儲存這次的教材變更嗎？按下取消將不會儲存任何更動。"
            );
            if (!confirmEdit) {
                setEditedMaterials([]);
                setIsEditMode(false);
                return;
            }

            try {
                setIsSaving(true);
                if (
                    editedMaterials.some((m) => !m.name || m.name.trim() === "")
                ) {
                    alert("教材名稱不能為空，請檢查所有教材名稱！");
                    setIsSaving(false);
                    return;
                }

                const materialsToUpdate = editedMaterials.filter((m) =>
                    materials.some((original) => original.id === m.id)
                );

                const deletedMaterialIds = materials
                    .filter(
                        (original) =>
                            !editedMaterials.some((m) => m.id === original.id)
                    )
                    .map((m) => m.id);

                if (materialsToUpdate.length > 0) {
                    await UpdateCourseMaterials(courseId, materialsToUpdate);
                }

                for (const materialId of deletedMaterialIds) {
                    await DeleteCourseMaterial(courseId, materialId);
                }

                const updatedMaterials = await GetCourseMaterials(courseId);
                setMaterials(updatedMaterials);
                setEditedMaterials([]);
            } catch (error) {
                console.error("保存教材變更失敗:", error);
                alert("保存教材變更失敗，請稍後再試");
                return;
            } finally {
                setIsSaving(false);
            }
        }

        setIsEditMode(!isEditMode);
    };

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            {loading ? (
                <div
                    className={styles["course-detail-container"]}
                    style={{ backgroundColor: "#eff2f5", flex: 1 }}
                />
            ) : !course ? (
                <div className={styles["course-detail-container"]}>
                    <div className={styles["error"]}>無法載入課程資料</div>
                </div>
            ) : (
                <div className={styles["course-detail-container"]}>
                    {/* 課程標題列 */}
                    <div className={styles["course-header"]}>
                        <span
                            className={styles["course-title"]}
                            title={course.title}
                        >
                            {course.title}
                        </span>
                        <span>{courseId}</span>
                    </div>

                    {/* Tab 選單列 */}
                    <div className={styles["tab-menu"]}>
                        {["課程", "成績", "討論", "作業", "公告", "成員"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    className={
                                        activeTab === tab ? "active" : ""
                                    }
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>

                    {/* Tab 對應內容渲染 */}
                    {activeTab === "課程" && (
                        <>
                            {isEditor && (
                                <div className={styles["material-bar"]}>
                                    <button
                                        className={styles["material-button"]}
                                        onClick={() => setShowUploadModal(true)}
                                    >
                                        上傳教材/作業
                                    </button>
                                    <button
                                        className={`${
                                            styles["material-button"]
                                        } ${
                                            isEditMode ? styles["active"] : ""
                                        }`}
                                        onClick={toggleEditMode}
                                        disabled={isSaving}
                                    >
                                        {isSaving
                                            ? "保存中..."
                                            : isEditMode
                                            ? "完成編輯"
                                            : "編輯教材"}
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
                            <CourseTab
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
                                        onClick={() =>
                                            setShowUploadModal(false)
                                        }
                                    />
                                    <UploadModal
                                        onClose={() =>
                                            setShowUploadModal(false)
                                        }
                                        courseId={courseId}
                                        onSuccess={() =>
                                            window.location.reload()
                                        }
                                    />
                                </>
                            )}
                        </>
                    )}

                    {activeTab === "成績" && (
                        <GradesTab assignments={assignments} />
                    )}
                    {activeTab === "討論" && <DiscussionTab />}
                    {activeTab === "作業" && (
                        <AssignmentsTab assignments={assignments} />
                    )}
                    {activeTab === "公告" && (
                        <AnnouncementsTab
                            courseId={courseId}
                            currentUserId={currentUserId}
                        />
                    )}
                    {activeTab === "成員" && (
                        <MembersTab
                            courseId={courseId}
                            userId={currentUserId}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default CourseDetail;
