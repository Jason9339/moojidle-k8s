import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import styles from "./AnnouncementsTab.module.css";
import {
    GetAnnouncements,
    CreateAnnouncement,
    EditAnnouncement,
    DeleteAnnouncement
} from "@/services/AnnouncementApi.js";
import { addAlert } from "@/utils/alert/AlertContext";
import TextEditor from "@/components/TextEditor/TextEditor";
import ReactMarkdown from "react-markdown";
function AnnouncementsPage() {
    const { courseId } = useParams();
    const { role } = useOutletContext();
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const canEdit = role?.isTeacher || role?.isAssistant;
    const [announcements, setAnnouncements] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newAnnouncementContext, setNewAnnouncementContext] = useState("");
    const [newAnnounceDate, setNewAnnounceDate] = useState(
        new Date().toISOString()
    );
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                // Teachers/TAs see all, students see only past
                const data = await GetAnnouncements(courseId, canEdit);
                setAnnouncements(data);
            } catch (err) {
                setError("Failed to load announcements.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, [courseId, canEdit]);

    // Filter by search term
    const filtered = announcements.filter(a =>
        a.context.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Split into past and future
    const now = new Date();
    const past = filtered.filter(a => new Date(a.announce_date) <= now);
    // For students, future is always empty
    const future = canEdit
        ? filtered.filter(a => new Date(a.announce_date) > now)
        : [];

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
        setNewAnnounceDate(new Date().toISOString());
    };
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewAnnouncementContext("");
        setNewAnnounceDate(new Date().toISOString());
    };

    const openEditModal = (a) => {
        setSelectedAnnouncement(a);
        setNewAnnouncementContext(a.context);
        setNewAnnounceDate(
            new Date(a.announce_date).toISOString().slice(0, 16)
        );
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAnnouncement(null);
        setNewAnnouncementContext("");
        setNewAnnounceDate(new Date().toISOString());
    };

    const handleCreate = async () => {
        if (!newAnnouncementContext.trim()) {
            addAlert("內容不能為空", "error");
            return;
        }
        if (new Date(newAnnounceDate) > new Date()) {
            addAlert("公告時間在未來，將延後顯示", "info");
        }
        try {
            await CreateAnnouncement(
                courseId,
                newAnnouncementContext,
                currentUserId,
                newAnnounceDate
            );
            setAnnouncements(await GetAnnouncements(courseId, canEdit));
            closeCreateModal();
        } catch (err) {
            addAlert("新增失敗", "error");
            console.error(err);
        }
    };

    const handleEditAnnouncement = async () => {
        if (!newAnnouncementContext.trim()) {
            addAlert("內容不能為空", "error");
            return;
        }
        if (new Date(newAnnounceDate) > new Date()) {
            addAlert("公告時間在未來，將延後顯示", "info");
        }
        try {
            await EditAnnouncement(
                selectedAnnouncement.a_id,
                newAnnouncementContext,
                newAnnounceDate
            );
            setAnnouncements(await GetAnnouncements(courseId, canEdit));
            closeEditModal();
        } catch (err) {
            setError("Failed to edit announcement.");
            console.error(err);
        }
    };

    const handleDeleteAnnouncement = async (announcement) => {
        if (!window.confirm("確定要刪除這則公告嗎？")) return;
        try {
            await DeleteAnnouncement(announcement.a_id);
            setAnnouncements(await GetAnnouncements(courseId, canEdit));
        } catch (err) {
            addAlert("刪除失敗", "error");
        }
    };

    const handleContextChange = (value) => {
        setNewAnnouncementContext(
            value.length <= 2500 ? value : value.slice(0, 2500)
        );
    };

    if (loading || !role) {
        return <div style={{ backgroundColor: "#eff2f5", flex: 1 }} />;
    }
    if (error) return <div>{error}</div>;

    return (
        <div className={styles["announcements-tab"]}>
            <div className={styles["announcements-header"]}>
                <input
                    type="text"
                    className={styles["search-bar"]}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {canEdit && (
                    <button
                        className={styles["create-announcement-button"]}
                        onClick={openCreateModal}
                    >
                        + 新創公告
                    </button>
                )}
            </div>

            <div className={styles["announcements-list"]}>
                {/* Future Announcements Section (only for teachers/TAs) */}
                {canEdit && (
                    <>
                        <div className={styles["announcement-separator"]}>
                            <span className={styles["announcement-section-title"]}>未來公告</span>
                        </div>
                        {future.length === 0 ? (
                            <div className={styles["no-announcement"]}>沒有未來公告</div>
                        ) : (
                            future.map(a => (
                                <div key={a.a_id} className={styles["announcement-item"]}>
                                    <div className={styles["announcement-inner"]}>
                                        <div className={styles["announcement-left"]}>
                                            <p className={styles["announcement-content"]}>{a.context}</p>
                                            <p className={styles["announcement-posted"]}>
                                                Posted on: {new Date(a.create_date).toLocaleString()}
                                            </p>
                                        </div>
                                        <>
                                            <button
                                                className={styles["edit-announcement-button"]}
                                                onClick={() => openEditModal(a)}
                                            >
                                                編輯
                                            </button>
                                            <button
                                                className={styles["delete-announcement-button"]}
                                                onClick={() => handleDeleteAnnouncement(a)}
                                            >
                                                刪除
                                            </button>
                                        </>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Current Announcements Section (only for teachers/TAs) */}
                        <div className={styles["announcement-separator"]}>
                            <span className={styles["announcement-section-title"]}>當前公告</span>
                        </div>
                    </>
                )}

                {/* Current Announcements List */}
                {past.length === 0 ? (
                    <div className={styles["no-announcement"]}>沒有當前公告</div>
                ) : (
                    past.map(a => (
                        <div key={a.a_id} className={styles["announcement-item"]}>
                            <div className={styles["announcement-inner"]}>
                                <div className={styles["announcement-left"]}>
                                    <p className={`${styles["announcement-content"]} markdown-body`}>
                                        <ReactMarkdown>

                                            {a.context}
                                        </ReactMarkdown>

                                    </p>
                                    <p className={styles["announcement-posted"]}>
                                        Posted on: {new Date(a.create_date).toLocaleString()}
                                    </p>
                                </div>
                                {canEdit && (
                                    <>
                                        <button
                                            className={styles["edit-announcement-button"]}
                                            onClick={() => openEditModal(a)}
                                        >
                                            編輯
                                        </button>
                                        <button
                                            className={styles["delete-announcement-button"]}
                                            onClick={() => handleDeleteAnnouncement(a)}
                                        >
                                            刪除
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className={styles["modal"]}>
                    <div className={styles["modal-content"]}>
                        <span
                            className={styles["close"]}
                            onClick={closeCreateModal}
                        >
                            &times;
                        </span>
                        <h2>Create New Announcement</h2>
                        <label>
                            Announce Date:
                            <input
                                type="datetime-local"
                                value={newAnnounceDate}
                                onChange={(e) =>
                                    setNewAnnounceDate(e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Context:
                            <TextEditor
                                value={newAnnouncementContext}
                                onChange={handleContextChange}
                                maxLength={2500}
                                height='50vh'
                            />
                        </label>
                        <div
                            className={
                                styles["character-counter"] +
                                (2500 - newAnnouncementContext.length === 0
                                    ? ` ${styles["limit"]}`
                                    : "")
                            }
                        >
                            character left:{" "}
                            {2500 - newAnnouncementContext.length}
                        </div>
                        <div className={styles["modal-actions"]}>
                            <button className={styles["modal-button"]} onClick={handleCreate}>Create</button>
                            <button onClick={closeCreateModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className={styles["modal"]}>
                    <div className={styles["modal-content"]}>
                        <span
                            className={styles["close"]}
                            onClick={closeEditModal}
                        >
                            &times;
                        </span>
                        <h2>Edit Announcement</h2>
                        <label>
                            Announce Date:
                            <input
                                type="datetime-local"
                                value={newAnnounceDate}
                                onChange={(e) =>
                                    setNewAnnounceDate(e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Context:
                            <TextEditor
                                value={newAnnouncementContext}
                                onChange={handleContextChange}
                                maxLength={2500}
                                height='50vh'
                            />
                        </label>
                        <div
                            className={
                                styles["character-counter"] +
                                (2500 - newAnnouncementContext.length === 0
                                    ? ` ${styles["limit"]}`
                                    : "")
                            }
                        >
                            character left:{" "}
                            {2500 - newAnnouncementContext.length}
                        </div>
                        <div className={styles["modal-actions"]}>
                            <button onClick={handleEditAnnouncement}>
                                Save
                            </button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnnouncementsPage;
