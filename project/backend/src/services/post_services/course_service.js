import mongoose from "mongoose";


async function FindCourseNameByID(courseID) {
    try {
        const course = await mongoose.connection.db.collection('course')
            .findOne(
                { course_id: courseID },
                { projection: { name: 1, _id: 0 } }
            )

        return course.name;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}

export {
    FindCourseNameByID
}
