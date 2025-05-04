import mongoose from "mongoose"

// for example purpose, querying all users
async function Example() {
    let result;
    try {
        result = await mongoose.connection.db.collection('user').find().toArray();
    } catch (err) {
        console.log(err);
    }

    return result;
}

export {
    Example,
}