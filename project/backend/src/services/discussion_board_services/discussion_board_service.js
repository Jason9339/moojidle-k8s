import mongoose from "mongoose"

async function GetCourseBoardByCourseId(courseId) {
    const db = mongoose.connection.db;

    const course = await db.collection('course').findOne({ course_id: courseId });
    if (!course) return null;

    const boards = await db.collection('discussion_board')
        .find({ course_id: courseId })
        .project({ _id: 0, board_id: 1, name: 1 })
        .toArray();

    
    return {
        course_id: course.course_id,
        course_name: course.name,
        boards: boards.map(b => ({
            board_id: b.board_id,
            board_name: b.name
        }))
    };
}

// this function is used to get the next board id
// by retrieving the poperties of collection counter then incrementing it
// and returning the new value
async function getNextBoardId() {
    const db = mongoose.connection.db;
    const counter = await db.collection('counter').findOne({});
    if (!counter) {
        throw new Error("Counter document not found. Please initialize your counter collection.");
    }
    const boardId = (counter.discussion_board || 0) + 1;
    await db.collection('counter').updateOne(
        { _id: counter._id },
        { $set: { discussion_board: boardId } }
    );
    return boardId;
}


// add discussion board
async function AddDiscussionBoardService(courseId, courseName) {
    const db = mongoose.connection.db;
    // Check if course exists
    const course = await db.collection('course').findOne({ course_id: courseId });
    if (!course) {
        return null; 
    }
    const boardId = await getNextBoardId();
    await db.collection('discussion_board').insertOne({
        board_id : boardId,
        course_id : courseId,
        name : courseName
    });

    return {board_id: boardId, course_id: courseId, name: courseName};
}

// delete discussion board
async function DeleteDiscussionBoardService(board_id) {
    const db = mongoose.connection.db;
    const result = await db.collection('discussion_board').deleteOne({ board_id });
    return result.deletedCount > 0;
}
export {
    GetCourseBoardByCourseId,
    AddDiscussionBoardService,
    DeleteDiscussionBoardService,
}