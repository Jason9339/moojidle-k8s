import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import styles from "./AnnouncementsTab.module.css";

import {
    GetAnnouncements,
    CreateAnnouncement,
    EditAnnouncement,
} from "@/services/AnnouncementApi.js";

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
                const data = await GetAnnouncements(courseId);
                setAnnouncements(data);
            } catch (err) {
                setError("Failed to load announcements.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, [courseId]);

    const filteredAnnouncements = announcements.filter((a) =>
        a.context.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        if (!newAnnouncementContext.trim()) return alert("內容不能為空");
        if (new Date(newAnnounceDate) > new Date()) {
            alert("公告時間在未來，將延後顯示");
        }
        try {
            await CreateAnnouncement(
                courseId,
                newAnnouncementContext,
                currentUserId,
                newAnnounceDate
            );
            setAnnouncements(await GetAnnouncements(courseId));
            closeCreateModal();
        } catch (err) {
            setError("新增失敗");
            console.error(err);
        }
    };

    const handleEdit = async () => {
        if (!newAnnouncementContext.trim()) return alert("內容不能為空");
        if (new Date(newAnnounceDate) > new Date()) {
            alert("公告時間在未來，將延後顯示");
        }
        try {
            await EditAnnouncement(
                selectedAnnouncement.a_id,
                newAnnouncementContext,
                newAnnounceDate
            );
            setAnnouncements(await GetAnnouncements(courseId));
            closeEditModal();
        } catch (err) {
            setError("Failed to edit announcement.");
            console.error(err);
        }
    };

    const handleContextChange = (e) => {
        const value = e.target.value;
        setNewAnnouncementContext(
            value.length <= 2500 ? value : value.slice(0, 2500)
        );
    };

    if (loading) return <div>Loading announcements...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles["announcements-tab"]}>
            <div className={styles["announcements-header"]}>
                <select className={styles["filter-dropdown"]}>
                    <option value="all">Announced</option>
                </select>
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
                {filteredAnnouncements.map((a) => (
                    <div key={a.a_id} className={styles["announcement-item"]}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <p className={styles["announcement-content"]}>
                                    {a.context}
                                </p>
                                <p className={styles["announcement-posted"]}>
                                    Posted on:{" "}
                                    {new Date(a.create_date).toLocaleString()}
                                </p>
                            </div>
                            {canEdit && (
                                <button
                                    className={
                                        styles["edit-announcement-button"]
                                    }
                                    onClick={() => openEditModal(a)}
                                >
                                    編輯公告
                                </button>
                            )}
                        </div>
                    </div>
                ))}
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
                            <textarea
                                value={newAnnouncementContext}
                                onChange={handleContextChange}
                                maxLength={2500}
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
                            <button onClick={handleCreate}>Create</button>
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
                            <textarea
                                value={newAnnouncementContext}
                                onChange={handleContextChange}
                                maxLength={2500}
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
