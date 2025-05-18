import mongoose from "mongoose";

async function FindStudyInJoinUserByCourseId(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const studyInCollection = db.collection("study_in");

        const studentsWithDetails = await studyInCollection.aggregate([
            {
                $match: { course_id: parsedCourseId }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    "user_info.pw": 0,
                    "user_info.create_date": 0,
                    "user_info.path_to_profile_pic": 0
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$user_info", { student_id: "$student_id" }]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                }
            }
        ]).toArray();

        return studentsWithDetails;
    } catch (error) {
        console.error("Error in GetStudyIn (aggregate):", error);
        throw error;
    }
}

async function FindAssistInJoinUserByCourseId(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const assistInCollection = db.collection("assist_in");

        const assistantsWithDetails = await assistInCollection.aggregate([
            {
                $match: {
                    course_id: parsedCourseId
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    "user_info.pw": 0,
                    "user_info.create_date": 0,
                    "user_info.path_to_profile_pic": 0
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: "$user_info"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                }
            }
        ]).toArray();
                
        return assistantsWithDetails;
    } catch (error) {
        console.error("Error in getAssistIn:", error);
        throw error;
    }
}

async function FindTeachInJoinUserByCourseId(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const teachInCollection = db.collection("teach_in");

        const teachersWithDetails = await teachInCollection.aggregate([
            {
                $match: {
                    course_id: parsedCourseId
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    "user_info.pw": 0,
                    "user_info.create_date": 0,
                    "user_info.path_to_profile_pic": 0
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: "$user_info"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                }
            }
        ]).toArray();
                
        return teachersWithDetails;
    } catch (error) {
        console.error("Error in GetTeachersByCourseId:", error);
        throw error;
    }
}

async function SwitchStudyAssist(userId, courseId) {
    try {
        const parsedUserId = parseInt(userId);
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const assistInCollection = db.collection("assist_in");

        // Check if the user is already an assistant in the course
        const existingAssistant = await assistInCollection.findOne({
            user_id: parsedUserId,
            course_id: parsedCourseId
        });

        if (existingAssistant) {
            // If the user is already an assistant, remove them
            await assistInCollection.deleteOne({
                user_id: parsedUserId,
                course_id: parsedCourseId
            });
            return { message: "User removed from assistants" };
        } else {
            // If the user is not an assistant yet, add them
            await assistInCollection.insertOne({
                user_id: parsedUserId,
                course_id: parsedCourseId
            });
            return { message: "User added as an assistant" };
        }
    } catch (error) {
        console.error("Error in switchStudyAssist:", error);
        throw error;
    }
}

async function InsertStudyIn(userId, studentId, courseId) {
    try {
        // Parse the parameters to ensure they are integers
        const parsedUserId = parseInt(userId);
        const parsedStudentId = parseInt(studentId);
        const parsedCourseId = parseInt(courseId);

        console.log(parsedUserId, parsedStudentId, parsedCourseId);
        
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const studyInCollection = db.collection("study_in");
        
        // Check if the student is already enrolled in this course
        const existingEnrollment = await studyInCollection.findOne({
            user_id: parsedUserId,
            course_id: parsedCourseId
        });
        
        if (existingEnrollment.user_id) {
            throw new Error("Student is already enrolled in this course");
        }
        
        // Add the student to the study_in collection
        await studyInCollection.insertOne({
            user_id: parsedUserId,
            course_id: parsedCourseId,
            student_id: parsedStudentId
        });
        
        return { message: "Student successfully enrolled in the course" };
    } catch (error) {
        console.error("Error in inviteStudent:", error);
        throw error;
    }
}

async function FindTeachInByUserId(userId) {
    try {
        const parsedUserId = parseInt(userId);

        const teachers = await mongoose.connection.db.collection('teach_in').find({ user_id: parsedUserId }).toArray();

        return teachers;
    } catch (error) {
        console.error("Error in GetTeachersByCourseId:", error);
        throw error;
    }
}

async function FindAssistInByUserId(userId) {
    try {
        const parsedUserId = parseInt(userId);

        const assistants = await mongoose.connection.db.collection('assist_in').find({ user_id: parsedUserId }).toArray();

        return assistants;
    } catch (error) {
        console.error("Error in GetTeachersByCourseId:", error);
        throw error;
    }
}

async function FindStudyInByUserId(userId) {
    try {
        const parsedUserId = parseInt(userId);

        const students = await mongoose.connection.db.collection('study_in').find({ user_id: parsedUserId }).toArray();

        return students;
    } catch (error) {
        console.error("Error in GetTeachersByCourseId:", error);
        throw error;
    }
}

async function InsertTeachIn(userId, courseId) {
    try {
        const newTeachInDocument = {
            user_id: userId,
            course_id: courseId,
        };
        const result = await mongoose.connection.db.collection('teach_in').insertOne(newTeachInDocument);
        return result.insertedId;
    } catch (err) {
        console.error("Error adding teach_in entry:", err);
        throw new Error(`Failed to add teach_in entry: ${err.message}`);
    }
}

export {
    FindStudyInJoinUserByCourseId,
    FindAssistInJoinUserByCourseId,
    FindTeachInJoinUserByCourseId,
    FindTeachInByUserId,
    FindAssistInByUserId,
    FindStudyInByUserId,
    SwitchStudyAssist,
    InsertStudyIn,
    InsertTeachIn,
}

