import React, { useEffect } from "react";
import "./CourseTab.css";
import { downloadFile } from "@/services/FileApi";

function CourseTab({ courseId, course, materials, assignments }) {
    useEffect(() => {
        console.log("Current materials:", materials);
        console.log("Current assignments:", assignments);
    }, [materials, assignments]);

    return (
        <div className="material-table-section">
            <table className="material-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Lecture</th>
                        <th>Assignments/Exams</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 16 }, (_, i) => {
                        const currentWeek = i + 1;
                        const weekMaterials = materials.filter(
                            (m) =>
                                m.week === currentWeek ||
                                (!m.week && currentWeek === 1)
                        );
                        const weekAssignments = assignments.filter(
                            (a) =>
                                a.week === currentWeek ||
                                (!a.week && currentWeek === 1)
                        );

                        return (
                            <tr key={currentWeek}>
                                <td>{currentWeek}</td>
                                <td>
                                    {weekMaterials.length > 0 ? (
                                        weekMaterials.map((material, idx) => (
                                            <div key={idx}>
                                                {material.name}{" "}
                                                <a
                                                    href={material.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    [slide]
                                                </a>
                                                <button
                                                    className="download-button"
                                                    onClick={() =>
                                                        downloadFile(
                                                            material.path_to_file,
                                                            material.filename
                                                        )
                                                    }
                                                >
                                                    下載
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <span>Week {currentWeek} Topic</span>
                                    )}
                                </td>
                                <td>
                                    {weekAssignments.length > 0 ? (
                                        weekAssignments.map(
                                            (assignment, idx) => (
                                                <div key={idx}>
                                                    <a
                                                        href={`/course/${courseId}/assignment/${assignment.id}`}
                                                    >
                                                        {assignment.name}
                                                    </a>
                                                    {assignment.attachments
                                                        ?.length > 0 ? (
                                                        assignment.attachments.map(
                                                            (file, i) => (
                                                                <button
                                                                    key={i}
                                                                    className="download-button"
                                                                    onClick={() =>
                                                                        downloadFile(
                                                                            file.path_to_file,
                                                                            file.filename
                                                                        )
                                                                    }
                                                                    style={{ marginLeft: "8px" }}
                                                                >
                                                                    [{file.filename}]
                                                                </button>
                                                            )
                                                        )
                                                    ) : (
                                                        <span style={{ marginLeft: "8px" }}>
                                                            （無附件）
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>

                                <td>
                                    <a href="#">Ref {currentWeek}</a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="todo-panel">
                <h4>To Do</h4>
                {assignments.length > 0 ? (
                    assignments.slice(0, 3).map((assignment, idx) => (
                        <div key={idx} className="todo-item">
                            <strong>{assignment.name}</strong>
                            <span>{course.title}</span>
                            <span>
                                {assignment.points || "N/A"} pts •{" "}
                                {new Date(
                                    assignment.dueDate
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                    assignment.dueDate
                                ).toLocaleTimeString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="todo-item">
                        <span>目前沒有待辦事項</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseTab;
