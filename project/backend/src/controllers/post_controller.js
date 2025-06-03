import { FindBoardByID } from '#src/services/discussion_board_service.js';
import {
    FindPostByID,
    DeletePostById,
    FindProjectedPostsByBId,
    InsertPosts,
    UpdatePostById
} from '#src/services/post_services.js';

import {
    UpdateComment,
    DeleteComment
} from '#src/services/comment_service.js';

import {
    FindOneUserById
} from "#src/services/user_service.js";

import {
    FindCourseById
} from '#src/services/course_service.js';

import {
    SendNotify
} from '#src/services/notification_service.js';

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

        const authorData = await FindOneUserById(postData.post_by_user_id);
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

        const course = await FindCourseById(boardData.course_id);
        const courseName = course.name;

        if (!courseName) {
            return res.status(404).send({ error: "Couurse Not Found" });
        }
        postData.course_name = courseName;


        // Enrich commentator's name.
        postData.comments = await Promise.all(
            postData.comments.map(async comment => (
                {
                    ...comment,
                    comment_by_user_name: (await FindOneUserById(comment.comment_by_user_id)).name
                }
            ))
        );

        res.status(200).send(postData);
    } catch (err) {
        next(err);
    }
}

async function LeaveComment(req, res) {
    const { post_id, user_id, custom_tag, description } = req.body;

    if (!post_id || !user_id || !description) {
        return res.status(400).send({ message: "post_id, user_id, and description are required" });
    }

    try {
        const result = await UpdateComment({
            post_id: parseInt(post_id),
            user_id: parseInt(user_id),
            custom_tag: custom_tag || "",
            description
        });

        if (result.modifiedCount === 1) {
            const postdata = await FindPostByID(post_id);
            const board = await FindBoardByID(postdata.in_b_id);
            const course = await FindCourseById(board.course_id);
            console.log(course);

            
            const notificationData = {
                event_id: post_id,
                event_category: "commend",
                context: `課程 - ${course.title} 討論版 - ${board.name} 貼文 - ${postdata.title} 有新留言 - ${description}`,
                notified_users:[
                    {
                        user_id:postdata.post_by_user_id
                    }
                ]
            }
            const notifyres = await SendNotify(notificationData);
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

        await InsertPosts(newPost);

        res.status(201).json({ message: "Post created successfully.", post: newPost });
    } catch (err) {
        res.status(500).json({ message: "Failed to create post.", error: err.message });
    }
}

async function EditPost(req, res) {
    const postId = parseInt(req.params.id);
    const { title, description, public: isPublic } = req.body;

    if (isNaN(postId)) {
        return res.status(400).send({ error: "Invalid post_id" });
    }

    if (typeof title !== 'string' || title.trim() === '' || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).send({ error: "Title and description are required and cannot be empty." });
    }

    const updateFields = { title, description };
    if (typeof isPublic === 'boolean') {
        updateFields.public = isPublic;
    }

    try {
        const result = await UpdatePostById(postId, updateFields);

        if (result.matchedCount !== 0) {
            res.status(200).send({ message: "成功更新貼文" });
        } else {
            res.status(404).send({ message: "貼文未找到或未進行任何更改" });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err.message });
    }
}

export {
    AddPosts,
    GetPostContent,
    LeaveComment,
    PostDeleter,
    CommendDeleter,
    GetOverviewPosts,
    EditPost
} 
