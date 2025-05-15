import { 
    FindProjectedPostsByBId,
    GetNextPostId,
    CreatePostsByBId
} from "#src/services/discussion_services/post_services.js"
import { 
    FindOneUserById
} from "#src/services/user_services/user_service.js"

async function GetOverviewPosts(req, res) {
    const inBoardId = req.params.inBoardId;
    let maxContent = 400;

    try {
        let result = await FindProjectedPostsByBId(inBoardId);

        for (let i = 0; i < result.length; i ++){
            if(result[i].description.length > maxContent){
                result[i].description = result[i].description.substring(0, maxContent).concat("....");
            }

            // append user name to the relative post
            let userData = await FindOneUserById(result[i].post_by_user_id);

            result[i].post_by_user_name = userData.name;
            result[i].post_by_user_pfp = userData.path_to_profile_pic;
        }

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "posts not found" });
        }
    } catch (err) {
        console.log(err);
    }
}

async function AddPosts(req, res) {
    try {
        const in_b_id = parseInt(req.params.inBoardId, 10);
        const {
            post_by_user_id,
            post_user_custom_tags,
            description,
            title,
            public: isPublic = false,
            post_tags
        } = req.body;

        if (!post_by_user_id || !description || !title) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const post_id = await GetNextPostId();
        const post_date = new Date();

        
        const customTagsArray = (post_user_custom_tags || []).map(tag =>
            typeof tag === "string" ? { tag_name: tag } : tag
        );
        const postTagsArray = (post_tags || []).map(tag =>
            typeof tag === "string" ? { tag_name: tag } : tag
        );

        const newPost = {
            post_id,
            post_by_user_id,
            post_user_custom_tags: customTagsArray,
            description,
            title,
            post_date,
            public: isPublic,
            comments: [],
            in_b_id,
            post_tags: postTagsArray
        };

        await CreatePostsByBId(newPost);

        res.status(201).json({ message: "Post created successfully.", post: newPost });
    } catch (err) {
        res.status(500).json({ message: "Failed to create post.", error: err.message });
    }
}

export {
    GetOverviewPosts,
    AddPosts,
}