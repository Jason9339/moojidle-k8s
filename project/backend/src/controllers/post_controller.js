import { GetPost, GetUserName,GetBoardName } from '#src/services/post_service.js';
import { GetPostByCourse,GetCourseNameById, } from '#src/services/post_service.js';


async function GetPostData(req, res, next) {
    try {
        const postId = parseInt(req.params.id); // 把 URL 中的 id 轉成數字
        if (isNaN(postId)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        const result = await GetPost(postId);

        if (!result) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        next(err); // 讓全域 error handler 處理
    }
}

async function GetUserData(req, res, next) {
    try {
        const userId = parseInt(req.params.id); // 把 URL 中的 id 轉成數字
        if (isNaN(userId)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        const result = await GetUserName(userId);

        if (!result) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        next(err); // 讓全域 error handler 處理
    }
}

async function GetBoardData(req, res, next) {
    try {
        const Id = parseInt(req.params.id); // 把 URL 中的 id 轉成數字
        if (isNaN(Id)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        const result = await GetBoardName(Id);

        if (!result) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        next(err); // 讓全域 error handler 處理
    }
}
async function GetPostListByCourse(req, res, next) {
    try {
        const courseId = parseInt(req.params.id);
        if (isNaN(courseId)) {
            return res.status(400).send({ error: "Invalid course_id" });
        }

        const posts = await GetPostByCourse(courseId);

        res.status(200).send(posts);
    } catch (err) {
        next(err);
    }
}
async function GetCourseName(req, res, next) {
    try {
        const courseId = parseInt(req.params.id);
        if (isNaN(courseId)) {
            return res.status(400).send({ error: "Invalid course_id" });
        }

        const result = await GetCourseNameById(courseId);
        if (!result) {
            return res.status(404).send({ error: "Course not found" });
        }

        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
}


export {
    GetPostData, 
    GetUserData,
    GetBoardData,
    GetPostListByCourse,
    GetCourseName
};
