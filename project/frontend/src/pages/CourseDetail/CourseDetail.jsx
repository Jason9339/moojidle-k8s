import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./CourseDetail.module.css";
import { 
  getCourseDetails, 
  getCourseAssignments, 
  getCourseMaterials, 
  updateCourseMaterials,
  deleteCourseMaterial
} from "@/services/CoursepageApi";

import LeftBar from "@/components/LeftBar/LeftBar";

import CourseTab from "@/components/course/CourseTab/CourseTab";
import GradesTab from "@/components/course/GradesTab/GradesTab";
import DiscussionTab from "@/components/course/DiscussionTab/DiscussionTab";
import AssignmentsTab from "@/components/course/AssignmentsTab/AssignmentsTab";
import AnnouncementsTab from "@/components/course/AnnouncementsTab/AnnouncementsTab";
import UploadModal from "@/components/course/UploadModal/UploadModal";
import MembersTab from "@/components/course/MembersTab/MembersTab";

function CourseDetail() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.user_id;

    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("課程");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMaterials, setEditedMaterials] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { 
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseData, materialsData, assignmentsData] = await Promise.all([
                    getCourseDetails(courseId),
                    getCourseMaterials(courseId),
                    getCourseAssignments(courseId)
                ]);
                
                // console.log("materialsData", materialsData);
                // console.log("assignmentsData", assignmentsData);

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

    // 處理從 CourseTab 傳來的教材變更
    const handleMaterialsChange = (updatedMaterials) => {
        setEditedMaterials(updatedMaterials);
    };

    // 處理編輯模式切換
    const toggleEditMode = async () => {
        // 如果當前是編輯模式，則嘗試保存變更
        if (isEditMode) {
            try {
                setIsSaving(true);
                console.log("原始教材數據:", materials);
                console.log("編輯後的教材數據:", editedMaterials);
                
                // 獲取要更新的教材
                const materialsToUpdate = editedMaterials.filter(m => 
                    // 確保教材屬於當前課程
                    materials.some(original => original.id === m.id)
                );
                
                // 獲取被刪除的教材（原教材中存在但編輯後的教材中不存在）
                const deletedMaterialIds = materials
                    .filter(originalMaterial => 
                        !editedMaterials.some(m => m.id === originalMaterial.id)
                    )
                    .map(m => m.id);
                
                console.log("要更新的教材:", materialsToUpdate);
                console.log("要刪除的教材 IDs:", deletedMaterialIds);
                
                // 執行更新操作（如果有要更新的教材）
                if (materialsToUpdate.length > 0) {
                    await updateCourseMaterials(courseId, materialsToUpdate);
                }
                
                // 執行刪除操作（如果有要刪除的教材）
                for (const materialId of deletedMaterialIds) {
                    console.log(`正在刪除教材 ID: ${materialId}`);
                    await deleteCourseMaterial(courseId, materialId);
                }
                
                // 更新成功後刷新教材數據
                const updatedMaterials = await getCourseMaterials(courseId);
                setMaterials(updatedMaterials);
                
                // 清空編輯狀態
                setEditedMaterials([]);
            } catch (error) {
                console.error("保存教材變更失敗:", error);
                alert("保存教材變更失敗，請稍後再試");
                return; // 保存失敗不退出編輯模式
            } finally {
                setIsSaving(false);
            }
        }
        
        // 切換編輯模式
        setIsEditMode(!isEditMode);
    };

    if (loading) {
        return <div className={`${styles["loading"]}`}>載入中...</div>;
    }

    if (!course) {
        return <div className={`${styles["error"]}`}>無法載入課程資料</div>;
    }

    return (
        <div className={`${styles["app-layout"]}`}>
            <LeftBar />
            <div className={`${styles["course-detail-container"]}`}>
                {/* 課程標題列 */}
                <div className={`${styles["course-header"]}`}>
                    <span>{course.title}</span>
                    <span>{courseId}</span>
                </div>

                {/* Tab 選單列 */}
                <div className={`${styles["tab-menu"]}`}>
                    {["課程", "成績", "討論", "作業", "公告", "成員"].map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? "active" : ""}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab 對應內容渲染 */}
                {activeTab === "課程" && (
                    <>
                        <div className={`${styles["material-bar"]}`}>
                            <button
                                className={`${styles["material-button"]}`}
                                onClick={() => setShowUploadModal(true)}
                            >
                                上傳教材/作業
                            </button>
                            <button 
                                className={`material-button ${isEditMode ? 'active' : ''}`}
                                onClick={toggleEditMode}
                                disabled={isSaving}
                            >
                                {isSaving ? '保存中...' : isEditMode ? '完成編輯' : '編輯教材'}
                            </button>
                        </div>
                        <CourseTab
                            courseId={courseId}
                            course={course}
                            materials={materials}
                            assignments={assignments}
                            isEditMode={isEditMode}
                            onMaterialsChange={handleMaterialsChange}
                        />
                        {/* 顯示 UploadModal */}
                        {showUploadModal && (
                            <>
                                <div className={`${styles["modal-overlay"]}`} onClick={() => setShowUploadModal(false)} />
                                <UploadModal
                                onClose={() => setShowUploadModal(false)}
                                courseId={courseId}
                                onSuccess={() => window.location.reload()}
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
                {activeTab === "公告" && <AnnouncementsTab />}
                {activeTab === "成員" && <MembersTab courseId={courseId} userId={currentUserId} />}
            </div>
        </div>
    );
}

export default CourseDetail;
