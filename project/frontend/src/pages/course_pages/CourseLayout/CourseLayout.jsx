import { useParams, Outlet, useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";
import { GetCourses } from "@/services/CourseApi";
import styles from "./CourseLayout.module.css";

export default function CourseLayout() {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const [role, setRole] = useState(null);
	const [course, setCourse] = useState(null);
	const role1 = useOutletContext();
	const isEditor = role?.isTeacher || role?.isAssistant;


	useEffect(() => {
		const fetchData = async () => {
			const user = JSON.parse(localStorage.getItem("user"));

			try {
				const allCourses = await GetCourses(user.user_id);
				const currentCourse = allCourses.find(
					(c) => String(c.courseId) === String(courseId)
				);

				if (!currentCourse) {
					throw new Error("找不到課程");
				}

				setCourse(currentCourse);
				setRole({
					isTeacher: currentCourse.isTeacher,
					isAssistant: currentCourse.isAssistant,
					isStudent: currentCourse.isStudent,
				});
			} catch (err) {
				console.error("載入課程/角色失敗", err);
				navigate("/dashboard");
			}
		};

		fetchData();
	}, [courseId]);

	return (
		<div className={styles["app-layout"]}>
			<LeftBar />
			{!course || !role ? (
				<div
					className={styles["course-detail-container"]}
					style={{ backgroundColor: "#eff2f5", flex: 1 }}
				/>
			) : (
				<div className={styles["course-detail-container"]}>
					<div className={styles["course-header"]}>
						<span className={styles["course-title"]} title={course.course_name}>
							{course.course_name}
						</span>
						<span>{courseId}</span>
					</div>

					<div className={styles["tab-menu"]}>
						<NavLink to="" end className={({ isActive }) => isActive ? styles.active : ""}>課程</NavLink>
						<NavLink to="grade" className={({ isActive }) => isActive ? styles.active : ""}>成績</NavLink>
						<NavLink to="assignment" className={({ isActive }) => isActive ? styles.active : ""}>作業</NavLink>
						{isEditor && (
							<NavLink to="exams" className={({ isActive }) => isActive ? styles.active : ""}>考試</NavLink>
						)}
						{/* <NavLink to="discussion" className={({ isActive }) => isActive ? styles.active : ""}>討論</NavLink> */}
						<NavLink to="announcement" className={({ isActive }) => isActive ? styles.active : ""}>公告</NavLink>
						<NavLink to="members" className={({ isActive }) => isActive ? styles.active : ""}>成員</NavLink>
					</div>

					{/* 將角色與課程資訊傳給子頁，課程資訊如果不需要之後可以刪掉(TODO) */}
					<Outlet context={{ role, course }} />
				</div>
			)}
		</div>
	);
}