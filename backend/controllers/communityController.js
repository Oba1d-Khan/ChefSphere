import Community from "../models/communityModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";


const createCommunity = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCommunity = new Community({ name, description, createdBy: req.user._id });
        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log("Error in createCommunity: ", error.message);
    }
};

const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user._id;

        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ error: "Community not found" });

        if (!community.members.includes(userId)) {
            community.members.push(userId);
            await community.save();
        }

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommunityPosts = async (req, res) => {
    try {
        const { communityId } = req.params;
        const posts = await Post.find({ community: communityId }).populate('postedBy', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCommunityPost = async (req, res) => {
    try {
        const { communityId } = req.params;
        const post = new Post({
            ...req.body,
            community: communityId,
            postedBy: req.user._id,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommunity = async (req, res) => {
    const { communityId } = req.params;
    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export {
    createCommunity,
    joinCommunity,
    getAllCommunities,
    getCommunityPosts,
    createCommunityPost,
    getCommunity
};
