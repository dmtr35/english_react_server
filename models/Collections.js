import mongoose from "mongoose"





const Collections = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // words: [
    //     {
    //         eng: { type: String, required: true },
    //         rus: { type: String, required: true }
    //     }
    // ]
})



export default mongoose.model('Collections', Collections)