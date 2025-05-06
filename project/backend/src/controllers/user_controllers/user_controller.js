import {
    FindOneUserById,
    FindOnesTagById
} from "#src/services/user_services/user_service.js"

async function GetUserData(req, res) {
    const userId = req.params.userId;

    let resultMain = await FindOneUserById(userId);
    const resultTags = await FindOnesTagById(userId);

    resultMain.user_tags = resultTags;

    if (resultMain) {
        res.status(200).send(resultMain);
    } else {
        res.status(404).send({ message: "User not found" });
    }
}

export {
    GetUserData,
}