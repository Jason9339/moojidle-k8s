import {
    FindOneUserById
} from "#src/services/user_services/user_service.js"

async function GetUserData(req, res) {
    const userId = req.params.userId;

    const result = await FindOneUserById(userId);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send({ message: "User not found" });
    }
}

export {
    GetUserData,
}