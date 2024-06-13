import express from 'express';
import {
    createCommunity,
    joinCommunity,
    getAllCommunities,
    getCommunityPosts,
    createCommunityPost,
    getCommunity,
} from "../controllers/communityController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/create', protectRoute, createCommunity);
router.post('/join/:communityId', protectRoute, joinCommunity);
router.get('/all', getAllCommunities);
router.get('/:communityId', getCommunity);
router.get('/:communityId/posts', getCommunityPosts);
router.post('/:communityId/post', protectRoute, createCommunityPost);

export default router;
