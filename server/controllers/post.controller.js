import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!text && !img) {
            return res
                .status(400)
                .json({ error: "Post must either have a text or an image." });
        }

        const newPost = new Post({
            user: userId,
            text: text,
            img: img,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in Create Post Controller", error.message);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
