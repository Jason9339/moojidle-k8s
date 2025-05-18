import mongoose from "mongoose"

async function UpdateComment(CommendData) {
    try {
        const result = await mongoose.connection.db.collection('post').updateOne(
            { post_id: CommendData.post_id },
            {
                $push: {
                    comments: {
                        comment_by_user_id: CommendData.user_id,
                        comment_user_custom_tag: CommendData.custom_tag || "", 
                        comment_date: new Date(),
                        description: CommendData.description
                    }
                }
            }
        );

        return result;
    } catch (err) {
        console.log("Error in LeaveComment:", err);
        throw err;
    }
}

async function DeleteComment(CommendData) {
    try {
        const result = await mongoose.connection.db.collection('post').updateOne(
            { post_id: CommendData.post_id },
            {
                $pull: {
                    comments: {
                        comment_by_user_id: CommendData.user_id,
                        comment_date: CommendData.date,
                        description: CommendData.description
                    }
                }
            }
        );

        return result;
    } catch (err) {
        console.log("Error in DeleteComment:", err);
        throw err;
    }
}

export {
    UpdateComment,
    DeleteComment
}