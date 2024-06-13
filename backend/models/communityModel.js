import mongoose from "mongoose";

const communitySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    interests: [{ type: String, required: true }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
