import { 
    FindProjectedPostsByBId,
} from "#src/services/discussion_services/post_services.js"
import { 
    FindOneUserById
} from "#src/services/user_services/user_service.js"

async function GetOverviewPosts(req, res) {
    const inBoardId = req.params.inBoardId;
    let maxContent = 30;

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

export {
    GetOverviewPosts,
}