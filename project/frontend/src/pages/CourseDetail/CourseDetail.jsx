import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./CourseDetail.css";
import { getCourseDetails, getCourseAssignments, getCourseMaterials } from "@/services/CoursepageApi";

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

    useEffect(() => { 
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseData, materialsData, assignmentsData] = await Promise.all([
                    getCourseDetails(courseId),
                    getCourseMaterials(courseId),
                    getCourseAssignments(courseId)
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

    if (loading) {
        return <div className="loading">載入中...</div>;
    }

    if (!course) {
        return <div className="error">無法載入課程資料</div>;
    }

    return (
        <div className="app-layout">
            <LeftBar />
            <div className="course-detail-container">
                {/* 課程標題列 */}
                <div className="course-header">
                    <span>{course.title}</span>
                    <span>{courseId}</span>
                </div>

                {/* Tab 選單列 */}
                <div className="tab-menu">
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
                        <div className="material-bar">
                            <button className="material-button">編輯教材</button>
                            <button
                                className="material-button"
                                onClick={() => setShowUploadModal(true)}
                            >
                                上傳教材/作業
                            </button>
                        </div>
                        <CourseTab
                            courseId={courseId}
                            course={course}
                            materials={materials}
                            assignments={assignments}
                        />
                        {/* 顯示 UploadModal */}
                        {showUploadModal && (
                            <>
                                <div className="modal-overlay" onClick={() => setShowUploadModal(false)} />
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
