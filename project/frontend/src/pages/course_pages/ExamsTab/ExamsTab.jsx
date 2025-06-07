import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { GetCourseExams } from "@/services/ExamApi.js";
import TeacherExam from "@/components/course_components/TeacherExam/ControlWhichExam/TeacherExam.jsx";

function ExamsTab() {
    const { role, course } = useOutletContext();
    const [TeacherExams, setTeacherExams] = useState([]);

    useEffect(() => {
        async function fetchTeacherExams() {
            const data = await GetCourseExams(course.courseId);
            setTeacherExams(data || []);
        }
            fetchTeacherExams();
    }, [course.courseId, role]);

    return <TeacherExam exams = {TeacherExams}/>;
}

export default ExamsTab;
