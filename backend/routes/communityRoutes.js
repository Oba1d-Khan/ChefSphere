import express from "express";
import {
    createCommunity,
    joinCommunity,
    getAllCommunities,
    getCommunityPosts,
    createCommunityPost,
} from "../controllers/communityController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/create', protectRoute, createCommunity);
router.post('/join/:communityId', protectRoute, joinCommunity);
router.post('/:communityId/post', protectRoute, createCommunityPost);

router.get('/all', getAllCommunities);
router.get('/:communityId/posts', getCommunityPosts);

export default router;
