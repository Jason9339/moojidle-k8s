import { FindBoardByID } from '#src/services/post_services/discussion_board_service.js';
import { FindPostByID } from '#src/services/post_services/post_service.js'
import { FindUserNameByID } from '#src/services/post_services/user_servcie.js';
import { FindCourseNameByID } from '#src/services/post_services/course_service.js';
async function GetPostContent(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).send({ error: "Invalid post_id" });
        }

        const postData = await FindPostByID(postId);
        if (!postData) {
            return res.status(404).send({ error: "Post not found" });
        }

        const authorName = await FindUserNameByID(postData.post_by_user_id);
        if (!authorName) {
            return res.status(404).send({ error: "Author not found" });
        }
        postData.author_name = authorName;

        const boardData = await FindBoardByID(postData.in_b_id);
        postData.board_name = boardData.name;

        const courseName = await FindCourseNameByID(boardData.course_id);
        postData.course_name = courseName;
        res.status(200).send(postData);
    } catch (err) {
        next(err);
    }
}

export {
    GetPostContent
} 
