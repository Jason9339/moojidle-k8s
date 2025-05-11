import mongoose from "mongoose"
   
async function FindProjectedPostsByBId(in_b_id) {
    let result;
    
    try {
        result = await mongoose.connection.db.collection('post').find({ 
            in_b_id: parseInt(in_b_id)
        }).project({
            comments: 0,
            post_user_custom_tag: 0,
            post_tags: 0
        }).toArray();
    } catch (err) {
        console.log(err);
    }

    return result;
}

export {
    FindProjectedPostsByBId,
}