import { 
    GetAllUserCourseByUserId 
} from "#src/services/discussion_services/course_service.js";

async function GetUserCourse(req, res) {
    //the userid in usl is a string, but in the database it is an int
    // so we need to convert it to an int
    const userId = parseInt(req.params.userid, 10);

    // check if the userId is a number, if not, return Invalid userId
    if (isNaN(userId)) {
        return res.status(400).send({ error: "Invalid userId" });
    }

    const result = await GetAllUserCourseByUserId(userId);

    // check if the user exists, if not, return no user in the database
    if (result === null) {
        return res.status(404).send({ error: "no user in the database" });
    }

    res.status(200).send(result);
}

export {
    GetUserCourse,
}