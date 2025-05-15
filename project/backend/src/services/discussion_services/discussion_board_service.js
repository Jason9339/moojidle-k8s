import mongoose from "mongoose";


async function FindBoardByID(boardID) {
    try {
        const post = await mongoose.connection.db.collection('discussion_board').findOne({ board_id: boardID });
        return post;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}

export {
    FindBoardByID
}
