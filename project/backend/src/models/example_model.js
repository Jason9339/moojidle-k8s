import mongoose from 'mongoose';
const { Schema } = mongoose;

const exampleSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
    }
})

export default mongoose.model('ExampleModel', exampleSchema);