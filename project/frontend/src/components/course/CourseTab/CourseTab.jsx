import React, { useState, useEffect } from "react";
import "./CourseTab.css";

function CourseTab({ courseId, course, materials, assignments, isEditMode, onMaterialsChange }) {
    const [editingMaterials, setEditingMaterials] = useState([]);
    
    // 當 materials 或 isEditMode 改變時，重新初始化編輯數據
    useEffect(() => {
        if (isEditMode) {
            // 深度複製 materials 並按週次分組
            const materialsByWeek = Array(16).fill().map((_, i) => {
                const currentWeek = i + 1;
                return materials.filter(
                    m => m.week === currentWeek || (!m.week && currentWeek === 1)
                );
            });
            
            setEditingMaterials(materialsByWeek);
        }
    }, [materials, isEditMode]);

    // 當編輯的材料發生變化時，通知父組件
    useEffect(() => {
        if (isEditMode && onMaterialsChange) {
            // 將按週次分組的教材轉換為平面數組
            const flattenedMaterials = editingMaterials.flatMap((weekMaterials, weekIndex) => {
                return weekMaterials.map(material => ({
                    ...material,
                    week: weekIndex + 1  // 確保每個教材都有正確的 week 屬性
                }));
            });
            
            onMaterialsChange(flattenedMaterials);
        }
    }, [editingMaterials, isEditMode, onMaterialsChange]);

    // 計算週次的日期範圍
    const getWeekDateRange = (weekNumber) => {
        // 使用課程開始日期作為基準日期
        console.log("課程資料:", course); // 查看課程資料是否包含 start_date
        let semesterStartDate = course && course.start_date 
            ? new Date(course.start_date) 
            : new Date(); // 如果沒有開始日期，則使用當前日期
        
        console.log("學期開始日期:", semesterStartDate); // 查看實際使用的日期
        
        // 將日期調整為該週的週日
        // 獲取當前是星期幾（0是星期日，1是星期一，...，6是星期六）
        const dayOfWeek = semesterStartDate.getDay();
        // 如果不是週日，將日期調整為該週的週日
        const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek;
        semesterStartDate.setDate(semesterStartDate.getDate() - daysToSubtract);
        
        console.log("調整後的週日日期:", semesterStartDate); // 查看調整後的週日日期
        
        // 計算第n週的起始日期（週日）
        const weekStartDate = new Date(semesterStartDate);
        weekStartDate.setDate(semesterStartDate.getDate() + (weekNumber - 1) * 7);
        
        // 計算第n週的結束日期（週六）
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);
        
        // 格式化日期為 MM/DD 格式
        const formatDate = (date) => {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        };
        
        return `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`;
    };

    // 處理教材名稱變更
    const handleMaterialNameChange = (weekIndex, materialIndex, newName) => {
        const updatedMaterials = [...editingMaterials];
        if (updatedMaterials[weekIndex] && updatedMaterials[weekIndex][materialIndex]) {
            updatedMaterials[weekIndex] = [...updatedMaterials[weekIndex]];
            updatedMaterials[weekIndex][materialIndex] = {
                ...updatedMaterials[weekIndex][materialIndex],
                name: newName
            };
            setEditingMaterials(updatedMaterials);
        }
    };

    // 處理教材URL變更
    const handleMaterialUrlChange = (weekIndex, materialIndex, newUrl) => {
        const updatedMaterials = [...editingMaterials];
        if (updatedMaterials[weekIndex] && updatedMaterials[weekIndex][materialIndex]) {
            updatedMaterials[weekIndex] = [...updatedMaterials[weekIndex]];
            updatedMaterials[weekIndex][materialIndex] = {
                ...updatedMaterials[weekIndex][materialIndex],
                url: newUrl
            };
            setEditingMaterials(updatedMaterials);
        }
    };

    // 刪除教材
    const deleteMaterial = (weekIndex, materialIndex) => {
        const updatedMaterials = [...editingMaterials];
        if (updatedMaterials[weekIndex]) {
            updatedMaterials[weekIndex] = updatedMaterials[weekIndex].filter((_, idx) => idx !== materialIndex);
            setEditingMaterials(updatedMaterials);
        }
    };

    // 輔助函數：獲取特定週次的教材列表
    const getMaterialsForWeek = (weekIndex) => {
        const currentWeek = weekIndex + 1;
        
        if (isEditMode && editingMaterials[weekIndex]) {
            return editingMaterials[weekIndex];
        } else {
            return materials.filter(
                m => m.week === currentWeek || (!m.week && currentWeek === 1)
            );
        }
    };

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
                        const weekAssignments = assignments.filter(
                            (a) => a.week === currentWeek || (!a.week && currentWeek === 1)
                        );
                        const dateRange = getWeekDateRange(currentWeek);

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
