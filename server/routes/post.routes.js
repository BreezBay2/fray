import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    commentOnPost,
    createPost,
    deletePost,
    getAllPosts,
    getFollowingPosts,
    getUserPosts,
    likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

router.delete("/:id", protectRoute, deletePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPosts);

export default router;
