import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    commentOnPost,
    createPost,
    deletePost,
    getAllPosts,
    getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);

router.get("/all", protectRoute, getAllPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router;
