import { FindBoardByID } from '#src/services/discussion_board_service.js';
import { FindPostByID, DeletePostById, FindProjectedPostsByBId, CreatePostsByBId } from '#src/services/post_services.js'
import { FindUserdataByID, FindUserNameByID } from '#src/services/discussion_services/user_servcie.js';
import { FindCourseNameByID } from '#src/services/discussion_services/course_service.js';
import { LeaveComment, DeleteComment } from '#src/services/comment_service.js';
import { FindOneUserById } from "#src/services/user_service.js"

async function GetPostContent(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        const postData = await FindPostByID(postId);
        if (!postData) {
            return res.status(404).send({ error: "Post Not Found" });
        }

        const authorData = await FindUserdataByID(postData.post_by_user_id);
        const authorName = authorData.name;
        const autherImage = authorData.path_to_profile_pic;

        if (!authorData) {
            return res.status(404).send({ error: "Author Not found" });
        }
        postData.author_name = authorName;
        postData.auther_image = autherImage;

        const boardData = await FindBoardByID(postData.in_b_id);
        if (!boardData) {
            return res.status(404).send({ error: "Discussion Board Not Found" });
        }
        postData.board_name = boardData.name;

        const courseName = await FindCourseNameByID(boardData.course_id);

        if (!courseName) {
            return res.status(404).send({ error: "Couurse Not Found" });
        }
        postData.course_name = courseName;


        // Enrich commentator's name.
        postData.comments = await Promise.all(
            postData.comments.map(async comment => (
                {
                    ...comment,
                    comment_by_user_name: await FindUserNameByID(comment.comment_by_user_id)
                }
            ))
        )

        res.status(200).send(postData);
    } catch (err) {
        next(err);
    }
}

async function Commender(req, res) {
    const { post_id, user_id, custom_tag, description } = req.body;

    if (!post_id || !user_id || !description) {
        return res.status(400).send({ message: "post_id, user_id, and description are required" });
    }

    try {
        const result = await LeaveComment({
            post_id: parseInt(post_id),
            user_id: parseInt(user_id),
            custom_tag: custom_tag || "",
            description
        });

        if (result.modifiedCount === 1) {
            res.status(201).send({ message: "Comment added successfully" });
        } else {
            res.status(404).send({ message: "Post not found or comment not added" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function CommendDeleter(req, res) {
    const { post_id, user_id, comment_date, description } = req.body;

    try {
        const result = await DeleteComment({
            post_id: parseInt(post_id),
            user_id: parseInt(user_id),
            date: new Date(comment_date),
            description
        });

        if (result.modifiedCount === 1) {
            res.status(201).send({ message: "Comment deleted" });
        } else {
            res.status(404).send({ message: "Post not found or comment not added" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

async function PostDeleter(req, res) {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        // Call the service to delete the post
        const result = await DeletePostById(postId);

        // If there is an error in the result, send it as a response
        if (result.error) {
            return res.status(404).send({ error: result.error });
        }

        // Otherwise, send the success message
        return res.status(200).send({ message: result.message });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "An unexpected error occurred" });
    }
}

async function GetOverviewPosts(req, res) {
    const inBoardId = req.params.inBoardId;
    let maxContent = 400;

    try {
        let result = await FindProjectedPostsByBId(inBoardId);

        for (let i = 0; i < result.length; i++) {
            if (result[i].description.length > maxContent) {
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
        const {
            post_by_user_id,
            post_user_custom_tags,
            description,
            title,
            public: isPublic = false,
            in_b_id,
            post_tags = []
        } = req.body;

        if (!post_by_user_id || !description || !title) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const post_date = new Date();


        const customTagsArray = (post_user_custom_tags || []).map(tag =>
            typeof tag === "string" ? { tag_name: tag } : tag
        );
        const postTagsArray = (post_tags || []).map(tag =>
            typeof tag === "string" ? { tag_name: tag } : tag
        );

        const newPost = {
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
    AddPosts,
    GetPostContent,
    Commender,
    PostDeleter,
    CommendDeleter,
    GetOverviewPosts
} 
