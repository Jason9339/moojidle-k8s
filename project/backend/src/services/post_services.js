import mongoose from 'mongoose';

async function FindPostByID(postID) {
    try {
        const post = await mongoose.connection.db.collection('post').findOne({ post_id: postID });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }

}

const DeletePostById = async (postID) => {
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

async function CreatePostsByBId(post) {
    try {
        const counter = await mongoose.connection.db.collection('counter').findOne();
        const nextPostId = counter.post + 1;

        const result = await mongoose.connection.db.collection('post').insertOne({
            post_id: nextPostId,
            post_by_user_id: post.post_by_user_id,
            post_user_custom_tags: post.post_user_custom_tags,
            description: post.description,
            title: post.title,
            post_date: post.post_date,
            public: post.public,
            comments: [],
            in_b_id: post.in_b_id,
            post_tags: post.post_tags
        });

        await mongoose.connection.db.collection('counter').updateOne(
            {},
            { $inc: { post: 1 } }
        );

        return result;
    } catch (err) {
        throw new Error("Failed to create post: " + err.message);
    }
}

export {
    FindProjectedPostsByBId,
    CreatePostsByBId,
    FindPostByID,
    DeletePostById,
}
