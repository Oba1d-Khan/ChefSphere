import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Community from "../models/communityModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

const createCommunity = async (req, res) => {
    try {
        const community = new Community(req.body);
        await community.save();
        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user._id;

        const community = await Community.findById(communityId);
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
        const posts = await Post.find({ community: communityId });
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

export {
    createCommunity,
    joinCommunity,
    getAllCommunities,
    getCommunityPosts,
    createCommunityPost,
};
