import express from "express";
import {
    createPost,
    deletePost,
    getPost,
    likeUnlikePost,
    replyToPost,
    getFeedPosts,
    getUserPosts,
    searchPosts,
    suggestRecipes,
    ratePost
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/search", searchPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.post("/suggest", protectRoute, suggestRecipes);
router.post("/rate", protectRoute, ratePost);


export default router;
