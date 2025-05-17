import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./CourseDetail.module.css";
import { 
  getCourseDetails, 
  getCourseAssignments, 
  getCourseMaterials, 
  updateCourseMaterials,
  deleteCourseMaterial
} from "@/services/coursepage_api/CoursepageApi";

import LeftBar from "@/components/LeftBar/LeftBar";

import CourseTab from "@/components/course/CourseTab/CourseTab";
import GradesTab from "@/components/course/GradesTab/GradesTab";
import DiscussionTab from "@/components/course/DiscussionTab/DiscussionTab";
import AssignmentsTab from "@/components/course/AssignmentsTab/AssignmentsTab";
import AnnouncementsTab from "@/components/course/AnnouncementsTab/AnnouncementsTab";
import UploadModal from "@/components/course/UploadModal/UploadModal";
import MembersTab from "@/components/course/MembersTab/MembersTab";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function CourseDetail() {
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.user_id;

    const location = useLocation();
    const savedRole = JSON.parse(localStorage.getItem("courseRole")) || {};

    const isTeacher = location.state?.isTeacher ?? savedRole.isTeacher ?? false;
    const isAssistant = location.state?.isAssistant ?? savedRole.isAssistant ?? false;
    const isEditor = isTeacher || isAssistant;


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

    useEffect(() => {
        const storedCourseId = localStorage.getItem("courseId");
        console.log("storedCourseId", storedCourseId);
        if (!storedCourseId || storedCourseId !== courseId) {
            alert("請從 Dashboard 或課程頁進入課程。");
            navigate("/dashboard"); // 或導回首頁
        }
    }, [courseId]);
      

    // 處理從 CourseTab 傳來的教材變更
    const handleMaterialsChange = (updatedMaterials) => {
        setEditedMaterials(updatedMaterials);
    };

    // 處理編輯模式切換
    const toggleEditMode = async () => {
        // 如果當前是編輯模式，則嘗試保存變更
        if (isEditMode) {
            // 新增：完成編輯前二次確認
            const confirmEdit = window.confirm("你確定要儲存這次的教材變更嗎？按下取消將不會儲存任何更動。");
            if (!confirmEdit) {
                // 取消時直接離開編輯模式，恢復原本資料
                setEditedMaterials([]);
                setIsEditMode(false);
                return;
            }
            try {
                setIsSaving(true);
                console.log("原始教材數據:", materials);
                console.log("編輯後的教材數據:", editedMaterials);
                
                // 檢查教材名稱不可為空
                if (editedMaterials.some(m => !m.name || m.name.trim() === "")) {
                    alert("教材名稱不能為空，請檢查所有教材名稱！");
                    setIsSaving(false);
                    return;
                }
                
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
                /*
                // 防呆：若全部刪除，需二次確認
                if (deletedMaterialIds.length === materials.length && materials.length > 0) {
                    const confirmDeleteAll = window.confirm("你確定要刪除所有教材嗎？此動作無法復原。");
                    if (!confirmDeleteAll) {
                        setIsSaving(false);
                        return;
                    }
                }*/

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
                        {isEditor && (
                            <div className={`${styles["material-bar"]}`}>
                                <button
                                    className={`${styles["material-button"]}`}
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
                {activeTab === "公告" && <AnnouncementsTab courseId={courseId} currentUserId={currentUserId} />}
                {activeTab === "成員" && <MembersTab courseId={courseId} userId={currentUserId} />}
            </div>
        </div>
    );
}

export default CourseDetail;
