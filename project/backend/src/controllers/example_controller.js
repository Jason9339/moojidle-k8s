import { Example } from "#src/services/example_service.js";

async function GetExampleData(req, res) {
    let result = await Example();

    res.status(200).send(result);
}

export {
    GetExampleData,
}