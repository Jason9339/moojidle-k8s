import mongoose from 'mongoose';

async function FindPostByID(postID) {
    try {
        const post = await mongoose.connection.db.collection('post').findOne({ post_id: postID });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }

}

async function FindAllPostsByBoardID(discussionBoardID) {
    try {
        const posts = await mongoose.connection.db
            .collection('post')
            .find({ in_b_id: discussionBoardID })
            .toArray();

        return posts;
    } catch (err) {
        throw new Error("Failed to fetch posts by course: " + err.message);
    }
}

const DeletePost = async (postID) => {
    try {
        const result = await mongoose.connection.db.collection('post').deleteOne({ post_id: postID });
        return result;
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

export {
    FindPostByID,
    DeletePost
}
