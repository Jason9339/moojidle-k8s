import ExampleModel from "#src/models/example_model.js";

async function Example() {
    let result;
    try {
        result = await ExampleModel.find()
    } catch (err) {
        console.log(err);
    }

    return result;
}

export {
    Example,
}