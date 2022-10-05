import mongoose from "mongoose"





const Words = new mongoose.Schema({
    collId: { type: mongoose.Schema.Types.ObjectId, ref: "Collections", required: true },
    // eng: { type: String, required: true },
    // // rus: { type: String, required: true }


    words: [
        {
            eng: { type: String, required: true },
            rus: { type: String, required: true }
        }
    ]
})


export default mongoose.model('Words', Words)