import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./CourseTab.css";

function CourseTab({ courseId, course, materials, assignments, isEditMode, onMaterialsChange }) {
    const [editingMaterials, setEditingMaterials] = useState([]);
    
    // 使用 useMemo 優化按週次分組的教材，避免不必要的重新計算
    const materialsByWeek = useMemo(() => {
        return Array(16).fill().map((_, i) => {
            const currentWeek = i + 1;
            return materials.filter(
                m => m.week === currentWeek || (!m.week && currentWeek === 1)
            );
        });
    }, [materials]);

    // 當 materials 或 isEditMode 改變時，重新初始化編輯數據
    useEffect(() => {
        if (isEditMode) {
            setEditingMaterials(materialsByWeek);
        }
    }, [materials, isEditMode, materialsByWeek]);

    // 使用 useMemo 優化平面數組轉換，減少不必要的操作
    const flattenedMaterials = useMemo(() => {
        if (!isEditMode) return [];
        
        return editingMaterials.flatMap((weekMaterials, weekIndex) => {
            return weekMaterials.map(material => ({
                ...material,
                week: weekIndex + 1
            }));
        });
    }, [editingMaterials, isEditMode]);

    // 當編輯的材料發生變化時，通知父組件 (使用防抖動來減少更新頻率)
    useEffect(() => {
        if (isEditMode && onMaterialsChange) {
            const timer = setTimeout(() => {
                onMaterialsChange(flattenedMaterials);
            }, 300); // 300ms 防抖動
            
            return () => clearTimeout(timer);
        }
    }, [flattenedMaterials, isEditMode, onMaterialsChange]);

    // 計算週次的日期範圍 (使用 useMemo 優化)
    const weekDateRanges = useMemo(() => {
        if (!course || !course.start_date) return Array(16).fill('');
        
        const semesterStartDate = new Date(course.start_date);
        // 將日期調整為該週的週日
        const dayOfWeek = semesterStartDate.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek;
        const adjustedStartDate = new Date(semesterStartDate);
        adjustedStartDate.setDate(adjustedStartDate.getDate() - daysToSubtract);
        
        // 為所有週次計算日期範圍
        return Array(16).fill().map((_, weekIndex) => {
            const weekNumber = weekIndex + 1;
            // 計算第n週的起始日期（週日）
            const weekStartDate = new Date(adjustedStartDate);
            weekStartDate.setDate(adjustedStartDate.getDate() + (weekNumber - 1) * 7);
            
            // 計算第n週的結束日期（週六）
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6);
            
            // 格式化日期為 MM/DD 格式
            const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
            return `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`;
        });
    }, [course]);

    // 使用 useCallback 優化處理函數，避免重新創建
    const handleMaterialNameChange = useCallback((weekIndex, materialIndex, newName) => {
        setEditingMaterials(prevMaterials => {
            const updatedMaterials = [...prevMaterials];
            if (updatedMaterials[weekIndex] && updatedMaterials[weekIndex][materialIndex]) {
                updatedMaterials[weekIndex] = [...updatedMaterials[weekIndex]];
                updatedMaterials[weekIndex][materialIndex] = {
                    ...updatedMaterials[weekIndex][materialIndex],
                    name: newName
                };
            }
            return updatedMaterials;
        });
    }, []);

    // 處理教材URL變更 (使用 useCallback 優化)
    const handleMaterialUrlChange = useCallback((weekIndex, materialIndex, newUrl) => {
        setEditingMaterials(prevMaterials => {
            const updatedMaterials = [...prevMaterials];
            if (updatedMaterials[weekIndex] && updatedMaterials[weekIndex][materialIndex]) {
                updatedMaterials[weekIndex] = [...updatedMaterials[weekIndex]];
                updatedMaterials[weekIndex][materialIndex] = {
                    ...updatedMaterials[weekIndex][materialIndex],
                    url: newUrl
                };
            }
            return updatedMaterials;
        });
    }, []);

    // 刪除教材 (使用 useCallback 優化)
    const deleteMaterial = useCallback((weekIndex, materialIndex) => {
        setEditingMaterials(prevMaterials => {
            const updatedMaterials = [...prevMaterials];
            if (updatedMaterials[weekIndex]) {
                updatedMaterials[weekIndex] = updatedMaterials[weekIndex].filter((_, idx) => idx !== materialIndex);
            }
            return updatedMaterials;
        });
    }, []);

    // 輔助函數：獲取特定週次的教材列表 (使用 useMemo 優化)
    const getMaterialsForWeek = useCallback((weekIndex) => {
        const currentWeek = weekIndex + 1;
        
        if (isEditMode && editingMaterials[weekIndex]) {
            return editingMaterials[weekIndex];
        } else {
            return materials.filter(
                m => m.week === currentWeek || (!m.week && currentWeek === 1)
            );
        }
    }, [isEditMode, editingMaterials, materials]);

    // 優化 assignments 的過濾，避免在渲染時重複計算
    const assignmentsByWeek = useMemo(() => {
        return Array(16).fill().map((_, i) => {
            const currentWeek = i + 1;
            return assignments.filter(
                a => a.week === currentWeek || (!a.week && currentWeek === 1)
            );
        });
    }, [assignments]);

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
                        const weekMaterials = getMaterialsForWeek(i);
                        const weekAssignments = assignmentsByWeek[i];
                        const dateRange = weekDateRanges[i];

                        return (
                            <tr key={currentWeek}>
                                <td>
                                    {currentWeek}
                                    <br />
                                    <small className="week-date-range">{dateRange}</small>
                                </td>
                                <td>
                                    {isEditMode ? (
                                        <>
                                            {weekMaterials && weekMaterials.length > 0 ? (
                                                weekMaterials.map((material, idx) => (
                                                    <div key={idx} className="edit-material-item">
                                                        <input
                                                            type="text"
                                                            value={material.name || ""}
                                                            onChange={(e) => handleMaterialNameChange(i, idx, e.target.value)}
                                                            className="material-input"
                                                            placeholder="教材名稱"
                                                        />
                                                        {/* URL 輸入框已移除，連結將保持不變 */}
                                                        <button 
                                                            onClick={() => deleteMaterial(i, idx)}
                                                            className="delete-material-btn"
                                                        >
                                                            刪除
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <span>尚無教材</span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {weekMaterials && weekMaterials.length > 0 ? (
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
                                        </>
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
