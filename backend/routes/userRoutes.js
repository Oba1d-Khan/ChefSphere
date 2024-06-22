// routes/userRoutes.js

import express from "express";
import {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
  getSuggestedUsers,
  freezeAccount,
  addFavorite,
  removeFavorite,
  getFavorites,
  getFollowers,
  getFollowing
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);
router.post('/favorites/:postId', protectRoute, addFavorite);
router.delete('/favorites/:postId', protectRoute, removeFavorite);
router.get('/favorites', protectRoute, getFavorites);
router.get('/followers/:userId', protectRoute, getFollowers);
router.get('/following/:userId', protectRoute, getFollowing);

export default router;
