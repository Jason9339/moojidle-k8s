import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateDiscussionBoard, GetAllUserCourses } from "@/services/discussion_board_api/BoardApi.js";



const CreateDiscussion = () => {
    const [boardName, setBoardName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    let userId = JSON.parse(localStorage.getItem("user")).user_id;

    useEffect(() => {
        async function fetchCourses() {
            const result = await GetAllUserCourses(userId);
            console.log("取得課程結果：", result);
            setCourses(result);
        }
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await CreateDiscussionBoard({ course_id: courseId, name: boardName });
            console.log(response)
            if (response?.board_id) {
                navigate(`/discussion/${courseId}`);
            } else {
                setError(response?.error || "無法建立討論版");
            }
        } catch (err) {
            setError("發生錯誤，請稍後再試");
        }
    };

    return (
        <div className="create-board-container">
            <form className="create-board-form" onSubmit={handleSubmit}>
                <h2>新增討論版</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="course-select">選擇課程</label>
                    <select
                        id="course-select"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        required
                    >
                        <option value="" disabled>請選擇課程</option>
                        {courses.map(course => (
                            <option key={course.course_id} value={course.course_id}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="board-name">討論版名稱</label>
                    <input
                        type="text"
                        id="board-name"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                        placeholder="輸入討論版名稱"
                    />
                </div>

                

                <button type="submit">建立討論版</button>
            </form>
        </div>
    );
};

export default CreateDiscussion;
