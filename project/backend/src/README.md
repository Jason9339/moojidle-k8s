# routes

1. course_routes
    - router.get("/read", ReadCourse);
    - router.get("/list", GetAllCourses);
    - router.get("/read/teach_in", ReadTeachIn);
    - router.post("/create", CreateCourse);
    - router.post("/edit/:id", EditCourse);
    - router.delete("/delete/:id", RemoveCourse);
    - router.get("/:courseId", GetCourseDetail);
    - router.get("/invite/:code", GetCourseIdByInviteCode)

# controllers
    
1. course_controllers
    - ReadCourse
    - GetAllCourses
    - ReadTeachIn
    - CreateCourse
    - EditCourse
    - RemoveCourse
    - GetCourseDetail
    - GetCourseIdByInviteCode

# services

1. course
    - FindCourseByUserId
    - FindAllCourses
    - FindCourseInCourseId
    - InsertCourse
    - UpdateCourseName
    - DeleteCourse
    - FindCourseById
    - FindCourseIdByInviteCode
2. course_member
    - FindTeachInByUserId,
    - FindAssistInByUserId,
    - FindStudyInByUserId
    - InsertTeachIn
    