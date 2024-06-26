import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: false,
        },
        recipeTitle: {
            type: String,
            maxLength: 50,
        },
        text: {
            type: String,
            maxLength: 5000,
        },
        img: {
            type: String,
        },
        recipeOrigin: {
            type: String,
            required: true,
        },
        cookingTime: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
        },
        ingredients: {
            type: [String],
            required: false,
        },
        directions: {
            type: [String],
            required: false,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                userProfilePic: {
                    type: String,
                },
                username: {
                    type: String,
                },
                rating: { type: Number, default: 0 },
                totalRatings: { type: Number, default: 0 },
            },
        ],
        ratings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                score: {
                    type: Number,
                    required: true,
                },
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
