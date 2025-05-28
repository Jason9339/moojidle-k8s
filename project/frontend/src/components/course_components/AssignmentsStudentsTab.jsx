// 學生作業列表元件
import { useEffect, useState } from "react";
import { GetCourseAssignments } from "@/services/AssignmentApi";

export default function AssignmentsStudentsTab({ courseId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        GetCourseAssignments(courseId)
            .then(setAssignments)
            .catch(() => setError("無法取得作業列表"))
            .finally(() => setLoading(false));
    }, [courseId]);

    if (loading) return <div>載入中...</div>;
    if (error) return <div style={{color:'red'}}>{error}</div>;

    return (
        <ul>
            {assignments.map((a) => (
                <li key={a.id}>
                    <strong>{a.name}</strong> 截止：{a.dueDate ? new Date(a.dueDate).toLocaleString() : "-"}
                </li>
            ))}
        </ul>
    );
}
