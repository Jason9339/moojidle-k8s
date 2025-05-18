# routes

1. course_routes
    - router.get("/read", ReadCourse);
    - router.get("/list", GetAllCourses);
    - router.get("/read/teach_in", ReadTeachIn);
    - router.post("/create", CreateCourse);


# controllers
    
1. course_controllers
    - ReadCourse
    - GetAllCourses
    - ReadTeachIn
    - CreateCourse

# services

1. course
    - FindCourseByUserId
    - FindAllCourses
    - FindCourseInCourseId
    - InsertCourse
2. course_member
    - FindTeachInByUserId,
    - FindAssistInByUserId,
    - FindStudyInByUserId
    - InsertTeachIn
    