import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

const createPost = async (req, res) => {
	try {
		const { postedBy, text, recipeTitle, recipeOrigin, cookingTime, tags, ingredients, directions } = req.body;
		let { img } = req.body;

		if (!postedBy || !recipeTitle || !text || !cookingTime || !recipeOrigin) {
			return res.status(400).json({ error: "Postedby, title, cooking time, and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 5000;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, recipeTitle, text, recipeOrigin, cookingTime, img, tags, ingredients, directions });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};


const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const searchPosts = async (req, res) => {
	try {
		const search = req.query.q;
		console.log("search :", search);
		if (!search) {
			return res.status(400).json({ error: "Search query is required" });
		}
		const searchedPosts = await Post.find({ recipeTitle: { $regex: search, $options: 'i' } });

		res.status(200).json(searchedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const getAllRecipes = async (req, res) => {
	try {
		const recipes = await Post.find({ category: 'recipe' });
		res.status(200).json(recipes);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const suggestRecipes = async (req, res) => {
	const { ingredients, searchType } = req.body;

	try {
		if (!ingredients || ingredients.length === 0) {
			return res.status(400).json({ error: "Ingredients are required" });
		}

		let recipes;
		if (searchType === "ingredients") {
			const searchRegex = new RegExp(ingredients.join("|"), "i");
			recipes = await Post.find({ text: { $regex: searchRegex } });
		} else if (searchType === "recipe") {
			const searchRegex = new RegExp(ingredients.join("|"), "i");
			recipes = await Post.find({ recipeTitle: { $regex: searchRegex } });
		} else {
			return res.status(400).json({ error: "Invalid search type" });
		}

		res.status(200).json(recipes);
	} catch (error) {
		console.error('Error fetching recipes:', error.message);
		res.status(500).json({ error: "Failed to fetch recipes" });
	}
};

const ratePost = async (req, res) => {
	const { postId, rating } = req.body;
	const userId = req.user._id;

	if (!postId || !rating) {
		return res.status(400).json({ error: 'Post ID and rating are required' });
	}

	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		// Check if the user is the author
		if (post.postedBy.equals(userId)) {
			return res.status(403).json({ error: 'Authors cannot rate their own posts' });
		}

		// Check if the user has already rated the post
		const existingRating = post.ratings.find(r => r.user.equals(userId));

		if (existingRating) {
			existingRating.score = rating;
		} else {
			post.ratings.push({ user: userId, score: rating });
		}

		// Calculate the average rating
		const totalScore = post.ratings.reduce((acc, r) => acc + r.score, 0);
		post.averageRating = totalScore / post.ratings.length;

		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, searchPosts, getAllRecipes, suggestRecipes, ratePost };