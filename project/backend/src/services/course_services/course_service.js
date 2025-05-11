import mongoose from "mongoose"

async function GetAllUserCourseByUserId(userId) {
    try { 
        const db = mongoose.connection.db;
        
        const user = await db.collection('user').findOne({ user_id: userId });
        if (!user) return null;
        
        // check the three identities for the user
        const [teach, assist, study] = await Promise.all([
            db.collection('teach_in').find({ user_id: userId }).toArray(),
            db.collection('assist_in').find({ user_id: userId }).toArray(),
            db.collection('study_in').find({ user_id: userId }).toArray(),
        ]);

        // remove duplicates
        const courseIds = [
            ...teach.map(x => x.course_id),
            ...assist.map(x => x.course_id),
            ...study.map(x => x.course_id),
        ];
        const uniqueCourseIds = [...new Set(courseIds)];

        if (uniqueCourseIds.length === 0) return [];

        // query course information, only return course_id and name
        const courses = await db.collection('course')
            .find({ course_id: { $in: uniqueCourseIds } })
            .project({ _id: 0, course_id: 1, name: 1 })
            .toArray();

        return courses;

    } catch (err) {
        console.log(err);
        return [];
    }
}

export {
    GetAllUserCourseByUserId,
}
