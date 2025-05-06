import mongoose from 'mongoose';

async function GetPost(postId) {
    try {
        const post = await mongoose.connection.db.collection('post').findOne({ post_id: postId });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}

async function GetUserName(userId) {
    try {
        const post = await mongoose.connection.db.collection('user').findOne({ user_id: userId });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}

async function GetBoardName(bId) {
    try {
        const post = await mongoose.connection.db.collection('discussion_board').findOne({ board_id: bId });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}


async function GetPostByCourse(courseId) {
    try {
        const posts = await mongoose.connection.db
            .collection('post')
            .find({ course_id: courseId })
            .toArray(); 

        return posts;
    } catch (err) {
        throw new Error("Failed to fetch posts by course: " + err.message);
    }
}

async function GetCourseNameById(courseId) {
    try {
        return await mongoose.connection.db.collection("course").findOne({ course_id: courseId });
    } catch (err) {
        throw new Error("Failed to fetch course name: " + err.message);
    }
}

export {
    GetPost,
    GetUserName,
    GetBoardName,
    GetPostByCourse,
    GetCourseNameById
};
