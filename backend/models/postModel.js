import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
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
		likes: {
			// array of user ids
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
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Posts", postSchema);

export default Post;

