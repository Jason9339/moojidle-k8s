import mongoose from 'mongoose';

async function FindPostByID(postID) {
    try {
        const post = await mongoose.connection.db.collection('post').findOne({ post_id: postID });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
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

async function FindProjectedPostsByBId(in_b_id) {
    let result;

    try {
        result = await mongoose.connection.db.collection('post').find({
            in_b_id: parseInt(in_b_id)
        }).project({
            comments: 0,
        }).toArray();
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function GetNextPostId() {
    const db = mongoose.connection.db;
    const counter = await db.collection('counter').findOne({});
    if (!counter) {
        throw new Error("Counter document not found. Please initialize your counter collection.");
    }
    const postId = (counter.post || 0) + 1;
    await db.collection('counter').updateOne(
        { _id: counter._id },
        { $set: { post: postId } }
    );
    return postId;
}

async function CreatePostsByBId(post) {
    try {
        const result = await mongoose.connection.db.collection('post').insertOne(post);
        return result;
    } catch (err) {
        throw new Error("Failed to create post: " + err.message);
    }
}

export {
    FindProjectedPostsByBId,
    GetNextPostId,
    CreatePostsByBId,
    FindPostByID,
    DeletePost,
}
