import { 
    FindProjectedPostsByBId,
} from "#src/services/discussion_services/post_services.js"

async function GetOverviewPosts(req, res) {
    const inBoardId = req.params.inBoardId;

    try {
        let result = await FindProjectedPostsByBId(inBoardId);

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
    }
}

export {
    GetOverviewPosts,
}