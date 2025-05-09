import React from "react";
import "./CourseTab.css";

function CourseTab({ courseId, course, materials, assignments }) {
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
                            (m) => m.week === currentWeek || (!m.week && currentWeek === 1)
                        );
                        const weekAssignments = assignments.filter(
                            (a) => a.week === currentWeek || (!a.week && currentWeek === 1)
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
                                            </div>
                                        ))
                                    ) : (
                                        <span>Week {currentWeek} Topic</span>
                                    )}
                                </td>
                                <td>
                                    {weekAssignments.length > 0 ? (
                                        weekAssignments.map((assignment, idx) => (
                                            <div key={idx}>
                                                <a href={`/course/${courseId}/assignment/${assignment.id}`}>
                                                    {assignment.name}
                                                </a>
                                            </div>
                                        ))
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
                                {new Date(assignment.dueDate).toLocaleDateString()} at{" "}
                                {new Date(assignment.dueDate).toLocaleTimeString()}
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
