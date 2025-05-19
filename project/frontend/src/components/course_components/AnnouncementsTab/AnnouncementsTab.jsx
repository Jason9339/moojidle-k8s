import React, { useState, useEffect } from "react";
import styles from "./AnnouncementsTab.module.css";
import {
    GetAnnouncements,
    CreateAnnouncement,
    EditAnnouncement,
} from "@/services/AnnouncementApi.js";

import {
    CanUserEditAnnouncements
} from "@/services/CourseApi";

function AnnouncementsTab({ courseId, currentUserId }) {
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
    const [canEdit, setCanEdit] = useState(false);
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

        const checkEditPermissions = async () => {
            try {
                const editPermission = await CanUserEditAnnouncements(
                    currentUserId,
                    courseId
                );
                setCanEdit(editPermission);
            } catch (err) {
                console.error("Failed to check edit permissions:", err);
                setCanEdit(false);
            }
        };

        fetchAnnouncements();
        checkEditPermissions();
    }, [courseId, currentUserId]);

    const filteredAnnouncements = announcements.filter((announcement) =>
        announcement.context.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading announcements...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
        setNewAnnounceDate(new Date().toISOString());
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewAnnouncementContext("");
        setNewAnnounceDate(new Date().toISOString());
    };

    const openEditModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setNewAnnouncementContext(announcement.context);
        // Ensure the date is correctly formatted for the datetime-local input
        const announceDate = new Date(announcement.announce_date);
        setNewAnnounceDate(announceDate.toISOString().slice(0, 16));
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAnnouncement(null);
        setNewAnnouncementContext("");
        setNewAnnounceDate(new Date().toISOString());
    };

    const handleCreateAnnouncement = async () => {
        if (!newAnnouncementContext.trim()) {
            alert("Announcement context cannot be blank.");
            return;
        }
        const now = new Date();
        const announceDate = new Date(newAnnounceDate);
        if (announceDate > now) {
            alert("公告時間在未來，公告將於該時間才會顯示");
        }
        try {
            await CreateAnnouncement(
                courseId,
                newAnnouncementContext,
                currentUserId,
                newAnnounceDate
            );
            // Refresh announcements after creating
            const data = await GetAnnouncements(courseId);
            setAnnouncements(data);
            closeCreateModal();
        } catch (err) {
            setError("Failed to create announcement.");
            console.error(err);
        }
    };

    const handleEditAnnouncement = async () => {
        if (!newAnnouncementContext.trim()) {
            alert("Announcement context cannot be blank.");
            return;
        }
        const now = new Date();
        const announceDate = new Date(newAnnounceDate);
        if (announceDate > now) {
            alert("公告時間在未來，公告將於該時間才會顯示");
        }
        try {
            await EditAnnouncement(
                selectedAnnouncement.a_id,
                newAnnouncementContext,
                newAnnounceDate
            );
            // Refresh announcements after editing
            const data = await GetAnnouncements(courseId);
            setAnnouncements(data);
            closeEditModal();
        } catch (err) {
            setError("Failed to edit announcement.");
            console.error(err);
        }
    };

    // Character limit for announcement context
    const MAX_CONTEXT_LENGTH = 2500;
    const charsLeft = MAX_CONTEXT_LENGTH - newAnnouncementContext.length;

    // Handler for textarea input with character limit
    const handleContextChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CONTEXT_LENGTH) {
            setNewAnnouncementContext(value);
        } else {
            setNewAnnouncementContext(value.slice(0, MAX_CONTEXT_LENGTH));
        }
    };

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
                {filteredAnnouncements.map((announcement) => (
                    <div
                        key={announcement.a_id}
                        className={styles["announcement-item"]}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <div>
                                <p className={styles["announcement-content"]}>
                                    {announcement.context}
                                </p>
                                <p className={styles["announcement-posted"]}>
                                    Posted on:{" "}
                                    {new Date(
                                        announcement.create_date
                                    ).toLocaleString()}
                                </p>
                            </div>
                            {canEdit && (
                                <button
                                    className={
                                        styles["edit-announcement-button"]
                                    }
                                    onClick={() => openEditModal(announcement)}
                                >
                                    編輯公告
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

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
                                maxLength={2500}
                                onChange={(e) => {
                                    if (e.target.value.length <= 2500) {
                                        setNewAnnouncementContext(e.target.value);
                                    }
                                }}
                            />
                        </label>
                        <div
                            className={
                                styles["character-counter"] +
                                (2500 - newAnnouncementContext.length === 0
                                    ? " " + styles["limit"]
                                    : "")
                            }
                        >
                            character left: {2500 - newAnnouncementContext.length}
                        </div>
                        <div className={styles["modal-actions"]}>
                            <button onClick={handleCreateAnnouncement}>
                                Create
                            </button>
                            <button onClick={closeCreateModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

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
                                maxLength={2500}
                                onChange={(e) => {
                                    if (e.target.value.length <= 2500) {
                                        setNewAnnouncementContext(e.target.value);
                                    }
                                }}
                            />
                        </label>
                        <div
                            className={
                                styles["character-counter"] +
                                (2500 - newAnnouncementContext.length === 0
                                    ? " " + styles["limit"]
                                    : "")
                            }
                        >
                            character left: {2500 - newAnnouncementContext.length}
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

export default AnnouncementsTab;
