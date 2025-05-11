import { 
    FindProjectedPostsByBId,
} from "#src/services/discussion_services/post_services.js"

async function GetOverviewPosts(req, res) {
    const inBoardId = req.params.inBoardId;
    let maxContent = 30;

    try {
        let result = await FindProjectedPostsByBId(inBoardId);

        for (let i = 0; i < result.length; i ++){
            if(result[i].description.length > maxContent){
                result[i].description = result[i].description.substring(0, maxContent).concat("....");
            }
        }

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