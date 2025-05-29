import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DownloadMaterial } from "@/services/MaterialApi";
import { DownloadAssignment } from "@/services/AssignmentApi";
import styles from "./CourseTable.module.css";

function CourseTable({
    courseId,
    course,
    materials,
    assignments,
    isEditMode,
    onMaterialsChange,
}) {
    const [editingMaterials, setEditingMaterials] = useState([]);
    const [expandedAssignments, setExpandedAssignments] = useState({});

    const toggleAssignment = (assignmentId) => {
        if (!assignmentId) return;
        setExpandedAssignments((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };

    const handleMaterialDownload = async (path, filename) => {
        try {
            await DownloadMaterial(path, filename);
        } catch (e) {
            alert(`下載失敗：${filename}`);
            console.error("Download error:", e);
        }
    };

    const handleAssignmentDownload = async (path, filename) => {
        try {
            await DownloadAssignment(path, filename);
        } catch (e) {
            alert(`下載失敗：${filename}`);
            console.error("Assignment download error:", e);
        }
    };

    const weekNum = useMemo(() => {
        const parsed = parseInt(course.week_num, 10);
        return !isNaN(parsed) && parsed > 0 ? parsed : 16;
    }, [course]);

    const materialsByWeek = useMemo(() => {
        return Array.from({ length: weekNum }, (_, i) => {
            const w = i + 1;
            return materials.filter(
                (m) => m.week === w || (!m.week && w === 1)
            );
        });
    }, [materials, weekNum]);

    useEffect(() => {
        if (isEditMode) setEditingMaterials(materialsByWeek);
    }, [materials, isEditMode, materialsByWeek]);

    const flattenedMaterials = useMemo(() => {
        if (!isEditMode) return [];
        return editingMaterials.flatMap((ms, i) =>
            ms.map((m) => ({ ...m, week: i + 1 }))
        );
    }, [editingMaterials, isEditMode]);

    useEffect(() => {
        if (isEditMode && onMaterialsChange) {
            const t = setTimeout(
                () => onMaterialsChange(flattenedMaterials),
                300
            );
            return () => clearTimeout(t);
        }
    }, [flattenedMaterials, isEditMode, onMaterialsChange]);

    const weekDateRanges = useMemo(() => {
        if (!course?.start_date) return Array(weekNum).fill("");
        const start = new Date(course.start_date);
        const offset = start.getDay();
        start.setDate(start.getDate() - offset);

        return Array.from({ length: weekNum }, (_, i) => {
            const begin = new Date(start);
            begin.setDate(begin.getDate() + i * 7);
            const end = new Date(begin);
            end.setDate(begin.getDate() + 6);
            return `${begin.getMonth() + 1}/${begin.getDate()} - ${
                end.getMonth() + 1
            }/${end.getDate()}`;
        });
    }, [course, weekNum]);

    const handleMaterialNameChange = useCallback((weekIndex, idx, name) => {
        setEditingMaterials((prev) => {
            const copy = [...prev];
            copy[weekIndex] = [...copy[weekIndex]];
            copy[weekIndex][idx] = { ...copy[weekIndex][idx], name };
            return copy;
        });
    }, []);

    const handleMaterialDateChange = useCallback(
        (weekIndex, idx, displayDate) => {
            setEditingMaterials((prev) => {
                const copy = [...prev];
                copy[weekIndex] = [...copy[weekIndex]];
                copy[weekIndex][idx] = { ...copy[weekIndex][idx], displayDate };
                return copy;
            });
        },
        []
    );

    const deleteMaterial = useCallback((weekIndex, idx) => {
        setEditingMaterials((prev) => {
            const copy = [...prev];
            copy[weekIndex] = copy[weekIndex].filter((_, i) => i !== idx);
            return copy;
        });
    }, []);

    const getMaterialsForWeek = useCallback(
        (weekIndex) => {
            const w = weekIndex + 1;
            return isEditMode && editingMaterials[weekIndex]
                ? editingMaterials[weekIndex]
                : materials.filter((m) => m.week === w || (!m.week && w === 1));
        },
        [isEditMode, editingMaterials, materials]
    );

    const assignmentsByWeek = useMemo(() => {
        return Array.from({ length: weekNum }, (_, i) => {
            const w = i + 1;
            return assignments.filter(
                (a) => a.week === w || (!a.week && w === 1)
            );
        });
    }, [assignments, weekNum]);

    const formatDateForInput = useCallback((dateStr) => {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date)
            ? date.toISOString().split("T")[0]
            : "";
    }, []);

    return (
        <div className={styles["material-table-section"]}>
            <table className={styles["material-table"]}>
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Lecture</th>
                        <th>Assignments/Exams</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: weekNum }, (_, i) => {
                        const weekMaterials = getMaterialsForWeek(i);
                        const weekAssignments = assignmentsByWeek[i];
                        const dateRange = weekDateRanges[i];

                        return (
                            <tr key={i + 1}>
                                <td>
                                    {i + 1}
                                    <br />
                                    <small
                                        className={styles["week-date-range"]}
                                    >
                                        {dateRange}
                                    </small>
                                </td>
                                <td>
                                    {isEditMode
                                        ? weekMaterials.map((m, idx) => (
                                              <div
                                                  key={idx}
                                                  className={
                                                      styles[
                                                          "edit-material-item"
                                                      ]
                                                  }
                                              >
                                                  <input
                                                      type="text"
                                                      value={m.name || ""}
                                                      onChange={(e) =>
                                                          handleMaterialNameChange(
                                                              i,
                                                              idx,
                                                              e.target.value
                                                          )
                                                      }
                                                      className={
                                                          styles[
                                                              "material-input"
                                                          ]
                                                      }
                                                      placeholder="教材名稱"
                                                  />
                                                  <input
                                                      type="date"
                                                      value={formatDateForInput(
                                                          m.displayDate
                                                      )}
                                                      onChange={(e) =>
                                                          handleMaterialDateChange(
                                                              i,
                                                              idx,
                                                              e.target.value
                                                          )
                                                      }
                                                      className={
                                                          styles[
                                                              "material-date-input"
                                                          ]
                                                      }
                                                  />
                                                  <button
                                                      onClick={() =>
                                                          deleteMaterial(i, idx)
                                                      }
                                                      className={
                                                          styles[
                                                              "delete-material-btn"
                                                          ]
                                                      }
                                                  >
                                                      刪除
                                                  </button>
                                              </div>
                                          ))
                                        : weekMaterials.map((m, idx) => (
                                            <div
                                                key={idx}
                                                className={styles["clickable-material"]}
                                                onClick={() => handleMaterialDownload(m.path_to_file, m.filename)}
                                            >
                                                <span className={styles["material-name"]} title={m.name}>
                                                    {m.name}
                                                </span>
                                                {m.displayDate && (
                                                    <span className={styles["material-date"]}>
                                                        ({new Date(m.displayDate).toLocaleDateString()})
                                                    </span>
                                                )}
                                            </div>
                                          ))}
                                </td>
                                <td>
                                    {weekAssignments.map((a, idx) => (
                                        <div key={idx}>
                                            <div
                                                onClick={() =>
                                                    toggleAssignment(a.id)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    color: "#084298",
                                                }}
                                            >
                                                {a.name}
                                            </div>
                                            {expandedAssignments[a.id] && (
                                                <div
                                                    className={
                                                        styles[
                                                            "assignment-file-list"
                                                        ]
                                                    }
                                                >
                                                    {a.attachments?.length >
                                                    0 ? (
                                                        a.attachments.map(
                                                            (f, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={
                                                                        styles[
                                                                            "clickable-material"
                                                                        ]
                                                                    }
                                                                    onClick={() =>
                                                                        handleAssignmentDownload(
                                                                            f.path_to_file,
                                                                            f.filename
                                                                        )
                                                                    }
                                                                >
                                                                    {f.filename}
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <span>（無附件）</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <span style={{ color: "#999" }}>-</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className={styles["todo-panel"]}>
                <h4>To Do</h4>
                {assignments.length > 0 ? (
                    assignments.slice(0, 3).map((a, idx) => (
                        <div key={idx} className={styles["todo-item"]}>
                            <strong>{a.name}</strong>
                            <span>{course.title}</span>
                            <span>
                                {a.points || "N/A"} pts •{" "}
                                {new Date(a.dueDate).toLocaleDateString()} at{" "}
                                {new Date(a.dueDate).toLocaleTimeString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className={styles["todo-item"]}>
                        <span>目前沒有待辦事項</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseTable;
