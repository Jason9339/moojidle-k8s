# routes

1. course_routes
    - router.get("/read", ReadCourse);
    - router.get("/list", GetAllCourses);
    - router.get("/read/teach_in", ReadTeachIn);
    - router.post("/create", CreateCourse);
    - router.post("/edit/:id", EditCourse);
    - router.delete("/delete/:id", RemoveCourse);
    - router.get("/:courseId", GetCourseDetail);
    - router.get("/invite/:code", GetCourseIdByInviteCode);
2. course_member
    - router.get("/:courseId", GetCourseMembers);
    - router.get("/can_edit/:userId/:courseId", IsAssistantOrTeacher);
    - router.post("/switch/:userId/:courseId", SwitchCharacter);
    - router.post("/add/:courseId", InviteStudent)

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
2. course_member
    - GetCourseMembers
    - IsAssistantOrTeacher
    - SwitchCharacter
    - InviteStudent

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
    - FindStudyInJoinUserByCourseId
    - FindAssistInJoinUserByCourseId
    - FindTeachInJoinUserByCourseId
    - SwitchStudyAssist
    - InsertStudyIn
    - InsertTeachIn