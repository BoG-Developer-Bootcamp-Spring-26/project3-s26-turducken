import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hoursTrained: {
        type: Number,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    }
});

export default mongoose.models.Animal || mongoose.model("Animal", animalSchema);